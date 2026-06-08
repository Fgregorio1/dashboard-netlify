# LatinusPro curriculum (web)

Static React site deployable to **Netlify**. Structured content lives in **`src/content/`** as JSON (Git CMS), loaded by the app via `src/curriculumContent.ts`. Types live in `src/curriculumTypes.ts`.

## Local

```bash
cd latinuspro-curriculo-web
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output: `dist/`

## Netlify Visual Editor (Git CMS)

1. Push this repo to GitHub/GitLab and connect the site on Netlify.
2. In the Netlify UI: **Project configuration → Visual editor** (or **Enable visual editor**), connect the repo branch you use for previews (often `main` or a dedicated **`preview`** branch — follow Netlify’s prompt).
3. Ensure **`stackbit.config.ts`** is on the default branch Netlify reads; it defines `GitContentSource` for `src/content/`, a **`sitemap`** that maps every Git document to `/` (SPA), and a **custom Vite** dev command with HMR passthrough (`/vite-hmr/**`).
4. Production builds use **Node 20** via `netlify.toml` (aligned with `nodeVersion` in `stackbit.config.ts`).
5. Optional — local Visual Editor: install the CLI (`npm install -g @stackbit/cli`), run `npm run dev` in one terminal and `stackbit dev` in another, then open the URL the CLI prints and sign in.

After edits in the Visual Editor, changes are committed to Git like normal files under `src/content/`.

### Normalize JSON on disk

```bash
npm run migrate:content
```

Pretty-prints all content files from the same data the app imports (useful after manual merges).

## Deploy to Netlify (from your machine)

We **cannot** log into your Netlify account from Cursor on your behalf. You authenticate locally once:

```bash
npm install -g netlify-cli
# or: npx netlify-cli login

cd latinuspro-curriculo-web
netlify login          # opens browser — log in with your Netlify account
netlify init           # link this folder to a new site (or pick existing)
npm run build
netlify deploy --prod --dir=dist
```

Alternative: connect the GitHub repo to Netlify in the Netlify UI (auto deploy on push).

## Editing content

- **In the repo:** edit JSON under `src/content/` (or run `npm run migrate:content` to rewrite formatted files).
- **In Netlify:** use the Visual Editor when enabled; preview reloads use the `stackbitObjectsChanged` listener in `src/main.tsx`.

Then `npm run build` and deploy (or let CI deploy on push).
