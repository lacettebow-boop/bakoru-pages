import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import type { ApiError, HealthResponse } from "../shared/api";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

export const app = new Hono<{ Bindings: Env }>();

// Baseline hardening for every API response. Auth, CORS and CSRF rules land in Phase 2.
app.use("/api/*", secureHeaders());
app.use("/api/*", async (c, next) => {
  await next();
  c.header("Cache-Control", "no-store");
});

app.get("/api/health", async (c) => {
  try {
    await c.env.DB.prepare("SELECT 1 AS ok").first();
    const body: HealthResponse = {
      status: "ok",
      database: "ok",
      time: new Date().toISOString(),
    };
    return c.json(body);
  } catch (err) {
    console.error("health check: database unreachable", err);
    const body: HealthResponse = {
      status: "degraded",
      database: "unreachable",
      time: new Date().toISOString(),
    };
    return c.json(body, 503);
  }
});

app.notFound((c) => {
  const body: ApiError = { error: "not_found" };
  return c.json(body, 404);
});

app.onError((err, c) => {
  console.error("unhandled error", err);
  const body: ApiError = { error: "internal_error" };
  return c.json(body, 500);
});

export default app;
