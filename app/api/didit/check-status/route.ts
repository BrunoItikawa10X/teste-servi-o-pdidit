import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  if (!process.env.DIDIT_API_KEY) {
    return NextResponse.json(
      { error: 'Server misconfiguration: missing DIDIT_API_KEY' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`https://verification.didit.me/v2/session/${sessionId}/`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.DIDIT_API_KEY,
      },
    });

    if (!response.ok) {
      let detail: any = null;
      try { detail = await response.json(); } catch { detail = await response.text(); }
      console.error('Didit Retrieve Session error:', detail);
      return NextResponse.json(
        { error: 'Failed to check session status', detail },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error checking Didit session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
