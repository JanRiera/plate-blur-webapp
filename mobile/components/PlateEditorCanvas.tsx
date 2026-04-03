import {
  BackdropBlur,
  Canvas,
  Image as SkiaImage,
  Rect,
  useImage,
} from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import type { PlateBox, RedactionMode, WorkingPhoto } from '@/types/editor';
import { clamp, clampBoxToBounds } from '@/lib/detection';
import { blurSigmaFromStrength } from '@/lib/skiaUtils';

type EditorFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
};

type PlateEditorCanvasProps = {
  photo: WorkingPhoto;
  boxes: PlateBox[];
  selectedBoxId: string | null;
  mode: RedactionMode;
  blurStrength: number;
  onSelectBox: (boxId: string) => void;
  onChangeBox: (boxId: string, nextBox: PlateBox) => void;
};

type EditableBoxOverlayProps = {
  box: PlateBox;
  frame: EditorFrame;
  imageWidth: number;
  imageHeight: number;
  isSelected: boolean;
  onSelectBox: (boxId: string) => void;
  onChangeBox: (boxId: string, nextBox: PlateBox) => void;
};

const handlePositionStyles = {
  topLeft: { left: -11, top: -11 },
  topRight: { right: -11, top: -11 },
  bottomLeft: { left: -11, bottom: -11 },
  bottomRight: { right: -11, bottom: -11 },
} as const;

function getDisplayFrame(width: number, height: number, photo: WorkingPhoto): EditorFrame {
  if (!width || !height || !photo.width || !photo.height) {
    return { x: 0, y: 0, width: 0, height: 0, scale: 1 };
  }

  const scale = Math.min(width / photo.width, height / photo.height);
  const scaledWidth = photo.width * scale;
  const scaledHeight = photo.height * scale;

  return {
    x: (width - scaledWidth) / 2,
    y: (height - scaledHeight) / 2,
    width: scaledWidth,
    height: scaledHeight,
    scale,
  };
}

function toDisplayRect(box: PlateBox, frame: EditorFrame) {
  return {
    left: frame.x + box.x * frame.scale,
    top: frame.y + box.y * frame.scale,
    width: box.width * frame.scale,
    height: box.height * frame.scale,
  };
}

function resizeBoxFromCorner(
  startBox: PlateBox,
  corner: keyof typeof handlePositionStyles,
  dx: number,
  dy: number,
  scale: number,
  imageWidth: number,
  imageHeight: number,
) {
  const minimumSize = Math.max(36, 28 / Math.max(scale, 0.1));
  const deltaX = dx / Math.max(scale, 0.1);
  const deltaY = dy / Math.max(scale, 0.1);

  const rightEdge = startBox.x + startBox.width;
  const bottomEdge = startBox.y + startBox.height;

  let nextX = startBox.x;
  let nextY = startBox.y;
  let nextWidth = startBox.width;
  let nextHeight = startBox.height;

  if (corner === 'topLeft' || corner === 'bottomLeft') {
    nextX = clamp(startBox.x + deltaX, 0, rightEdge - minimumSize);
    nextWidth = rightEdge - nextX;
  }
  if (corner === 'topRight' || corner === 'bottomRight') {
    const nextRight = clamp(rightEdge + deltaX, startBox.x + minimumSize, imageWidth);
    nextWidth = nextRight - startBox.x;
  }
  if (corner === 'topLeft' || corner === 'topRight') {
    nextY = clamp(startBox.y + deltaY, 0, bottomEdge - minimumSize);
    nextHeight = bottomEdge - nextY;
  }
  if (corner === 'bottomLeft' || corner === 'bottomRight') {
    const nextBottom = clamp(bottomEdge + deltaY, startBox.y + minimumSize, imageHeight);
    nextHeight = nextBottom - startBox.y;
  }

  return clampBoxToBounds(
    {
      ...startBox,
      x: nextX,
      y: nextY,
      width: nextWidth,
      height: nextHeight,
    },
    imageWidth,
    imageHeight,
    minimumSize,
  );
}

