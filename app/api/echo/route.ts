import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Echo received:', body);
    return NextResponse.json({ received: true, payload: body });
  } catch (err) {
    console.error('Echo error:', err);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
