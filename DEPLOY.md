# Deploying the prototype

Nothing has been deployed. Deployment publishes the prototype to the internet, so do it only when you are ready to share the link.

## What gets deployed

`npm run build` writes a static site to `dist/`:

| File | Contents |
|---|---|
| `index.html` | App shell, `noindex, nofollow` meta |
| `robots.txt` | `Disallow: /` |
| `assets/*.js`, `assets/*.css` | The app, including the Part D aggregate values in `src/data/` |
| `assets/*.woff2` | Geist and Geist Mono (OFL) |

No source documents, data pack, company profile or record-level data are in the build. Routing uses URL hashes (`#/compliance`), so the host needs no rewrite rules. The disclaimer bar shows on every page and can be hidden only for the current browser session.

## Recommended: Cloudflare Pages, direct upload

Why: the build is a plain static folder, and direct upload needs no Git repository. That matters here, because this folder sits inside a repository rooted at `C:/` that must not be pushed. Pages serves static files without a framework adapter, and the free plan is enough for a demo link.

```bash
npm run build
```

```bash
npx wrangler login
```

```bash
npx wrangler pages deploy dist --project-name arth-ops-prototype
```

The first run creates the project and prints a URL such as `https://arth-ops-prototype.pages.dev`. Each later run publishes a new deployment to the same project. `wrangler` downloads on first use through `npx`; it is not added to `package.json`.

## Equal alternative: Vercel

Also a good fit for a static Vite build. Use it if you already have a Vercel account.

```bash
npm run build
```

```bash
npx vercel deploy --prod
```

When prompted, choose framework "Vite", build command `npm run build`, output directory `dist`. Vercel's Hobby plan is for non-commercial use, which suits a personal case-study demo.

## Before sharing the link

1. Open the URL in a private window and check that the disclaimer bar is visible.
2. Check all five destinations and one drawer link, for example `<url>/#/financial?kpi=05`.
3. Confirm `<url>/robots.txt` returns `Disallow: /`.

## Taking it down

Cloudflare: delete the `arth-ops-prototype` project in the dashboard (Workers & Pages). Vercel: delete the project in its dashboard. Cached copies may persist briefly after removal.
