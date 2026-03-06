import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { initDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request, context) {
    try {
        const { id } = await context.params;
        const supabase = await initDb();

        // Fetch the original wish to pre-fill reply defaults
        const { data: original, error: fetchError } = await supabase
            .from('wishes')
            .select('sender, category')
            .eq('id', id)
            .single();

        if (fetchError || !original) {
            return NextResponse.json({ error: 'Original wish not found' }, { status: 404 });
        }

        const body = await request.json();
        const {
            category, sender, receiver, message, passkey, bg_image,
            font, overlay_opacity, expires_at, scheduled_at,
        } = body;

        if (!category || !message?.trim()) {
            return NextResponse.json({ error: 'Category and message are required' }, { status: 400 });
        }

        const replyId = uuidv4();

        const { error } = await supabase.from('wishes').insert({
            id: replyId,
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
            reply_to: id,
        });

        if (error) throw error;

        return NextResponse.json({ id: replyId }, { status: 201 });
    } catch (e) {
        console.error('POST /api/wishes/[id]/reply error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}
