export interface HealthResponse {
  status: "ok" | "degraded";
  database: "ok" | "unreachable";
  time: string;
}

export interface ApiError {
  error: string;
}
