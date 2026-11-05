-- Bakuro Pages: core tables (users, profiles, sessions, pages).
-- Gimmick, submission and asset tables arrive in later migrations, with the phase that uses them.
-- Timestamps are unix epoch milliseconds (INTEGER).

CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  username      TEXT NOT NULL COLLATE NOCASE UNIQUE
                CHECK (length(username) BETWEEN 3 AND 24),
  email         TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash TEXT NOT NULL,            -- PBKDF2 output with salt and parameters encoded; never plaintext
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);

CREATE TABLE profiles (
  user_id      TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT CHECK (display_name IS NULL OR length(display_name) <= 60),
  bio          TEXT CHECK (bio IS NULL OR length(bio) <= 500),
  updated_at   INTEGER NOT NULL
);

CREATE TABLE sessions (
  id           TEXT PRIMARY KEY,          -- SHA-256 of the session token; the raw token only lives in the cookie
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);
CREATE INDEX idx_sessions_user    ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

CREATE TABLE pages (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,  -- one page per account; route is /{username}
  title        TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80),
  description  TEXT CHECK (description IS NULL OR length(description) <= 300),
  is_published INTEGER NOT NULL DEFAULT 0 CHECK (is_published IN (0, 1)),
  doc_version  INTEGER NOT NULL DEFAULT 1,  -- schema version of the JSON document
  document     TEXT NOT NULL CHECK (json_valid(document)),  -- page settings + elements, validated by the Worker
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL,
  published_at INTEGER
);
CREATE INDEX idx_pages_published ON pages(is_published);
