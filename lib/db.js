import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-side admin client (uses service role key — never exposed to browser)
let adminClient;

export function getDb() {
  if (!adminClient) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      throw new Error('Supabase environment variables are not set.');
    }
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });
  }
  return adminClient;
}

// Keep initDb as the canonical way to get the client so API routes
// don't need to change their call signature.
// Table creation is handled via the Supabase SQL migration (see migration.sql).
export async function initDb() {
  return getDb();
}
