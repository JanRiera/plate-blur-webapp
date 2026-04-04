# Native Workflow

This branch keeps Expo for app structure, routing, and config, but it now tracks the generated native projects so Android and iOS work can move in a normal native workflow.

## Status

- `android/` prebuild succeeds in this repo
- `ios/` prebuild also succeeds, so the project remains cross-platform compatible
- Android is still the recommended first target because this environment does not include macOS/Xcode tooling

## Android Setup

1. Use Node `20.19.4` or newer.
2. Install JDK 17.
3. Install Android Studio and at least one Android SDK platform.
4. Add `adb` to your `PATH`.
5. Export either `ANDROID_HOME` or `ANDROID_SDK_ROOT`.

## Android Commands

```bash
cd /home/ian/Workspace/plate-blur-webapp/mobile
npm install
npm run android:prebuild
npm run android
```

Useful variations:

- `npm run android:clean` regenerates the Android native project from Expo config
- `npx expo run:android --device` targets a connected device

## Emulator Workflow

Reload your shell config if you just installed the SDK locally:

```bash
source ~/.zshrc
```

Start the named emulator:

```bash
emulator @plate-blur-api36
```

If KVM is unavailable on the host, fall back to software mode:

```bash
emulator @plate-blur-api36 -no-window -no-audio -gpu swiftshader_indirect -accel off
```

Verify the emulator is visible to `adb`:

```bash
adb devices -l
adb shell getprop sys.boot_completed
```

Install and run the Expo app on the emulator:

```bash
cd /home/ian/Workspace/plate-blur-webapp/mobile
npm run android
```

For debugging:

```bash
adb logcat
```

## iOS Commands

```bash
cd /home/ian/Workspace/plate-blur-webapp/mobile
npm install
npm run ios:prebuild
npm run ios
```

iOS native runs require macOS, Xcode, and CocoaPods. This Linux environment can verify prebuild compatibility, but not a full iOS compile.

## Current Native Decisions

- Package and bundle identifier: `com.plateblur.mobile`
- New architecture remains enabled
- The app only requests the Android media permissions needed for images, plus camera access
- Audio and video media permissions are explicitly blocked
- The verified local AVD name is `plate-blur-api36`
- This Linux host currently boots the emulator in software mode because `/dev/kvm` is unavailable

## Next Native Milestones

- Run the Android app on a physical device and confirm ONNX Runtime operator coverage
- Measure memory use and first-detect latency on a mid-range Android phone
- Replace the placeholder app icons and launch assets
- Decide whether export sharing should move from the generic React Native share sheet to a platform-specific file-sharing flow
