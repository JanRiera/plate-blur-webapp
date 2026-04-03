import { Asset } from 'expo-asset';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlateEditorCanvas } from '@/components/PlateEditorCanvas';
import { clamp, clampBoxToBounds, createDefaultBox } from '@/lib/detection';
import { exportRedactedPhoto, prepareWorkingPhoto } from '@/lib/skiaUtils';
import { usePlateBlurModel } from '@/hooks/usePlateBlurModel';
import type { PlateBox, RedactionMode, WorkingPhoto } from '@/types/editor';

const overlayModule = require('../assets/images/AMG-overlay.png');

export default function PlateBlurHomeScreen() {
  const [photo, setPhoto] = useState<WorkingPhoto | null>(null);
  const [boxes, setBoxes] = useState<PlateBox[]>([]);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [redactionMode, setRedactionMode] = useState<RedactionMode>('blur');
  const [blurStrength, setBlurStrength] = useState(16);
  const [busyMessage, setBusyMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Choose or capture a photo to begin.');
  const [lastSavedUri, setLastSavedUri] = useState<string | null>(null);
  const [overlayUri, setOverlayUri] = useState<string | null>(null);

  const { status, errorMessage, metrics, supportedBackends, detectBoxes } = usePlateBlurModel();

  useEffect(() => {
    const loadOverlay = async () => {
      const overlayAsset = Asset.fromModule(overlayModule);
      if (!overlayAsset.localUri) {
        await overlayAsset.downloadAsync();
      }
      setOverlayUri(overlayAsset.localUri || overlayAsset.uri || null);
    };

    void loadOverlay();
  }, []);

  const selectedBox = useMemo(
    () => boxes.find((box) => box.id === selectedBoxId) || null,
    [boxes, selectedBoxId],
  );

  const modelStatusLabel = useMemo(() => {
    if (status === 'ready') {
      return 'Model ready on device';
    }
    if (status === 'warming') {
      return 'Warming model on device';
    }
    if (status === 'error') {
      return 'Model failed to load';
    }
    return 'Model idle';
  }, [status]);

  const updateBox = useCallback((boxId: string, nextBox: PlateBox) => {
    setBoxes((currentBoxes) =>
      currentBoxes.map((box) => (box.id === boxId ? nextBox : box)),
    );
  }, []);

  const runDetection = useCallback(
    async (targetPhoto: WorkingPhoto, options: { announceEmpty?: boolean } = {}) => {
      const { announceEmpty = true } = options;
      setBusyMessage('Detecting plates on-device...');
      try {
        const detectedBoxes = await detectBoxes(targetPhoto);
        setBoxes(detectedBoxes);
        setSelectedBoxId(detectedBoxes[0]?.id ?? null);
        setStatusMessage(
          detectedBoxes.length
            ? `Detected ${detectedBoxes.length} plate area${detectedBoxes.length === 1 ? '' : 's'}. Review before saving.`
            : announceEmpty
              ? 'No reliable plates were detected. Add a box manually if needed.'
              : 'Photo prepared. Add a box manually if detection misses anything.',
        );
      } catch (error) {
        console.error(error);
        setStatusMessage('Detection failed on this device build. You can still add a manual box.');
      } finally {
        setBusyMessage(null);
      }
    },
    [detectBoxes],
  );

  const loadPickedPhoto = useCallback(
    async (result: ImagePicker.ImagePickerResult) => {
      if (result.canceled || !result.assets?.length) {
        return;
      }

      const pickedAsset = result.assets[0];
      setBusyMessage('Preparing photo...');

      try {
        const preparedPhoto = await prepareWorkingPhoto({
          uri: pickedAsset.uri,
          width: pickedAsset.width,
          height: pickedAsset.height,
          fileName: pickedAsset.fileName,
        });
        setPhoto(preparedPhoto);
        setBoxes([]);
        setSelectedBoxId(null);
        setLastSavedUri(null);
        setStatusMessage('Photo loaded. Running automatic plate detection...');
        await runDetection(preparedPhoto, { announceEmpty: true });
      } catch (error) {
        console.error(error);
        setStatusMessage('That photo could not be prepared on this device.');
      } finally {
        setBusyMessage(null);
      }
    },
    [runDetection],
  );

  const chooseFromLibrary = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
      allowsMultipleSelection: false,
    });
    await loadPickedPhoto(result);
  }, [loadPickedPhoto]);

  const capturePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera access needed', 'Allow camera access so the app can capture and blur a plate photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });
    await loadPickedPhoto(result);
  }, [loadPickedPhoto]);

  const addManualBox = useCallback(() => {
    if (!photo) {
      return;
    }
    const nextBox = createDefaultBox(photo);
    setBoxes((currentBoxes) => [...currentBoxes, nextBox]);
    setSelectedBoxId(nextBox.id);
    setStatusMessage('Added a manual redaction box.');
  }, [photo]);

  const deleteSelectedBox = useCallback(() => {
    if (!selectedBoxId) {
      return;
    }
    setBoxes((currentBoxes) => currentBoxes.filter((box) => box.id !== selectedBoxId));
    setSelectedBoxId(null);
    setStatusMessage('Removed the selected redaction box.');
  }, [selectedBoxId]);

  const clearAllBoxes = useCallback(() => {
    setBoxes([]);
    setSelectedBoxId(null);
    setStatusMessage('Cleared all redaction boxes.');
  }, []);

  const saveToLibrary = useCallback(async () => {
    if (!photo) {
      return;
    }
    setBusyMessage('Rendering redacted photo...');

    try {
      const exportedUri = await exportRedactedPhoto({
        photo,
        boxes,
        mode: redactionMode,
        blurStrength,
        overlayUri,
      });

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('media-library-permission-denied');
      }

      await MediaLibrary.saveToLibraryAsync(exportedUri);
      setLastSavedUri(exportedUri);
      setStatusMessage('Saved the redacted photo to your library.');
    } catch (error) {
      console.error(error);
      setStatusMessage('Saving failed. Check photo library permission and try again.');
    } finally {
      setBusyMessage(null);
    }
  }, [blurStrength, boxes, overlayUri, photo, redactionMode]);

  const shareLastSave = useCallback(async () => {
    if (!lastSavedUri) {
      return;
    }
    try {
      await Share.share({
        url: lastSavedUri,
        message: 'Plate Blur redacted photo',
      });
    } catch (error) {
      console.error(error);
    }
  }, [lastSavedUri]);

  const canEdit = Boolean(photo) && !busyMessage;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>On-device plate redaction</Text>
          <Text style={styles.title}>Plate Blur Mobile</Text>
          <Text style={styles.subtitle}>
            Capture or import a photo, automatically detect license plates on-device, then review and save a blurred or AMG-overlay result.
          </Text>

          <View style={styles.statusRow}>
            <View style={[styles.statusPill, status === 'ready' ? styles.statusPillReady : status === 'error' ? styles.statusPillError : styles.statusPillLoading]}>
              <Text style={styles.statusPillText}>{modelStatusLabel}</Text>
            </View>
            <Text style={styles.backendText}>Backends: {supportedBackends.join(', ') || 'none reported'}</Text>
          </View>

          <Text style={styles.bannerText}>{errorMessage ? `${statusMessage} ${errorMessage}` : statusMessage}</Text>

          <View style={styles.primaryActionGrid}>
            <Pressable style={styles.primaryButton} onPress={capturePhoto} disabled={Boolean(busyMessage)}>
              <Text style={styles.primaryButtonText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={chooseFromLibrary} disabled={Boolean(busyMessage)}>
              <Text style={styles.secondaryButtonText}>Choose Photo</Text>
            </Pressable>
          </View>

          <View style={styles.metricsRow}>
            <MetricCard label="Warm-up" value={metrics.sessionLoadMs != null ? `${metrics.sessionLoadMs} ms` : 'Pending'} />
            <MetricCard label="First Detect" value={metrics.firstDetectMs != null ? `${metrics.firstDetectMs} ms` : 'Pending'} />
          </View>
        </View>

        {busyMessage ? (
          <View style={styles.busyCard}>
            <ActivityIndicator color="#2563eb" />
            <Text style={styles.busyText}>{busyMessage}</Text>
          </View>
        ) : null}

        {photo ? (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardEyebrow}>Preview</Text>
                  <Text style={styles.cardTitle}>{photo.fileName}</Text>
                </View>
                <Text style={styles.cardMeta}>
                  {photo.width} x {photo.height}
                </Text>
              </View>

              <PlateEditorCanvas
                photo={photo}
                boxes={boxes}
                selectedBoxId={selectedBoxId}
                mode={redactionMode}
                blurStrength={blurStrength}
                onSelectBox={setSelectedBoxId}
                onChangeBox={updateBox}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardEyebrow}>Quick actions</Text>
              <View style={styles.primaryActionGrid}>
                <Pressable style={styles.primaryButton} onPress={() => void runDetection(photo)} disabled={!canEdit}>
                  <Text style={styles.primaryButtonText}>Auto Detect</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={addManualBox} disabled={!canEdit}>
                  <Text style={styles.secondaryButtonText}>Add Box</Text>
                </Pressable>
              </View>
              <View style={styles.primaryActionGrid}>
                <Pressable style={styles.primaryButton} onPress={saveToLibrary} disabled={!canEdit}>
                  <Text style={styles.primaryButtonText}>Save to Library</Text>
                </Pressable>
                <Pressable
                  style={[styles.secondaryButton, !lastSavedUri ? styles.disabledButton : null]}
                  onPress={shareLastSave}
                  disabled={!lastSavedUri}
                >
                  <Text style={styles.secondaryButtonText}>Share Last Save</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardEyebrow}>Adjustments</Text>
              <View style={styles.modeToggleRow}>
                <ModeButton label="Blur" active={redactionMode === 'blur'} onPress={() => setRedactionMode('blur')} />
                <ModeButton label="AMG Overlay" active={redactionMode === 'amg'} onPress={() => setRedactionMode('amg')} />
              </View>

              <View style={styles.stepperCard}>
                <Text style={styles.stepperLabel}>Blur strength</Text>
                <View style={styles.stepperControls}>
                  <Pressable
                    style={styles.stepperButton}
                    onPress={() => setBlurStrength((currentValue) => clamp(currentValue - 2, 4, 40))}
                    disabled={redactionMode !== 'blur'}
                  >
                    <Text style={styles.stepperButtonText}>-</Text>
                  </Pressable>
                  <Text style={[styles.stepperValue, redactionMode !== 'blur' ? styles.disabledText : null]}>
                    {blurStrength}
                  </Text>
                  <Pressable
                    style={styles.stepperButton}
                    onPress={() => setBlurStrength((currentValue) => clamp(currentValue + 2, 4, 40))}
                    disabled={redactionMode !== 'blur'}
                  >
                    <Text style={styles.stepperButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardEyebrow}>Boxes</Text>
              <View style={styles.primaryActionGrid}>
                <Pressable
                  style={[styles.secondaryButton, !selectedBox ? styles.disabledButton : null]}
                  onPress={deleteSelectedBox}
                  disabled={!selectedBox}
                >
                  <Text style={styles.secondaryButtonText}>Delete Selected</Text>
                </Pressable>
                <Pressable
                  style={[styles.secondaryButton, !boxes.length ? styles.disabledButton : null]}
                  onPress={clearAllBoxes}
                  disabled={!boxes.length}
                >
                  <Text style={styles.secondaryButtonText}>Clear All</Text>
                </Pressable>
              </View>

              {boxes.length ? (
                boxes.map((box, index) => (
                  <Pressable
                    key={box.id}
                    onPress={() => setSelectedBoxId(box.id)}
                    style={[styles.boxListItem, box.id === selectedBoxId ? styles.boxListItemSelected : null]}
                  >
                    <Text style={styles.boxListTitle}>
                      Area {index + 1} · {box.label === 'plate' ? 'plate' : 'manual'}
                    </Text>
                    <Text style={styles.boxListMeta}>
                      {Math.round(box.width)} x {Math.round(box.height)}
                      {box.confidence != null ? ` · ${Math.round(box.confidence * 100)}%` : ''}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text style={styles.emptyStateText}>No redaction boxes yet. Use Auto Detect or add one manually.</Text>
              )}
            </View>
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Ready for a photo</Text>
            <Text style={styles.emptyBody}>
              The mobile app warms the ONNX model when the screen opens so your first detection is as fast as the device allows.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function ModeButton(props: { label: string; active: boolean; onPress: () => void }) {
  const { label, active, onPress } = props;
  return (
    <Pressable style={[styles.modeButton, active ? styles.modeButtonActive : null]} onPress={onPress}>
      <Text style={[styles.modeButtonText, active ? styles.modeButtonTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eef3f7',
  },
  content: {
    padding: 18,
    gap: 16,
  },
  heroCard: {
    padding: 20,
    borderRadius: 28,
    backgroundColor: '#0f172a',
    gap: 14,
  },
  eyebrow: {
    color: '#7dd3fc',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  statusRow: {
    gap: 10,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusPillReady: {
    backgroundColor: 'rgba(16,185,129,0.16)',
  },
  statusPillLoading: {
    backgroundColor: 'rgba(59,130,246,0.16)',
  },
  statusPillError: {
    backgroundColor: 'rgba(239,68,68,0.18)',
  },
  statusPillText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  backendText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  bannerText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
  primaryActionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.45,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(148,163,184,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.16)',
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: {
    marginTop: 6,
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  busyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#dbeafe',
  },
  busyText: {
    color: '#1e3a8a',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe3ef',
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardEyebrow: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardTitle: {
    marginTop: 4,
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '800',
  },
  cardMeta: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  modeButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  modeButtonText: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '700',
  },
  modeButtonTextActive: {
    color: '#1d4ed8',
  },
  stepperCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbe3ef',
    gap: 10,
  },
  stepperLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  stepperButtonText: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '800',
  },
  stepperValue: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '800',
  },
  disabledText: {
    color: '#94a3b8',
  },
  boxListItem: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbe3ef',
    backgroundColor: '#f8fafc',
    gap: 4,
  },
  boxListItemSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  boxListTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  boxListMeta: {
    color: '#475569',
    fontSize: 12,
  },
  emptyStateText: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe3ef',
    gap: 10,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '800',
  },
  emptyBody: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
});
