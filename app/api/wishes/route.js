import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { initDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const { category, sender, receiver, message, passkey, bg_image } = await request.json();
        if (!category || !message?.trim()) {
            return NextResponse.json({ error: 'Category and message are required' }, { status: 400 });
        }
        const db = await initDb();
        const id = uuidv4();
        await db.execute({
            sql: 'INSERT INTO wishes (id, category, sender, receiver, message, passkey, bg_image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [id, category, sender || null, receiver || null, message, passkey || null, bg_image || null],
        });
        return NextResponse.json({ id }, { status: 201 });
    } catch (e) {
        console.error('POST /api/wishes error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
