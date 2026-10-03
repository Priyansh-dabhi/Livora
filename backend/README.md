# Livora Backend API

A clean, modular Node.js & Express REST API built with TypeScript.

---

## 📁 Directory Structure

```text
backend/
├── .env                  # Local environment variables (ignored by git)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules for backend
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
└── src/
    ├── app.ts            # Express app configuration & middleware pipeline
    ├── server.ts         # Server bootstrapper & lifecycle management
    ├── config/           # Environment configuration
    │   └── index.ts
    ├── controllers/      # Route controllers (request handlers)
    │   └── health.controller.ts
    ├── middlewares/      # Express custom middlewares
    │   ├── error.middleware.ts
    │   └── logger.middleware.ts
    ├── models/           # Data models / Schemas
    ├── routes/           # API route definitions
    │   ├── health.routes.ts
    │   └── index.ts
    ├── services/         # Business logic layer
    ├── types/            # TypeScript type definitions
    │   └── index.ts
    └── utils/            # Helper utilities
        ├── apiError.ts
        ├── apiResponse.ts
        └── asyncHandler.ts
```

---

## 🚀 Available Scripts

In the `backend` directory, you can run:

- `npm run dev` - Starts the development server with live reload (`tsx watch`)
- `npm run build` - Cleans `dist/` and compiles TypeScript to JavaScript
- `npm run start` - Runs the compiled production server (`node dist/server.js`)

---

## 🩺 Endpoints

- `GET /` - Root status & API discovery
- `GET /api/v1/health` - Service health status & uptime
