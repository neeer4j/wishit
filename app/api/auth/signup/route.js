import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { initDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username?.trim() || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }
        if (username.trim().length < 3) {
            return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const supabase = await initDb();

        // Check if username taken
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('username', username.trim().toLowerCase())
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const id = uuidv4();

        const { error } = await supabase.from('users').insert({
            id,
            username: username.trim().toLowerCase(),
            password_hash,
        });

        if (error) throw error;

        return NextResponse.json({ userId: id, username: username.trim().toLowerCase() }, { status: 201 });
    } catch (e) {
        console.error('POST /api/auth/signup error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}
