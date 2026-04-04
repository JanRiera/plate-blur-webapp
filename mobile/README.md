# Plate Blur Mobile

Expo + React Native app for the Android/iOS version of the plate blurring workflow, with Android native development as the first-class path.

## What Is Included

- Expo Router single-screen mobile flow
- `Take Photo` and `Choose Photo` actions via `expo-image-picker`
- On-device ONNX Runtime warm-up and inference with `onnxruntime-react-native`
- Preview rendering with `@shopify/react-native-skia`
- Manual box review with drag and resize handles
- Blur mode and AMG overlay mode
- Save to photo library plus a basic share action for the last saved export
- Tracked native `android/` and `ios/` projects generated from Expo prebuild

## Android Native Workflow

```bash
cd /home/ian/Workspace/plate-blur-webapp/mobile
npm install
npm run android:prebuild
npm run android
```

Prerequisites:

- Node `20.19.4+`
- JDK 17
- Android Studio with an SDK installed
- `adb` available on your `PATH`

## Run Emulator And Test The App

Open a fresh shell, or reload your shell config first:

```bash
source ~/.zshrc
```

Start the local Android 36 emulator that was created for this project:

```bash
emulator @plate-blur-api36
```

If the machine does not have KVM or hardware acceleration available, use the slower software-rendered launch instead:

```bash
emulator @plate-blur-api36 -no-window -no-audio -gpu swiftshader_indirect -accel off
```

Confirm that `adb` can see the emulator:

```bash
adb devices -l
```

Then build and install the app onto the running emulator:

```bash
cd /home/ian/Workspace/plate-blur-webapp/mobile
npm run android
```

Helpful checks while testing:

```bash
adb shell getprop sys.boot_completed
adb logcat
```

## iOS Compatibility

`ios/` prebuilds cleanly from this project, so the config is cross-platform compatible. Native iOS runs still require macOS plus Xcode/CocoaPods.

```bash
cd /home/ian/Workspace/plate-blur-webapp/mobile
npm install
npm run ios:prebuild
npm run ios
```

## Notes

- The Expo SDK 54 toolchain currently expects Node `20.19.4` or newer. A `.nvmrc` file is included to make that requirement explicit.
- The app bundles the current `license-plate-finetune-v1s.onnx` model and `AMG-overlay.png` directly from the existing web prototype.
- Export currently matches the resized in-app working image, the same tradeoff already present in the web app.
- Live camera preview inference is intentionally out of scope for this first pass.
- Android uses the application ID `com.plateblur.mobile` and blocks unneeded audio/video media permissions.
- The current Ubuntu setup works end to end, but `/dev/kvm` is missing on this machine, so emulator boots are functional but slower in software mode.

## Remaining Follow-Up

- Run the Android app on a device or emulator with Java/Android SDK tooling installed locally.
- Validate the iOS native run path on macOS with Xcode/CocoaPods.
- Validate the ONNX model on a real mobile device for operator coverage and acceptable memory use.
- Add a stronger save/share workflow if product needs move beyond a prototype.

See `docs/native-workflow.md` for the step-by-step native setup checklist.
