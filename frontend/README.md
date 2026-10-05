# Livora — Frontend Mobile Application

The official cross-platform mobile client for **Livora** — on-demand lifestyle management and household concierge service. Built with React Native, Expo SDK 57, Expo Router, and Redux Toolkit with RTK Query.

---

## 📱 Features

- **Alexandria Design System**: Tailored typography, sleek status badges, and responsive layouts.
- **Dynamic Task Booking**: Single-service quick request flow and multi-service detailed questionnaire.
- **Service Request Tracking**: Real-time lifecycle milestones (`pending`, `in_progress`, `completed`).
- **Direct Concierge Chat**: Lifestyle Manager integration with WhatsApp messaging.
- **Seamless Authentication**: Secure email OTP verification with countdown timers and persistent sessions.

---

## 🚀 Running the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

3. Run on your target platform:
   - **Android Emulator**: Press `a` in the terminal.
   - **Physical Device**: Scan the QR code with the Expo Go app.
   - **Web Preview**: Press `w` in the terminal.

---

## 📦 Android Release Build

To build the native release APK:
```bash
npx expo run:android --variant release
```
Or generate the APK via Gradle:
```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```
The APK will be located at `android/app/build/outputs/apk/release/app-release.apk`.
