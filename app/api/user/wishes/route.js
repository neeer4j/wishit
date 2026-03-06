import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const supabase = await initDb();

        const { data, error } = await supabase
            .from('wishes')
            .select('id, category, sender, receiver, created_at, expires_at, opened_at, scheduled_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ wishes: data || [] });
    } catch (e) {
        console.error('GET /api/user/wishes error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}
