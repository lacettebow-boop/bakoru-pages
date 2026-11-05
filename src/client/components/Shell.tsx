import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="shell-header">
        <Link to="/" className="wordmark" aria-label="Bakuro Pages, home">
          bakuro
        </Link>
      </header>
      <main id="main" className="shell-main">
        {children}
      </main>
      <footer className="shell-footer">bakuropages.cc.cd</footer>
    </div>
  );
}
