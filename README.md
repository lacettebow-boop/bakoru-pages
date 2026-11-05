# Bakuro Pages

Personal-page platform: a canvas editor, per-user pages, and visitor "gimmicks" (drawing, asks, song and playlist recommendations).

**Stack:** React + TypeScript + Vite, Cloudflare Workers (Hono) with Static Assets, D1, R2 (from Phase 6).

## Status

Phase 1 (scaffold): app shell, Worker with `/api/health`, D1 migration `0001_core.sql`, tests for the health endpoint. Auth, pages and the editor come in later phases.

## Local development

Requires Node 20+.

```bash
npm install
npm run db:migrate:local     # creates the local D1 database from migrations/
npm run dev:worker           # terminal 1: Worker on :8787
npm run dev                  # terminal 2: Vite on :5173, proxying /api to the Worker
npm test                     # Worker tests
npm run typecheck
```

## Cloudflare setup (nothing here is assumed to exist)

1. **D1 database:** `npx wrangler d1 create bakuro`, then paste the returned `database_id` into `wrangler.jsonc`.
2. **Apply the migration to production:** `npm run db:migrate:remote`.
3. **Connect GitHub:** Cloudflare dashboard, Workers & Pages, Create, import this repo (Workers Builds).
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
4. **Custom domain:** add `bakuropages.cc.cd` under the Worker's Settings, Domains & Routes. The domain's DNS must be on Cloudflare, or you must use whatever DNS option your `.cc.cd` provider allows. Verify this before assuming it works.
5. **Secrets** (needed from Phase 2): set with `npx wrangler secret put NAME`. Never commit them. Local values go in `.dev.vars`, which is gitignored.

## Layout

```
src/client/   React app
src/worker/   Hono API (Worker entry: index.ts)
src/shared/   Types shared by both sides
migrations/   D1 SQL migrations, applied in order
```
