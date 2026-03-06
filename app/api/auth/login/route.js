import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { initDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username?.trim() || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const supabase = await initDb();

        const { data: user, error } = await supabase
            .from('users')
            .select('id, username, password_hash')
            .eq('username', username.trim().toLowerCase())
            .maybeSingle();

        if (error || !user) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        return NextResponse.json({ userId: user.id, username: user.username });
    } catch (e) {
        console.error('POST /api/auth/login error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}
