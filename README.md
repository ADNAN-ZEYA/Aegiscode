# AegisCode

A production-grade educational content platform built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, and **Firebase**.

Built reading-first: blogs, study materials, and courses are all delivered as clean, searchable text pages — not file dumps.

---

## Platform Overview

**Student-facing**
- Browse and read blog posts, study materials, and structured courses
- Take interactive mock tests / quizzes with instant scoring
- Track reading progress and save bookmarks
- Chat with **Aria** — an AI study assistant powered by Gemini 2.5 Pro, context-aware to the page being read
- Generate a personalised week-by-week **Study Roadmap** from a goal and target date
- **Daily Planner** on the dashboard shows today's study tasks from the active roadmap
- Create an account or sign in with Google
- Student portal at `/dashboard`
- Public profile pages at `/profile/[username]`

**Admin-facing** (email-restricted, `/admin`)
- Editorial dashboard with live stats: total views, student count, bookmarks, published items
- Create, edit, and delete blogs, study materials, courses (with modules), and quizzes
- Upload PDFs — text is extracted server-side and stored as readable content
- Manage users and their roles
- Control AI features: toggle the chatbot on/off, set daily conversation limits per student, write custom system-prompt instructions, enable/disable the Roadmap and Daily Planner features

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + `@tailwindcss/typography` |
| UI Primitives | Radix UI (ShadCN-style) |
| Animations | Framer Motion |
| Auth | Firebase Authentication (Email/Password + Google) |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Hosting | Firebase Hosting |
| Forms | React Hook Form + Zod |
| Markdown | react-markdown + rehype-highlight + remark-gfm |
| Syntax Highlighting | highlight.js (GitHub theme, dark-mode overrides) |
| PDF Extraction | pdf-parse (server-side) |
| AI Tutor | Gemini 2.5 Pro (Google AI Studio) |
| Analytics | Vercel Analytics + Speed Insights |
| Payments (scaffold) | Razorpay |

---

## Project Structure

```
aegiscode/
├── app/
│   ├── (auth)/              # Login, signup, forgot-password
│   ├── (marketing)/         # Homepage, blog, courses, quizzes, study-materials, profile
│   ├── admin/
│   │   ├── login/           # Admin login gate
│   │   └── (protected)/     # Dashboard, content, courses, quizzes, users,
│   │                        # pdf-upload, ai-settings, history/edit
│   ├── api/
│   │   ├── chat/            # Aria AI tutor endpoint (Gemini 2.5 Pro)
│   │   ├── admin/extract-pdf/  # PDF text extraction
│   │   ├── analytics/view/  # View tracking
│   │   └── auth/            # Session, profile, signout
│   └── dashboard/           # Student dashboard (roadmap, planner, progress, bookmarks)
├── src/
│   ├── components/          # UI, layout, content cards, motion wrappers
│   ├── hooks/               # Reading progress hook
│   ├── lib/                 # Firebase client/admin, auth helpers, SEO, utils
│   ├── services/            # Firestore data access (content, courses, users, chatbot...)
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
| `users` | User profiles, roles, roadmap data |
| `content` | Blog posts and study materials |
| `courses` | Course metadata + modules |
| `quizzes` | Quiz questions and metadata |
| `quizAttempts` | User quiz attempt records |
| `categories` | Content category definitions |
| `bookmarks` | User bookmarks |
| `analytics` | Platform analytics + AI usage tracking |
| `settings` | Platform settings (AI toggle, daily limits, system prompt) |

---

## Environment Variables

Copy `.env.example` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Base URL of your deployment |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Analytics measurement ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Service account project ID |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account client email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account private key |
| `FIREBASE_ADMIN_STORAGE_BUCKET` | Admin storage bucket |
| `ADMIN_EMAILS` | Comma-separated list of admin emails (server-side) |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Same list exposed to the client for UI gating |
| `GEMINI_API_KEY` | Google AI Studio key for Aria and the Roadmap generator |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key (optional — for premium courses) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (optional) |

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Other useful commands:

```bash
npm run build        # Production build
npm run typecheck    # TypeScript check without emitting
npm run lint         # ESLint
npm run firebase:emulators  # Start Firebase local emulators
```

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
- Admin routes are protected by an email allowlist (`ADMIN_EMAILS`) checked server-side
- Session cookies are `httpOnly`, `sameSite: lax`, and `secure` in production
- The Aria AI endpoint validates session cookies, enforces per-user daily conversation limits, strips C0 control characters, hard-caps message history at 50 turns, and rejects non-standard message roles to prevent prompt injection
- `.env.local` is gitignored — secrets are never committed

---

## License

MIT
