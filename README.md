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
│   │   ├── schema.prisma           # Prisma schema (User, OtpChallenge, ServiceRequest, Category, Task)
│   │   └── seed.ts                 # Database seed script (5 categories, 29 tasks)
│   ├── src/
│   │   ├── config/                 # Environment config
│   │   ├── controllers/            # Route handlers (auth, user, task, request, health)
│   │   ├── lib/                    # Prisma client singleton
│   │   ├── middlewares/            # Auth, validation, logging, and error handlers
│   │   ├── routes/                 # Express API routes
│   │   ├── services/               # Business logic (auth, email, otp, user, task, request)
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
│   │   ├── services/               # RTK Query API slices (authApi, userApi, tasksApi, requestsApi)
│   │   ├── store/                  # Redux store and slices (auth, profile, tasks)
│   │   ├── theme/                  # Alexandria design tokens (colors, typography, spacing, radius)
│   │   ├── types/                  # Client-side domain types
│   │   └── utils/                  # Storage, validation, and helper functions
│   ├── app.json                    # Expo native configuration
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml              # One-command PostgreSQL & Mailpit container setup
├── DESIGN.md                       # Architecture & design document
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
   # Option A: Local Wi-Fi / Emulator Loopback
   # EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api/v1

   # Option B: Ngrok Tunnel (Recommended for Physical Device & Release Builds)
   EXPO_PUBLIC_API_URL=https://your-ngrok-subdomain.ngrok-free.dev/api/v1
   ```

4. Start the Expo development server:
   ```bash
   npm run dev
   # or: npx expo start
   ```

5. Run on your preferred platform:
   - **Physical Device**: Scan the QR code using the Expo Go app (Android) or Camera (iOS).
   - **Android Emulator**: Press `a` in the terminal.
   - **Web Preview**: Press `w` in the terminal.

---

## 📱 Building & Testing the Android Release APK

Livora is configured for native Android release builds with full Hermes Ahead-Of-Time (AOT) compilation and local cleartext traffic support.

### 🌐 Physical Device Testing with Ngrok (Recommended for Reviewers)

When testing a standalone native release build (`--variant release`) on a physical device, the phone runs as an independent client and cannot reach your PC's `http://localhost:5000`. Using **ngrok** creates a secure public HTTPS tunnel so your phone connects directly to your local backend from any network (Wi-Fi or mobile data).

#### Step 1: Start the Local Backend
Make sure PostgreSQL is running via Docker, then start the Express server:
```bash
docker compose up -d
cd backend
npm run dev
```
*(The backend will be live on `http://localhost:5000`)*

#### Step 2: Start the Ngrok Tunnel
Open a separate terminal window and expose port `5000`:
```bash
ngrok http 5000
```

#### Step 3: Copy the Forwarding URL
In the ngrok terminal window, locate the `Forwarding` line:
```text
Session Status     online
Account            Your Name (Plan: Free)
Forwarding         https://abc1-23-45-67.ngrok-free.dev -> http://localhost:5000
```
Copy the **`https://`** URL (e.g. `https://abc1-23-45-67.ngrok-free.dev`).

#### Step 4: Paste the URL into `frontend/.env`
Open `frontend/.env` in your editor and set `EXPO_PUBLIC_API_URL` to your copied ngrok URL with `/api/v1` appended:
```env
EXPO_PUBLIC_API_URL=https://abc1-23-45-67.ngrok-free.dev/api/v1
```

> **Reviewer Note**: Free ngrok endpoints normally show an interstitial warning page in browsers. The Livora mobile app already includes `ngrok-skip-browser-warning: true` in its API headers ([api.ts](frontend/src/services/api.ts)), so all API calls seamlessly bypass the warning and receive pure JSON responses.

#### Step 5: Install & Run Release on your Phone
Connect your Android phone via USB (with **USB Debugging** enabled in Developer Options) and run:
```bash
cd frontend
npx expo run:android --variant release
```
Expo will build the native release bundle, install it directly onto your connected device, and launch the app connected to your live backend.

---

### Standalone `.apk` Generation
To export a standalone installable `.apk` file without running directly:
```bash
cd frontend
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```
The installable release APK will be generated at:
`frontend/android/app/build/outputs/apk/release/app-release.apk`

---

## 🐳 One-Command Setup (Docker Compose)

Spin up PostgreSQL (port `5432`) and Mailpit mail catcher (SMTP `1025`, web UI `http://localhost:8025`) with one command:
```bash
docker compose up -d
```

---

## 📧 Testing Email OTP Delivery

Livora supports two modes for receiving actual 6-digit OTP verification codes:

### Option 1: Local Mail Catcher (Mailpit) — *Recommended & Zero-Config*
When running Docker Compose, Mailpit is running locally by default.
1. Ensure `backend/.env` has:
   ```env
   SMTP_HOST=localhost
   SMTP_PORT=1025
   ```
2. Open your web browser to the Mailpit inbox:
   👉 **http://localhost:8025**
3. Whenever you register or log in within the mobile app, the email with the 6-digit code will appear in the Mailpit inbox immediately.

### Option 2: Live Delivery to a Real Gmail Inbox
To have verification emails land directly in your real Gmail inbox:
1. Generate a 16-character [Google App Password](https://myaccount.google.com/apppasswords) (under Google Account → Security → 2-Step Verification → App passwords).
2. Configure `backend/.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_16_char_app_password
   SMTP_FROM="Livora Concierge <your_email@gmail.com>"
   ```
3. Restart the backend server (`npm run dev`).
4. Trigger registration or login in the mobile app using any real email address. The OTP will arrive in your Gmail inbox (check Spam if testing for the first time).

> **Developer Note**: In development mode, the generated OTP is also printed in the backend terminal console, and the master code `123456` is always accepted for rapid testing.

---

## 🧪 Automated Tests (Risky Logic)

Livora includes automated test suites covering the core high-risk authentication and security rules:
- **OTP Generation**: Verifying 6-digit numeric generation and cryptographic password/OTP hashing.
- **OTP Expiry**: Verifying that challenges older than 10 minutes are rejected.
- **Attempt Limits**: Enforcing lockouts after 5 consecutive failed attempts.
- **Single-Use Rule**: Verifying that consumed OTP codes cannot be reused.
- **Resend Cooldown**: Verifying the 30-second cooldown period.
- **Login Rules**: Blocking unverified accounts and verifying JWT token generation.

To run the test suite:
```bash
cd backend
npm test
```

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
| `GET` | `/api/v1/tasks` | Get all tasks catalogue (29+ seeded tasks across 5 categories) | No |
| `GET` | `/api/v1/tasks/categories` | Get categories with nested tasks | No |
| `POST` | `/api/v1/tasks/select` | Save user's selected tasks | Yes |
| `GET` | `/api/v1/tasks/selected` | Retrieve tasks picked by the user | Yes |
| `POST` | `/api/v1/requests` | Create a new service request | Yes |
| `GET` | `/api/v1/requests` | Fetch user's active and historical requests | Yes |

---

## 📄 Design & Architecture Document

See [DESIGN.md](DESIGN.md) for architectural trade-offs, scope decisions, rationale for optional business names, and future engineering milestones.

---

## 🛡️ License

This project is licensed under the MIT License.
