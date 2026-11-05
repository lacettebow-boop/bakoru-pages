import { useHealth } from "../hooks/useHealth";

export function Home() {
  const health = useHealth();

  return (
    <>
      <section className="hero">
        <h1 className="hero-title">Your own corner of the internet.</h1>
        <p className="hero-lede">
          Bakuro Pages is a place to build a page that looks and acts like you: place things
          anywhere, restyle everything, and add small interactive features that visitors can
          actually use.
        </p>
        <p className="hero-note">Accounts and the page editor are being built. They are not open yet.</p>
      </section>

      <section className="status" aria-live="polite" aria-label="Platform status">
        <h2 className="status-title">Platform status</h2>
        {health.phase === "loading" && <p>Checking the server…</p>}
        {health.phase === "error" && (
          <p className="status-bad">Could not reach the API: {health.message}. Is the Worker running?</p>
        )}
        {health.phase === "ready" && (
          <dl className="status-list">
            <div>
              <dt>API</dt>
              <dd>{health.data.status === "ok" ? "Running" : "Degraded"}</dd>
            </div>
            <div>
              <dt>Database</dt>
              <dd>{health.data.database === "ok" ? "Connected" : "Unreachable"}</dd>
            </div>
          </dl>
        )}
      </section>
    </>
  );
}
