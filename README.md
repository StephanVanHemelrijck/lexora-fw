# Lexora – Language Learning App

Lexora is a language-learning app built as an NX monorepo, consisting of:

- 🚀 A **React Native (Expo)** mobile frontend
- 🧠 A **NestJS** backend API
- 💡 Firebase authentication
- 🔊 Google Cloud TTS integration
- 🐘 PostgreSQL database (via Prisma ORM)

---

## 🛠️ Prerequisites

Before starting, make sure you have the following installed:

- Node.js (v18+ recommended)
- npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Docker (if you don't have a Postgres DB set up)

---

## 🛠️ Getting Started

## 1. Install Dependencies

Install dependencies from the root of the project:

```bash
npm install
```

Then install dependencies in each app:

```bash
cd apps/backend
npm install

cd apps/mobile
npm install
```

> 💡 While installing from the root might cover everything, it's safest to also run install inside `apps/backend` and `apps/mobile`.

---

### 2. Setup Environment Variables

Copy the environment file templates and configure them as needed:

```bash
cp .env.template .env
```

Make sure to update `GOOGLE_APPLICATION_CREDENTIALS` in `.env`:

```env
GOOGLE_APPLICATION_CREDENTIALS=./apps/backend/src/secrets/firebase-service-account.json

# TTS SERVICE ACCOUNT
TTS_FILE_DIRECTORY=./apps/backend/src/secrets/tts-service-account.json
```

Place your Firebase and Google Cloud service account JSON files in:

```
apps/backend/src/secrets/
├── firebase-service-account.json
└── tts-service-account.json
```

---

## 3. Database Setup

### Option A: Use Docker (Recommended for Local Dev)

From inside the `apps/backend` folder:

```bash
docker compose up
```

This will spin up a Postgres container with the expected configuration.

---

### Option B: Use Your Own Postgres DB

Make sure the `DATABASE_URL` in your `.env` points to your database.

---

### Prisma Setup

After setting up the DB (via Docker or otherwise), run the following in `apps/backend`:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed   # (optional, if seed file is present)
```

---


### 4. Start the Backend

From the root directory:

```bash
nx serve backend
```

---

### 5. Start the Mobile App

From the `apps/mobile` directory:

```bash
npx expo start --clear
```

---

### ⚙️ Notes

- Change the API base URL depending on development or deployment in:

  ```
  libs/api/src/api.ts
  ```

- Firebase is used for authentication.
- The backend uses service accounts for Google APIs (TTS + Firebase).

---

## 🧠 Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** NestJS
- **Database:** PostgreSQL (via Prisma)
- **Monorepo:** Nx
- **Auth:** JWT-based
- **Deployment:** Docker + DigitalOcean (not required for local dev)

---

## 📁 Project Structure (Simplified)

```
lexora/
├── apps/
│   ├── backend/       # NestJS backend
│   └── mobile/        # Expo React Native app
├── libs/              # Shared logic (API SDK, styles, types)
└── .env               # Main environment file
```

---

## 📄 License

This project is licensed under the MIT License.
