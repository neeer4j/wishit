import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'wishes.db');
let db;

function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.exec(`
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
    // Add bg_image column if upgrading existing DB
    try {
      db.exec(`ALTER TABLE wishes ADD COLUMN bg_image TEXT`);
    } catch (_) { }
  }
  return db;
}

export default getDb;
