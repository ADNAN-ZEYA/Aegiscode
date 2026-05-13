# AegisCode

A production-grade educational content platform built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, and **Firebase**.

Built reading-first: blogs, study materials, and courses are all delivered as clean, searchable text pages — not file dumps.

---

## Platform Overview

- Browse and read blog posts, study materials, and structured courses
- Take interactive mock tests / quizzes
- Track reading progress, save bookmarks
- Create an account or sign in with Google
- Student portal at `/dashboard`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Primitives | Radix UI (ShadCN-style) |
| Animations | Framer Motion |
| Auth | Firebase Authentication (Email/Password + Google) |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Hosting | Firebase Hosting |
| Forms | React Hook Form + Zod |
| PDF Extraction | pdf-parse (server-side) |
| Payments (scaffold) | Razorpay |

---

## Project Structure

```
aegiscode/
├── app/
│   ├── (auth)/              # Student login, signup, forgot-password
│   ├── (marketing)/         # Homepage, blog, courses, quizzes, study-materials
│   ├── api/
│   │   ├── analytics/view/      # View tracking endpoint
│   │   └── auth/                # Session, profile, signout endpoints
│   └── dashboard/           # Student dashboard
├── src/
│   ├── components/          # UI, layout, content cards, motion wrappers
│   ├── hooks/               # Reading progress hook
│   ├── lib/                 # Firebase client/admin, auth helpers, SEO, utils
│   ├── services/            # Firestore data access (content, courses, users...)
│   └── types/               # TypeScript interfaces
├── public/                  # Static assets
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
└── tailwind.config.js
```

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `users` | User profiles |
| `blogs` | Blog posts |
| `studyMaterials` | Study material content |
| `courses` | Course metadata + modules |
| `quizzes` | Quiz questions and metadata |
| `quizAttempts` | User quiz attempt records |
| `categories` | Content category definitions |
| `bookmarks` | User bookmarks |
| `analytics` | Platform analytics snapshot |

---

## Environment Variables

Copy `.env.example` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Service account project ID |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account client email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account private key |
| `FIREBASE_ADMIN_STORAGE_BUCKET` | Admin storage bucket |
| `NEXT_PUBLIC_APP_URL` | Base URL of your deployment |

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Firebase Deployment

```bash
# Install Firebase CLI if not already
npm install -g firebase-tools

# Login
firebase login

# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

---

## Security

- Firestore rules enforce role-based access — students can only read published content
- Session cookies are `httpOnly`, `sameSite: lax`, and `secure` in production
- `.env.local` is gitignored — secrets are never committed

---

## License

MIT
