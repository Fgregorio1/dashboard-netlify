# LatinusPro curriculum (web)

Static React site deployable to **Netlify**. Content lives in `src/curriculumData.ts` (synced from your Cursor canvas source).

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

Edit `src/curriculumData.ts`, then `npm run build` and redeploy.
