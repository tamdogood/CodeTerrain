# CodeTerrain

An interactive learning library with 25 source-cited, isometric maps of
landmark open-source repositories.

## Run locally

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Next.js (usually
[http://localhost:3000](http://localhost:3000), or the next free port).

## Add or update a manual map

1. Add the repository metadata to `src/lib/repositories.ts`.
2. Add a `SystemMap` entry under `src/data/maps/`, pinning every citation to
   the analyzed commit.
3. Export it from `src/data/maps/index.ts` and run `pnpm build`.

The shared viewer supplies the isometric terrain, journeys, payload animation,
legend, explainer, glossary, and learner path. Each catalog entry is statically
generated at `/repo/<slug>` for a durable share link. Herdr remains a legacy
self-contained HTML map while it is migrated to the shared data format.

## Deploy to Vercel

Import the repository in Vercel and keep the detected Next.js defaults. Set
`NEXT_PUBLIC_SITE_URL` to the final production URL if you use a custom domain;
otherwise Vercel's production host is detected automatically for social cards.
