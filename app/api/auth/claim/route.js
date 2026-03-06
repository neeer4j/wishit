import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export const runtime = 'nodejs';

// Claim an anonymous wish for a logged-in user (only if not already claimed)
export async function POST(request) {
    try {
        const { wishId, userId } = await request.json();

        if (!wishId || !userId) {
            return NextResponse.json({ error: 'wishId and userId are required' }, { status: 400 });
        }

        const supabase = await initDb();

        const { error } = await supabase
            .from('wishes')
            .update({ user_id: userId })
            .eq('id', wishId)
            .is('user_id', null); // Only claim if not already claimed

        if (error) throw error;

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('POST /api/auth/claim error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}
