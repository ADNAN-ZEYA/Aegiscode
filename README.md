# AegisCode

Lightweight Next.js site for curated tech notes, study guides and blog posts.

## Key points
- Static-first Next.js site using Tailwind CSS and the `@tailwindcss/typography` plugin.
- Content authored as Markdown files in the `posts/` folder and parsed with `gray-matter` (`lib/posts.js`).
- Hosted as a static export (`out/`) — `firebase.json` points hosting to `out`.

## Quick start
1. Install dependencies:

```powershell
npm install
```

2. Run development server:

```powershell
npm run dev
# open http://localhost:3000
```

3. Build and export static files (required for Firebase hosting):

```powershell
npm run build
npx next export
# output will be placed into `out/` to match `firebase.json` hosting.public
```

4. Deploy to Firebase Hosting (if configured):

```powershell
firebase deploy --only hosting
```

### Available npm scripts (from `package.json`)
- `dev` — `next dev` (development server)
- `build` — `next build` (build for production)
- `start` — `next start` (start production server)
- `lint` — `next lint`

### Project structure (high-level)
- `pages/` — Next.js pages and routes; `pages/blog/[slug].js` uses static props/paths for posts.
- `components/` — UI pieces: `Layout.js`, `Header.js`, `Footer.js`, `PostCard.js`, etc.
- `lib/posts.js` — reads markdown files from `posts/` and parses frontmatter with `gray-matter`.
- `posts/` — markdown files storing content and frontmatter (see examples: `2025-11-*.md`).
- `public/` — static assets
- `styles/` — global Tailwind CSS (`globals.css`) and config files `tailwind.config.js`, `postcss.config.js`.

### Content / authoring notes
- Each blog post is a markdown file in `posts/` with YAML frontmatter. Typical fields used:
  - `title`, `date`, `description`, `category`, `image`.
- `lib/posts.js` currently parses frontmatter and returns the raw markdown in `content`. `pages/blog/[slug].js` expects an HTML string at `postData.contentHtml` (see `dangerouslySetInnerHTML`). If you are modifying rendering, update `lib/posts.js` to convert markdown -> HTML (e.g. using `remark` + `remark-html`) and return `contentHtml`.

### Styling & themes
- Tailwind CSS is configured; the typography plugin is enabled for post content (`prose` classes). Dark mode is supported via `next-themes` (check `components/Layout.js`).

### Notes for contributors and agents
- Prefer static generation: pages use `getStaticProps` / `getStaticPaths` for blog content.
- Keep design tokens (colors, spacing) in `tailwind.config.js`.
- Avoid modifying `firebase.json` unless you change the export output directory.

### References
- Content parsing: `lib/posts.js`
- Single-post page: `pages/blog/[slug].js`
- Home / index: `pages/index.js`
- Components: `components/Layout.js`, `components/PostCard.js`, `components/Newsletter.js`

If you'd like me to replace `README.md` with this content directly, I can attempt that (ask and I will), or you can rename `README.new.md` to `README.md` locally.


