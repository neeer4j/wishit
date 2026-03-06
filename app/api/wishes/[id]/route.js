import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request, context) {
    try {
        const { id } = await context.params;
        const supabase = await initDb();

        const { data: row, error } = await supabase
            .from('wishes')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const now = new Date();

        // Scheduled — not yet unlocked
        if (row.scheduled_at && new Date(row.scheduled_at) > now) {
            return NextResponse.json({
                scheduled: true,
                scheduled_at: row.scheduled_at,
                category: row.category,
                sender: row.sender,
                receiver: row.receiver,
            });
        }

        // Expired
        if (row.expires_at && new Date(row.expires_at) < now) {
            return NextResponse.json({ expired: true });
        }

        return NextResponse.json({
            category: row.category,
            sender: row.sender,
            receiver: row.receiver,
            hasPasskey: !!row.passkey,
            message: row.passkey ? null : row.message,
            bg_image: row.bg_image || null,
            font: row.font || 'playfair',
            overlay_opacity: row.overlay_opacity ?? 0.55,
            expires_at: row.expires_at || null,
            reply_to: row.reply_to || null,
            opened_at: row.opened_at || null,
            created_at: row.created_at,
        });
    } catch (e) {
        console.error('GET wish error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}

export async function POST(request, context) {
    try {
        const { id } = await context.params;
        const { passkey } = await request.json();
        const supabase = await initDb();

        const { data: row, error } = await supabase
            .from('wishes')
            .select('message, passkey, bg_image, font, overlay_opacity')
            .eq('id', id)
            .single();

        if (error || !row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (row.passkey && row.passkey !== passkey) {
            return NextResponse.json({ error: 'Wrong passkey' }, { status: 401 });
        }

        return NextResponse.json({
            message: row.message,
            bg_image: row.bg_image || null,
            font: row.font || 'playfair',
            overlay_opacity: row.overlay_opacity ?? 0.55,
        });
    } catch (e) {
        console.error('POST wish error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}

// Mark wish as opened
export async function PATCH(request, context) {
    try {
        const { id } = await context.params;
        const supabase = await initDb();

        const { error } = await supabase
            .from('wishes')
            .update({ opened_at: new Date().toISOString() })
            .eq('id', id)
            .is('opened_at', null);

        if (error) throw error;
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('PATCH wish error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}
