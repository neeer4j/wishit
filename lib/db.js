import { neon } from '@neondatabase/serverless';

let sql;

export function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please add Vercel Postgres storage to your project.');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS wishes (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      sender TEXT,
      receiver TEXT,
      message TEXT NOT NULL,
      passkey TEXT,
      bg_image TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  return sql;
}
