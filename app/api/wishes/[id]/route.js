import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET(request, { params }) {
    try {
        const db = getDb();
        const row = db.prepare('SELECT * FROM wishes WHERE id = ?').get(params.id);
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
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { passkey } = await request.json();
        const db = getDb();
        const row = db.prepare('SELECT message, passkey, bg_image FROM wishes WHERE id = ?').get(params.id);
        if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (row.passkey && row.passkey !== passkey) {
            return NextResponse.json({ error: 'Wrong passkey' }, { status: 401 });
        }
        return NextResponse.json({ message: row.message, bg_image: row.bg_image || null });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
