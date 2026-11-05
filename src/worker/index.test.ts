import { describe, expect, it } from "vitest";
import { app, type Env } from "./index";

function envWith(db: unknown): Env {
  return { DB: db as D1Database, ASSETS: {} as Fetcher };
}

const goodDb = { prepare: () => ({ first: async () => ({ ok: 1 }) }) };
const badDb = {
  prepare: () => ({
    first: async () => {
      throw new Error("no db");
    },
  }),
};

describe("GET /api/health", () => {
  it("reports ok when D1 answers", async () => {
    const res = await app.request("/api/health", {}, envWith(goodDb));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; database: string };
    expect(body.status).toBe("ok");
    expect(body.database).toBe("ok");
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("reports degraded with 503 when D1 fails", async () => {
    const res = await app.request("/api/health", {}, envWith(badDb));
    expect(res.status).toBe(503);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("degraded");
  });
});

describe("unknown API routes", () => {
  it("returns JSON 404", async () => {
    const res = await app.request("/api/nope", {}, envWith(goodDb));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found" });
  });
});