function EditableBoxOverlay(props: EditableBoxOverlayProps) {
  const {
    box,
    frame,
    imageWidth,
    imageHeight,
    isSelected,
    onSelectBox,
    onChangeBox,
  } = props;

  const currentBoxRef = useRef(box);
  const activeBoxRef = useRef<PlateBox | null>(null);

  useEffect(() => {
    currentBoxRef.current = box;
  }, [box]);

  const moveResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          activeBoxRef.current = currentBoxRef.current;
          onSelectBox(box.id);
        },
        onPanResponderMove: (_event, gestureState) => {
          if (!activeBoxRef.current) {
            return;
          }
          const deltaX = gestureState.dx / Math.max(frame.scale, 0.1);
          const deltaY = gestureState.dy / Math.max(frame.scale, 0.1);
          onChangeBox(
            box.id,
            clampBoxToBounds(
              {
                ...activeBoxRef.current,
                x: activeBoxRef.current.x + deltaX,
                y: activeBoxRef.current.y + deltaY,
              },
              imageWidth,
              imageHeight,
            ),
          );
        },
      }),
    [box.id, frame.scale, imageHeight, imageWidth, onChangeBox, onSelectBox],
  );

  const createHandleResponder = (corner: keyof typeof handlePositionStyles) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        activeBoxRef.current = currentBoxRef.current;
        onSelectBox(box.id);
      },
      onPanResponderMove: (_event, gestureState) => {
        if (!activeBoxRef.current) {
          return;
        }
        onChangeBox(
          box.id,
          resizeBoxFromCorner(
            activeBoxRef.current,
            corner,
            gestureState.dx,
            gestureState.dy,
            frame.scale,
            imageWidth,
            imageHeight,
          ),
        );
      },
    });

  const topLeftResponder = useMemo(() => createHandleResponder('topLeft'), [box.id, frame.scale, imageHeight, imageWidth, onChangeBox, onSelectBox]);
  const topRightResponder = useMemo(() => createHandleResponder('topRight'), [box.id, frame.scale, imageHeight, imageWidth, onChangeBox, onSelectBox]);
  const bottomLeftResponder = useMemo(() => createHandleResponder('bottomLeft'), [box.id, frame.scale, imageHeight, imageWidth, onChangeBox, onSelectBox]);
  const bottomRightResponder = useMemo(() => createHandleResponder('bottomRight'), [box.id, frame.scale, imageHeight, imageWidth, onChangeBox, onSelectBox]);

  const displayRect = toDisplayRect(box, frame);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.boxShell,
        {
          left: displayRect.left,
          top: displayRect.top,
          width: displayRect.width,
          height: displayRect.height,
        },
      ]}
    >
      <View
        {...moveResponder.panHandlers}
        style={[styles.boxBorder, isSelected ? styles.boxBorderSelected : styles.boxBorderIdle]}
      >
        <View style={[styles.boxBadge, isSelected ? styles.boxBadgeSelected : null]}>
          <Text style={styles.boxBadgeText}>
            {box.label === 'plate' ? 'Plate' : 'Manual'}
            {box.confidence != null ? ` ${Math.round(box.confidence * 100)}%` : ''}
          </Text>
        </View>
      </View>

      {isSelected ? (
        <>
          <View {...topLeftResponder.panHandlers} style={[styles.handle, handlePositionStyles.topLeft]} />
          <View {...topRightResponder.panHandlers} style={[styles.handle, handlePositionStyles.topRight]} />
          <View {...bottomLeftResponder.panHandlers} style={[styles.handle, handlePositionStyles.bottomLeft]} />
          <View {...bottomRightResponder.panHandlers} style={[styles.handle, handlePositionStyles.bottomRight]} />
        </>
      ) : null}
    </View>
  );
}

export function PlateEditorCanvas(props: PlateEditorCanvasProps) {
  const {
    photo,
    boxes,
    selectedBoxId,
    mode,
    blurStrength,
    onSelectBox,
    onChangeBox,
  } = props;

  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });
  const sourceImage = useImage(photo.uri);
  const overlayImage = useImage(require('../assets/images/AMG-overlay.png'));

  const frame = useMemo(
    () => getDisplayFrame(layoutSize.width, layoutSize.height, photo),
    [layoutSize.height, layoutSize.width, photo],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayoutSize({ width, height });
  };

  return (
    <View style={styles.stage} onLayout={handleLayout}>
      {sourceImage ? (
        <>
          <Canvas style={StyleSheet.absoluteFill}>
            <SkiaImage
              image={sourceImage}
              x={frame.x}
              y={frame.y}
              width={frame.width}
              height={frame.height}
              fit="contain"
            />

            {mode === 'blur'
              ? boxes.map((box) => {
                  const displayRect = toDisplayRect(box, frame);
                  return (
                    <BackdropBlur
                      key={box.id}
                      blur={blurSigmaFromStrength(blurStrength)}
                      clip={{
                        x: displayRect.left,
                        y: displayRect.top,
                        width: displayRect.width,
                        height: displayRect.height,
                      }}
                    />
                  );
                })
              : boxes.map((box) => {
                  const displayRect = toDisplayRect(box, frame);
                  if (!overlayImage) {
                    return (
                      <Rect
                        key={box.id}
                        x={displayRect.left}
                        y={displayRect.top}
                        width={displayRect.width}
                        height={displayRect.height}
                        color="rgba(17,24,39,0.78)"
                      />
                    );
                  }

                  return (
                    <SkiaImage
                      key={box.id}
                      image={overlayImage}
                      x={displayRect.left}
                      y={displayRect.top}
                      width={displayRect.width}
                      height={displayRect.height}
                      fit="fill"
                    />
                  );
                })}
          </Canvas>

          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {boxes.map((box) => (
              <EditableBoxOverlay
                key={box.id}
                box={box}
                frame={frame}
                imageWidth={photo.width}
                imageHeight={photo.height}
                isSelected={box.id === selectedBoxId}
                onSelectBox={onSelectBox}
                onChangeBox={onChangeBox}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.loadingState}>
          <Text style={styles.loadingStateText}>Preparing preview...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    position: 'relative',
    width: '100%',
    minHeight: 320,
    height: 420,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#0f172a',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingStateText: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '600',
  },
  boxShell: {
    position: 'absolute',
  },
  boxBorder: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
  },
  boxBorderIdle: {
    borderColor: 'rgba(239,68,68,0.92)',
    backgroundColor: 'rgba(239,68,68,0.06)',
  },
  boxBorderSelected: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37,99,235,0.08)',
    borderWidth: 3,
  },
  boxBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.82)',
  },
  boxBadgeSelected: {
    backgroundColor: '#2563eb',
  },
  boxBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  handle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#2563eb',
  },
});
