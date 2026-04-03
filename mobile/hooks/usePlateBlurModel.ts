import { Asset } from 'expo-asset';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';
import { InferenceSession, listSupportedBackends, Tensor } from 'onnxruntime-react-native';

import { detectionsToBoxes, parseDetections } from '@/lib/detection';
import { buildTensorDataFromImageUri } from '@/lib/skiaUtils';
import type { DetectionMetrics, ModelStatus, PlateBox, WorkingPhoto } from '@/types/editor';

const plateModelModule = require('../assets/models/license-plate-finetune-v1s.onnx');

export function usePlateBlurModel() {
  const [status, setStatus] = useState<ModelStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DetectionMetrics>({
    sessionLoadMs: null,
    firstDetectMs: null,
  });

  const sessionRef = useRef<InferenceSession | null>(null);
  const sessionPromiseRef = useRef<Promise<InferenceSession> | null>(null);
  const supportedBackends = listSupportedBackends().map((backend) => backend.name);

  const ensureSession = useCallback(async (silent = false) => {
    if (sessionRef.current) {
      setStatus('ready');
      return sessionRef.current;
    }

    if (!sessionPromiseRef.current) {
      if (!silent) {
        setStatus('warming');
      } else {
        setStatus((currentStatus) => (currentStatus === 'idle' ? 'warming' : currentStatus));
      }

      sessionPromiseRef.current = (async () => {
        const startedAt = Date.now();
        const modelAsset = Asset.fromModule(plateModelModule);
        if (!modelAsset.localUri) {
          await modelAsset.downloadAsync();
        }
        const modelUri = modelAsset.localUri || modelAsset.uri;
        if (!modelUri) {
          throw new Error('model-uri-unavailable');
        }
        const session = await InferenceSession.create(modelUri);
        sessionRef.current = session;
        setMetrics((currentMetrics) => ({
          ...currentMetrics,
          sessionLoadMs: Date.now() - startedAt,
        }));
        setStatus('ready');
        setErrorMessage(null);
        return session;
      })().catch((error: Error) => {
        sessionPromiseRef.current = null;
        setStatus('error');
        setErrorMessage(error.message);
        throw error;
      });
    }

    return sessionPromiseRef.current;
  }, []);

  const warmupModel = useCallback(async () => {
    try {
      await ensureSession(true);
    } catch {
      return null;
    }
    return sessionRef.current;
  }, [ensureSession]);

  const detectBoxes = useCallback(
    async (photo: WorkingPhoto): Promise<PlateBox[]> => {
      const startedAt = Date.now();
      const session = await ensureSession(false);
      const tensorData = await buildTensorDataFromImageUri(photo.uri);
      const inputName = session.inputNames?.[0] || 'images';
      const output = await session.run({
        [inputName]: new Tensor('float32', tensorData, [1, 3, 640, 640]),
      });
      const outputName = session.outputNames?.[0] || Object.keys(output)[0];
      const nextBoxes = detectionsToBoxes(
        parseDetections(
          output[outputName] as { data: ArrayLike<number>; dims?: readonly number[] | number[] },
          photo.width,
          photo.height,
        ),
      );

      setMetrics((currentMetrics) => ({
        ...currentMetrics,
        firstDetectMs: currentMetrics.firstDetectMs ?? Date.now() - startedAt,
      }));

      return nextBoxes;
    },
    [ensureSession],
  );

  useEffect(() => {
    const interactionTask = InteractionManager.runAfterInteractions(() => {
      void warmupModel();
    });

    return () => {
      interactionTask.cancel();
    };
  }, [warmupModel]);

  return {
    status,
    errorMessage,
    metrics,
    supportedBackends,
    warmupModel,
    detectBoxes,
  };
}
