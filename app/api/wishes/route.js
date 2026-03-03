import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import getDb from '@/lib/db';

export async function POST(request) {
    try {
        const { category, sender, receiver, message, passkey, bg_image } = await request.json();
        if (!category || !message) {
            return NextResponse.json({ error: 'Category and message are required' }, { status: 400 });
        }
        const db = getDb();
        const id = uuidv4();
        db.prepare(
            'INSERT INTO wishes (id, category, sender, receiver, message, passkey, bg_image) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).run(id, category, sender || null, receiver || null, message, passkey || null, bg_image || null);
        return NextResponse.json({ id }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
