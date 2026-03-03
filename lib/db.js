import { createClient } from '@libsql/client';

let client;

function getClient() {
  if (!client) {
    // Local: use file-based SQLite. Production (Vercel): use TURSO_DATABASE_URL + TURSO_AUTH_TOKEN env vars
    const url = process.env.TURSO_DATABASE_URL || 'file:wishes.db';
    const authToken = process.env.TURSO_AUTH_TOKEN;
    client = createClient(authToken ? { url, authToken } : { url });
  }
  return client;
}

export async function initDb() {
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS wishes (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      sender TEXT,
      receiver TEXT,
      message TEXT NOT NULL,
      passkey TEXT,
      bg_image TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  return db;
}

export default getClient;
