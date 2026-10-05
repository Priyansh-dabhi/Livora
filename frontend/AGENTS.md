# Livora Frontend — Mobile App Architecture & Guidelines

This is the frontend mobile application for **Livora**, an on-demand lifestyle concierge and household task management platform, built using Expo SDK 57, React Native, and Expo Router.

## Development & Build Rules

- **Dependencies**: ALWAYS use `npx expo install <package>` instead of `npm i` or `yarn add` to avoid SDK version mismatches.
- **Routing**: Expo Router file-based routing (`src/app/`). Screen components live inside `src/app/`, reusable UI/business logic lives in `src/components/`, `src/services/`, and `src/store/`.
- **Typecheck**: Verify changes with `npx tsc --noEmit`.
- **Design System**: Alexandria Design System using vanilla React Native StyleSheet tokens located in `src/theme/`.

---

## 🎨 UI & UX Standards

1. **Alexandria Theme System**:
   - Primary: Deep Blue (`#1D4ED8`)
   - Surface & Backgrounds: Crisp clean whites and slate surfaces (`#F8FAFC`, `#FFFFFF`)
   - Accent & Highlights: Mint (`#E6F4EA`), Amber for pending/soon (`#F59E0B`), Forest Green for completed success (`#15803D`)
2. **Keyboard & Form Usability**:
   - Every form and question input must remain accessible when the on-screen keyboard appears.
   - Use `KeyboardAvoidingView` with `automaticallyAdjustKeyboardInsets={true}` and auto-scroll on focus so the question and input rise smoothly above the keyboard.
3. **No Congestion / Wall of Text**:
   - Keep cards scannable with clear typography, status pills, and intuitive action buttons.
