# AegisCode

A production-grade educational content platform built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, and **Firebase**.

Built reading-first: blogs, study materials, and courses are all delivered as clean, searchable text pages — not file dumps.

---

## Platform Overview

### For Students
- Browse and read blog posts, study materials, and structured courses
- Take interactive mock tests / quizzes
- Track reading progress, save bookmarks
- Create an account or sign in with Google
- Student portal at `/dashboard`

### For Admins
- Separate admin login portal at `/admin/login` (inaccessible to regular users)
- Upload PDF study material — text is auto-extracted and saved as readable content
- Create and publish blogs, study materials, courses, and quizzes
- Track platform analytics: daily views, weekly readers, completion rates
- Manage users and roles
- Admin role is controlled strictly by `ADMIN_EMAILS` env variable — no one else can access the admin panel

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
│   ├── admin/
│   │   ├── login/           # Separate admin-only login page
│   │   └── (protected)/     # Dashboard, content, pdf-upload, courses, quizzes, users
│   ├── api/
│   │   ├── admin/extract-pdf/   # PDF text extraction endpoint
│   │   ├── analytics/view/      # View tracking endpoint
│   │   └── auth/                # Session, profile, signout endpoints
│   └── dashboard/           # Student dashboard
├── src/
│   ├── components/          # UI, layout, content cards, motion wrappers
│   ├── features/            # Admin forms, auth schemas
│   ├── hooks/               # Reading progress hook
│   ├── lib/                 # Firebase client/admin, auth helpers, SEO, utils
│   ├── services/            # Firestore data access (content, courses, users...)
│   └── types/               # TypeScript interfaces
├── posts/                   # Seed markdown content (migrate to Firestore)
├── public/                  # Static assets
├── middleware.ts            # Admin route protection
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
└── tailwind.config.js
```

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `users` | User profiles with role field |
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
| `ADMIN_EMAILS` | Comma-separated admin email addresses |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Same as above (client-side UI check) |
| `NEXT_PUBLIC_APP_URL` | Base URL of your deployment |

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin portal:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Admin Workflow

### Uploading Study Content via PDF
1. Go to **Admin Portal** → `/admin/login`
2. Sign in with your admin email
3. Click **Upload PDF** in the sidebar
4. Upload your PDF — text is extracted automatically
5. Fill in title, slug, category (e.g. `dsa`, `operating-system`), and tags
6. Set status to `Published` and click **Save Study Material**

### Creating a Course with Modules
1. Go to **Courses** in the admin sidebar
2. Fill in course metadata
3. In **Modules JSON**, provide an array of module objects:
```json
[
  {
    "id": "module-1",
    "title": "Arrays & Strings",
    "slug": "arrays-and-strings",
    "summary": "Core array operations and string manipulation",
    "markdown": "## Arrays\n\nContent here...",
    "order": 1,
    "estimatedMinutes": 30
  }
]
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
- Admin routes are protected at both middleware level and server component level
- Admin role is resolved exclusively from `ADMIN_EMAILS` env variable — never from client input
- Session cookies are `httpOnly`, `sameSite: lax`, and `secure` in production
- `.env.local` is gitignored — secrets are never committed

---

## License

MIT
