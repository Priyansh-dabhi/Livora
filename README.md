# Livora — Lifestyle & Household Task Concierge

Livora is an on-demand personal concierge and household management platform designed to take care of daily errands, home repairs, healthcare assistance, and lifestyle coordination through dedicated Lifestyle Managers.

---

## 🌟 Overview & Highlights

- **3-Level Structured Catalog**: Categories, Help Types, and Detailed Activities (Errands, Home Maintenance, Pet Care, Senior Care, etc.).
- **Smart Booking Workflows**: Single-service quick booking and multi-service customized questionnaire workflows with scheduled or express timings.
- **Real-Time Request Tracking**: Live tracking of pending, active, and completed requests backed by PostgreSQL.
- **WhatsApp Concierge**: Instant direct chat connection with assigned Lifestyle Managers.
- **Passwordless & OTP Authentication**: Secure email verification and login challenge flows via JWT and encrypted OTP tokens.
- **Zero Mock Data**: Fully data-driven client architecture communicating with a production-ready Express + Prisma REST API.
- **Alexandria Design System**: Clean typography, harmonious color palette, and micro-interactions for a fluid user experience.

---

## 🏗️ Architecture & Technology Stack

### Frontend (Mobile App)
- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 57](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation with typed routes)
- **Language**: TypeScript
- **State Management & Data Fetching**: [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) (Tag-based cache invalidation)
- **Styling & Theme**: Custom Alexandria design system with vanilla React Native StyleSheet
- **Icons & Visuals**: `@expo/vector-icons` (Feather) & Google Fonts
- **Storage**: `expo-secure-store` (tokens) & `@react-native-async-storage/async-storage` (session cache)

### Backend (REST API)
- **Runtime**: Node.js & Express
- **Language**: TypeScript
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/) schemas with dedicated validation middleware
- **Authentication**: JWT tokens + OtpChallenge system
- **Email Service**: Nodemailer integration with secure OTP delivery

---

## 📁 Repository Structure

```text
Livora/
├── backend/
│   ├── prisma/
│   │   ├── migrations/             # Database migration history
│   │   └── schema.prisma           # Prisma schema (User, OtpChallenge, ServiceRequest)
│   ├── src/
│   │   ├── config/                 # Environment config
│   │   ├── controllers/            # Route handlers (auth, user, request, health)
│   │   ├── lib/                    # Prisma client singleton
│   │   ├── middlewares/            # Auth, validation, logging, and error handlers
│   │   ├── routes/                 # Express API routes
│   │   ├── services/               # Business logic (auth, email, otp, user, request)
│   │   ├── types/                  # TypeScript interface definitions
│   │   ├── utils/                  # JWT, password hashing, and API response utilities
│   │   ├── validators/             # Zod validation schemas
│   │   ├── app.ts                  # Express application setup
│   │   └── server.ts               # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── assets/                     # App icons, splash screens, and images
│   ├── src/
│   │   ├── app/                    # Expo Router screens
│   │   │   ├── (auth)/             # Login, Register, Verify Email, OTP
│   │   │   ├── (main)/             # Home, Tasks, Multi-Details, Summary, Requests, Profile
│   │   │   ├── (onboarding)/       # Profile Details onboarding
│   │   │   └── (welcome)/          # First-run welcome carousel
│   │   ├── components/             # Reusable UI components (Button, Input, Card, Header, etc.)
│   │   ├── constants/              # Service catalog and app configuration
│   │   ├── hooks/                  # Form field and custom utility hooks
│   │   ├── services/               # RTK Query API slices (authApi, userApi, requestsApi)
│   │   ├── store/                  # Redux store and slices (auth, profile, tasks)
│   │   ├── theme/                  # Alexandria design tokens (colors, typography, spacing, radius)
│   │   ├── types/                  # Client-side domain types
│   │   └── utils/                  # Storage, validation, and helper functions
│   ├── app.json                    # Expo native configuration
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                       # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm or yarn
- **Database**: PostgreSQL (running locally or cloud instance)
- **Mobile Development** (optional for native runs):
  - [Android Studio](https://developer.android.com/studio) with Android SDK (API 34/35/36)
  - Java JDK 17
  - Expo Go app on your physical mobile device

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in `backend/` with the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://username:password@localhost:5432/livora_db?schema=public"
   JWT_SECRET="your-super-secure-jwt-secret-key"
   JWT_EXPIRES_IN="7d"

   # SMTP Configuration (for sending real verification codes)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   SMTP_FROM="Livora Concierge <no-reply@livora.com>"
   ```

4. Run Prisma database migrations and generate the Prisma Client:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will start at `http://localhost:5000/api/v1`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in `frontend/`:
   ```env
   # Replace with your local machine's IP address (e.g. 192.168.1.100) or emulator loopback
   EXPO_PUBLIC_API_URL=http://192.168.29.222:5000/api/v1
   ```

4. Start the Expo development server:
   ```bash
   npx expo start
   ```

5. Run on your preferred platform:
   - **Physical Device**: Scan the QR code using the Expo Go app (Android) or Camera (iOS).
   - **Android Emulator**: Press `a` in the terminal.
   - **Web Preview**: Press `w` in the terminal.

---

## 📱 Building the Android Release APK

Livora is configured for native Android release builds with full Hermes Ahead-Of-Time (AOT) compilation and local cleartext traffic support.

### Run Release on a Connected Device / Emulator
```bash
cd frontend
npx expo run:android --variant release
```

### Generate Standalone `.apk` File
```bash
cd frontend
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```
The installable release APK will be generated at:
`frontend/android/app/build/outputs/apk/release/app-release.apk`

---

## 📡 Core API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/health` | Service health status and uptime | No |
| `POST` | `/api/v1/auth/register` | Register a new account & send verification OTP | No |
| `POST` | `/api/v1/auth/verify-email` | Verify email with OTP code | No |
| `POST` | `/api/v1/auth/login/request-otp` | Request a one-time login OTP | No |
| `POST` | `/api/v1/auth/login/verify-otp` | Verify login OTP & obtain JWT | No |
| `GET` | `/api/v1/users/profile` | Retrieve the authenticated user's profile | Yes |
| `PUT` | `/api/v1/users/profile` | Update user profile details (name, phone, address) | Yes |
| `POST` | `/api/v1/requests` | Create a new service request | Yes |
| `GET` | `/api/v1/requests` | Fetch user's active and historical requests | Yes |

---

## 🛡️ License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
