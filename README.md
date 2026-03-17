# Mindora Backend

**Node + Express + MongoDB backend for the Mindora frontend**

This service provides authentication, content storage, and share link generation for the Mindora app.

## ✅ Built With

- **Node.js 20+**
- **Express 5**
- **TypeScript** (compiled to `dist/`)
- **MongoDB** (via `mongoose`)
- **JWT auth** for session tokens

## 📦 Setup

### 1) Install dependencies

```bash
cd "Mindora Backend"
npm install
```

### 2) Configure environment

Create a `.env` file in the project root with the following keys:

```env
MONGO_URL=mongodb://localhost:27017/mindora
JWT_SECRET=yourStrongSecretHere
```

> The server will throw an error if either variable is missing.

### 3) Build + Run

#### Option A: Build and run compiled JavaScript (recommended)

```bash
npx tsc -b
node dist/index.js
```

#### Option B: Run directly with `tsx` (no build step)

```bash
npx tsx src/index.ts
```

The server listens on port **3000**.

## 🔌 API Endpoints

### Authentication

- `POST /api/v1/signup` — create a new user
  - Body: `{ username, password }`

- `POST /api/v1/signin` — authenticate and receive JWT
  - Body: `{ username, password }`
  - Response: `{ token }`

### Content (requires auth header `Authorization: <token>`)

- `GET /api/v1/content` — list saved content for the logged-in user
- `POST /api/v1/content` — add a new content entry
  - Body: `{ title, link, type }`
- `DELETE /api/v1/content` — delete content (expects `{ contentId }`)

### Share / Brain

- `POST /api/v1/brain/share` — create or reuse a share link
  - Body: `{ share: true }` to create; `{ share: false }` to remove

- `GET /api/v1/brain/:shareLink` — fetch public view data for a shared brain

## 🧠 Notes

- Authentication is handled via JWT stored in `Authorization` header.
- Passwords are currently stored in plain text (TODO: hash them).
- Validation is minimal; enhancing request validation and error handling is recommended.

---

If you run the frontend in `Mindora Frontend`, point `VITE_BACKEND_URL` at this server (default is `http://localhost:3000`).
