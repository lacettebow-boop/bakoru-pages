import { useEffect, useState } from "react";
import type { HealthResponse } from "../../shared/api";

export type HealthState =
  | { phase: "loading" }
  | { phase: "ready"; data: HealthResponse }
  | { phase: "error"; message: string };

export function useHealth(): HealthState {
  const [state, setState] = useState<HealthState>({ phase: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal })
      .then(async (res) => {
        // 503 still carries a valid body describing what is degraded.
        const data = (await res.json()) as HealthResponse;
        setState({ phase: "ready", data });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          phase: "error",
          message: err instanceof Error ? err.message : "Request failed",
        });
      });
    return () => controller.abort();
  }, []);

  return state;
}
