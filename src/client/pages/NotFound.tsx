import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="hero">
      <h1 className="hero-title">Nothing lives here yet.</h1>
      <p className="hero-lede">
        This address does not match a page. Head back to the <Link to="/">home page</Link>.
      </p>
    </section>
  );
}
