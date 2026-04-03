# Plate Blur Mobile

Expo + React Native scaffold for the Android/iOS version of the plate blurring app.

## What Is Included

- Expo Router single-screen mobile flow
- `Take Photo` and `Choose Photo` actions via `expo-image-picker`
- On-device ONNX Runtime warm-up and inference with `onnxruntime-react-native`
- Preview rendering with `@shopify/react-native-skia`
- Manual box review with drag and resize handles
- Blur mode and AMG overlay mode
- Save to photo library plus a basic share action for the last saved export

## Setup

```bash
cd /home/ian/Workspace/plate-blur-webapp/mobile
npm install
npx expo prebuild
npm run android
```

For iOS:

```bash
cd /home/ian/Workspace/plate-blur-webapp/mobile
npx expo prebuild
npm run ios
```

## Notes

- The generated Expo SDK 54 toolchain currently warns that React Native 0.81 expects Node `20.19.4` or newer. A `.nvmrc` file is included to make that requirement explicit.
- The app bundles the current `license-plate-finetune-v1s.onnx` model and `AMG-overlay.png` directly from the existing web prototype.
- Export currently matches the resized in-app working image, the same tradeoff already present in the web app.
- Live camera preview inference is intentionally out of scope for this first pass.

## Remaining Follow-Up

- Run `npx expo prebuild` and a native build on actual Android/iOS targets once the local Node runtime is updated.
- Validate the ONNX model on a real mobile device for operator coverage and acceptable memory use.
- Add a stronger save/share workflow if product needs move beyond a prototype.
