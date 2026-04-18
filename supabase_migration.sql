-- Run this ONCE in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mlkjhjgovfgsjjkaclooa/editor

CREATE TABLE IF NOT EXISTS wishes (
  id            TEXT PRIMARY KEY,
  category      TEXT NOT NULL,
  sender        TEXT,
  receiver      TEXT,
  message       TEXT NOT NULL,
  passkey       TEXT,
  bg_image      TEXT,
  font          TEXT DEFAULT 'playfair',
  overlay_opacity REAL DEFAULT 0.55,
  expires_at    TIMESTAMPTZ,
  opened_at     TIMESTAMPTZ,
  reply_to      TEXT,
  scheduled_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: disable Row Level Security so the service role key can read/write freely
-- (it bypasses RLS anyway, but this also allows anon reads if needed)
ALTER TABLE wishes DISABLE ROW LEVEL SECURITY;

-- Custom users table (username + hashed password — no Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Link wishes to users (optional — anonymous wishes have NULL user_id)
ALTER TABLE wishes ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id) ON DELETE SET NULL;

-- Background music track ID chosen by sender (optional)
ALTER TABLE wishes ADD COLUMN IF NOT EXISTS music TEXT DEFAULT NULL;

-- Font colour (CSS color value) chosen by sender
ALTER TABLE wishes ADD COLUMN IF NOT EXISTS font_color TEXT DEFAULT NULL;

-- Dynamic particle type chosen by sender
ALTER TABLE wishes ADD COLUMN IF NOT EXISTS particle_type TEXT DEFAULT 'petals';
