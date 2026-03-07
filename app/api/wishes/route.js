import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { initDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const {
            category, sender, receiver, message, passkey, bg_image,
            font, overlay_opacity, expires_at, scheduled_at, user_id, music, font_color,
        } = await request.json();

        if (!category || !message?.trim()) {
            return NextResponse.json({ error: 'Category and message are required' }, { status: 400 });
        }

        const supabase = await initDb();
        const id = uuidv4();

        const { error } = await supabase.from('wishes').insert({
            id,
            category,
            sender: sender || null,
            receiver: receiver || null,
            message,
            passkey: passkey || null,
            bg_image: bg_image || null,
            font: font || 'playfair',
            overlay_opacity: overlay_opacity ?? 0.55,
            expires_at: expires_at || null,
            scheduled_at: scheduled_at || null,
            user_id: user_id || null,
            music: music || null,
            font_color: font_color || null,
        });

        if (error) throw error;

        return NextResponse.json({ id }, { status: 201 });
    } catch (e) {
        console.error('POST /api/wishes error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}
