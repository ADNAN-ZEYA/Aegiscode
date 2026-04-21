# AegisCode

**Learn Tech, Build Future** — A free, open-source educational hub with curated technical notes, study guides, and blog posts for students. No ads, no fluff, no clickbait.

Covers: Cybersecurity · Linux · Web Development · Python · JEE Prep

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js (static export) |
| Styling | Tailwind CSS v3 + `@tailwindcss/typography` |
| Dark Mode | `next-themes` |
| Content | Markdown + `gray-matter` + `remark` |
| Icons | `lucide-react` |
| Forms | Formspree |
| Hosting | Firebase Hosting |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, stats, featured courses, latest posts, cheatsheets |
| `/blog` | Blog archive with real-time search by title or category |
| `/blog/[slug]` | Individual post (rendered from Markdown) |
| `/resources` | Learning roadmaps and downloadable PDF cheatsheets |
| `/projects` | Open-source project showcase |
| `/about` | Philosophy — No Fluff, Open Source, Anonymous |
| `/contact` | Bug reports, suggestions, and reviews via Formspree |

---

## Project Structure

```
aegiscode/
├── pages/              # Next.js routes
│   ├── index.js        # Home page
│   ├── about.js
│   ├── contact.js
│   ├── blog/
│   │   ├── index.js    # Blog archive with search
│   │   └── [slug].js   # Dynamic post page
│   ├── projects/
│   └── resources/
├── components/         # Reusable UI
│   ├── Layout.js       # Page wrapper (header + footer)
│   ├── Header.js       # Sticky nav with theme toggle + mobile menu
│   ├── Footer.js
│   ├── PostCard.js     # Blog post card
│   ├── Newsletter.js   # Email subscribe form
│   └── CodeBlock.js    # Syntax-highlighted code wrapper
├── lib/
│   └── posts.js        # Markdown parsing utilities
├── posts/              # Markdown content files
├── public/             # Static assets (images, PDFs)
├── styles/
│   └── globals.css
├── next.config.mjs     # output: 'export' for static build
└── firebase.json       # Hosting config pointing to /out
```

---

## Content Authoring

Posts live in the `posts/` folder as Markdown files (nested subfolders supported).

Each file must have YAML front matter:

```yaml
---
title: "Lesson 1: Python Basics"
date: "2025-12-14"
description: "A short description shown on the blog card."
image: "/images/python.jpg"
category: "Python Course"
---

Your markdown content here...
```

`lib/posts.js` recursively scans `posts/`, parses front matter with `gray-matter`, converts Markdown to HTML with `remark`, and returns data sorted by date (newest first).

---

## Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

---

## Build & Deploy

```bash
# Build static site (outputs to /out)
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

`next.config.mjs` sets `output: 'export'` — no server required. All pages are pre-rendered at build time.

---

## Available Scripts

| Script | Command |
|--------|---------|
| `dev` | `next dev` — development server |
| `build` | `next build` — static export to `/out` |
| `start` | `next start` — production server |
| `lint` | `next lint` |
