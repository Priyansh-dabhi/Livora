# Livora — Architecture & System Design (DESIGN.md)

This document outlines the architecture, architectural trade-offs, system design decisions, and future engineering roadmap for the **Livora** full-stack concierge and household management platform.

---

## 1. System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                 React Native (Expo SDK 57)                  │
│       File-based Expo Router  •  Alexandria Design System   │
│            Redux Toolkit  •  RTK Query Data Caching         │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                    Express & TypeScript API                 │
│      JWT Auth Middleware  •  Zod Validators  •  Controllers  │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 ┌───────────────────────┐             ┌────────────────────┐
 │  PostgreSQL Database  │             │   SMTP / Mailpit   │
 │      (Prisma ORM)     │             │ (Email OTP Delivery│
 └───────────────────────┘             └────────────────────┘
```

### Mobile Client (Frontend)
- **Framework**: React Native on Expo SDK 57 with Expo Router file-based navigation.
- **State & Caching Layer**: Redux Toolkit with RTK Query. Uses tag-based cache invalidation (`Auth`, `Profile`, `Tasks`) to ensure UI components update automatically when mutations occur without manual refetching.
- **Security & Storage**: Tokens stored in hardware-backed `expo-secure-store`; session state and local preferences cached in `@react-native-async-storage/async-storage`.

### REST Backend
- **Framework**: Node.js, Express, TypeScript.
- **Data Layer**: PostgreSQL managed via Prisma ORM with automated migrations and seed scripts.
- **Validation**: Strict schema validation using Zod for all request bodies and query parameters.
- **Auth & Challenge Service**: Dual OTP authentication system (Email verification on registration + OTP-based login challenges) with bcrypt password hashing and HMAC/sha256 OTP hashing.

---

## 2. Key Architectural Trade-Offs

| Decision | Selected Approach | Trade-Off & Rationale |
| :--- | :--- | :--- |
| **Data Fetching** | RTK Query with tag invalidation | Adds minor boilerplate compared to ad-hoc `fetch`, but eliminates stale state, coordinates multi-screen cache updates, and provides automatic deduplication. |
| **OTP Security** | Storing hashed OTP (`codeHash`) | Plain OTP codes are never stored in the database. Verifications compare cryptographic hashes with rate limiting (max 5 attempts, 10-minute expiry, 30s cooldown). |
| **Catalog Architecture** | Seeded DB Catalog + Structured Hierarchy | Categories and tasks are persisted in PostgreSQL (`Category`, `Task`, `UserTaskSelection`) with an optimized 3-level client hierarchy (Category → Help Type → Activity) for instant, fluid user navigation. |
| **Design System** | Custom Alexandria Theme Tokens | Avoided heavy CSS-in-JS abstractions in favor of strongly-typed vanilla React Native StyleSheet tokens for maximum runtime performance and 60fps rendering. |

---

## 3. Profile Schema: Why Business Name is Optional

Livora profiles collect user information including Name, Mobile Number (+91, 10 digits), Address, and optional Business Name.

**Design Decision**: `businessName` is strictly **optional**.
- **Rationale**: Livora serves both **individual residential households** (who do not possess a commercial entity) and **home-office / enterprise professionals** who require concierge billing under a corporate name.
- Requiring individual homeowners to provide a business name would create unnecessary friction, user confusion, and onboarding drop-offs. When provided, the business name is saved and associated with all future concierge service orders.

---

## 4. Email & Mail Catcher Configuration

Livora delivers authentication and verification OTP codes via SMTP or a local mail catcher:

- **Development Default**: **Mailpit** (running via Docker on SMTP port `1025`, web UI on `http://localhost:8025`). This guarantees zero external dependencies and fast local testing without spamming real inboxes.
- **Production Mode**: Configurable via standard SMTP environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) supporting Gmail, AWS SES, or SendGrid.
- **Fallback**: In development, generated OTP codes are additionally logged to the backend console for rapid manual testing.

---

## 5. Architectural Boundaries & Scope

1. **Payment Gateway Integration**: Online payments (Razorpay/Stripe) are designed for post-service concierge reconciliation, aligning with the Livora pilot concierge model where the Lifestyle Manager coordinates vendor quotes.
2. **Milestone Tracking**: Task tracking uses structured lifecycle milestones (`pending` → `in_progress` → `completed`) rather than raw GPS driver coordinates, matching personal household errand services.
3. **State Synchronization**: Client-server state synchronization utilizes RTK Query optimistic updates and focus-based invalidation rather than standing WebSocket connections to conserve mobile battery life.

---

## 6. Future Engineering Roadmap

1. **Native In-App Concierge Chat**: Transition from WhatsApp deeplinks to an embedded, real-time WebSocket chat interface between households and their assigned Lifestyle Manager.
2. **Push Notifications**: Integrate Expo Notifications for instant mobile alerts when a technician arrives or an errand is completed.
3. **Recurring Task Subscriptions**: Enable recurring schedules (e.g., weekly elderly wellness check-in, bi-weekly deep cleaning) with automated task generation.
4. **Media Attachments**: Allow users to snap photos of broken appliances or prescription slips directly in the booking flow and upload to S3/Cloudinary.
