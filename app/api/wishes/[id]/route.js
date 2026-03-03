import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request, context) {
    try {
        const { id } = await context.params;
        const db = await initDb();
        const result = await db.execute({ sql: 'SELECT * FROM wishes WHERE id = ?', args: [id] });
        const row = result.rows[0];
        if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({
            category: row.category,
            sender: row.sender,
            receiver: row.receiver,
            hasPasskey: !!row.passkey,
            message: row.passkey ? null : row.message,
            bg_image: row.bg_image || null,
            created_at: row.created_at,
        });
    } catch (e) {
        console.error('GET wish error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request, context) {
    try {
        const { id } = await context.params;
        const { passkey } = await request.json();
        const db = await initDb();
        const result = await db.execute({ sql: 'SELECT message, passkey, bg_image FROM wishes WHERE id = ?', args: [id] });
        const row = result.rows[0];
        if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (row.passkey && row.passkey !== passkey) {
            return NextResponse.json({ error: 'Wrong passkey' }, { status: 401 });
        }
        return NextResponse.json({ message: row.message, bg_image: row.bg_image || null });
    } catch (e) {
        console.error('POST wish error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
