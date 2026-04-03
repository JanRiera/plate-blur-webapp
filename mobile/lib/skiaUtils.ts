import * as FileSystem from 'expo-file-system/legacy';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {
  ClipOp,
  ImageFormat,
  Skia,
  TileMode,
  type SkImage,
} from '@shopify/react-native-skia';

import type { PlateBox, RedactionMode, WorkingPhoto } from '@/types/editor';

type SourcePhoto = {
  uri: string;
  width: number;
  height: number;
  fileName?: string | null;
};

export function blurSigmaFromStrength(blurStrength: number) {
  return Math.max(3, blurStrength * 0.75);
}

export async function prepareWorkingPhoto(sourcePhoto: SourcePhoto): Promise<WorkingPhoto> {
  const largestEdge = Math.max(sourcePhoto.width, sourcePhoto.height);
  if (!largestEdge || largestEdge <= 1200) {
    return {
      uri: sourcePhoto.uri,
      width: sourcePhoto.width,
      height: sourcePhoto.height,
      fileName: sourcePhoto.fileName || 'photo.jpg',
    };
  }

  const scale = 1200 / largestEdge;
  const width = Math.max(1, Math.round(sourcePhoto.width * scale));
  const height = Math.max(1, Math.round(sourcePhoto.height * scale));
  const resizedPhoto = await manipulateAsync(
    sourcePhoto.uri,
    [{ resize: { width, height } }],
    {
      compress: 0.92,
      format: SaveFormat.JPEG,
    },
  );

  return {
    uri: resizedPhoto.uri,
    width: resizedPhoto.width,
    height: resizedPhoto.height,
    fileName: sourcePhoto.fileName || 'photo.jpg',
  };
}

export async function loadSkiaImageFromUri(uri: string): Promise<SkImage> {
  const data = await Skia.Data.fromURI(uri);
  const image = Skia.Image.MakeImageFromEncoded(data);
  if (!image) {
    throw new Error('image-decode-failed');
  }
  return image;
}

export async function buildTensorDataFromImageUri(imageUri: string): Promise<Float32Array> {
  const sourceImage = await loadSkiaImageFromUri(imageUri);
  const surface = Skia.Surface.MakeOffscreen(640, 640) ?? Skia.Surface.Make(640, 640);
  if (!surface) {
    throw new Error('surface-unavailable');
  }

  const canvas = surface.getCanvas();
  const paint = Skia.Paint();
  canvas.drawImageRect(
    sourceImage,
    Skia.XYWHRect(0, 0, sourceImage.width(), sourceImage.height()),
    Skia.XYWHRect(0, 0, 640, 640),
    paint,
  );
  surface.flush();

  const scaledImage = surface.makeImageSnapshot();
  const pixels = scaledImage.readPixels();
  if (!(pixels instanceof Uint8Array)) {
    throw new Error('pixel-read-failed');
  }

  const pixelCount = 640 * 640;
  const tensorData = new Float32Array(pixelCount * 3);
  for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
    tensorData[pixelIndex] = pixels[pixelIndex * 4] / 255;
    tensorData[pixelCount + pixelIndex] = pixels[pixelIndex * 4 + 1] / 255;
    tensorData[pixelCount * 2 + pixelIndex] = pixels[pixelIndex * 4 + 2] / 255;
  }

  return tensorData;
}

export async function exportRedactedPhoto(options: {
  photo: WorkingPhoto;
  boxes: PlateBox[];
  mode: RedactionMode;
  blurStrength: number;
  overlayUri?: string | null;
}) {
  const { photo, boxes, mode, blurStrength, overlayUri } = options;
  const surface = Skia.Surface.MakeOffscreen(photo.width, photo.height) ?? Skia.Surface.Make(photo.width, photo.height);
  if (!surface) {
    throw new Error('surface-unavailable');
  }

  const sourceImage = await loadSkiaImageFromUri(photo.uri);
  const canvas = surface.getCanvas();
  const imageRect = Skia.XYWHRect(0, 0, sourceImage.width(), sourceImage.height());
  const destinationRect = Skia.XYWHRect(0, 0, photo.width, photo.height);
  const sourcePaint = Skia.Paint();

  canvas.drawImageRect(sourceImage, imageRect, destinationRect, sourcePaint);

  if (mode === 'blur') {
    const blurPaint = Skia.Paint();
    blurPaint.setImageFilter(
      Skia.ImageFilter.MakeBlur(
        blurSigmaFromStrength(blurStrength),
        blurSigmaFromStrength(blurStrength),
        TileMode.Clamp,
        null,
        null,
      ),
    );

    boxes.forEach((box) => {
      canvas.save();
      canvas.clipRect(Skia.XYWHRect(box.x, box.y, box.width, box.height), ClipOp.Intersect, true);
      canvas.drawImageRect(sourceImage, imageRect, destinationRect, blurPaint);
      canvas.restore();
    });
  } else {
    if (!overlayUri) {
      throw new Error('overlay-unavailable');
    }
    const overlayImage = await loadSkiaImageFromUri(overlayUri);
    const overlayPaint = Skia.Paint();
    const overlaySourceRect = Skia.XYWHRect(0, 0, overlayImage.width(), overlayImage.height());

    boxes.forEach((box) => {
      canvas.drawImageRect(
        overlayImage,
        overlaySourceRect,
        Skia.XYWHRect(box.x, box.y, box.width, box.height),
        overlayPaint,
      );
    });
  }

  surface.flush();
  const outputImage = surface.makeImageSnapshot();
  const destinationDirectory = FileSystem.cacheDirectory || FileSystem.documentDirectory;
  if (!destinationDirectory) {
    throw new Error('filesystem-unavailable');
  }
  const destinationUri = `${destinationDirectory}plate-blur-${Date.now()}.jpg`;
  await FileSystem.writeAsStringAsync(destinationUri, outputImage.encodeToBase64(ImageFormat.JPEG, 95), {
    encoding: FileSystem.EncodingType.Base64,
  });
  return destinationUri;
}
