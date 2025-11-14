import { NextResponse } from 'next/server';

// Create a verification session with Didit
export async function POST(request: Request) {
  const apiKey = process.env.DIDIT_API_KEY;
  const workflowId = process.env.DIDIT_WORKFLOW_ID;
  let callbackBase = process.env.NEXT_PUBLIC_APP_URL;
  const urlParams = new URL(request.url).searchParams;
  const explicitOverride = urlParams.get('callback_base') || request.headers.get('x-callback-base');
  const useTestCallback = urlParams.get('use_test_callback') === '1';
  const testCallbackUrl = urlParams.get('callback_test_url');

  // Allow dynamic override of callback base using request origin (for mobile tunnels)
  try {
    // Highest priority: explicit override via query/header
    if (explicitOverride) {
      callbackBase = explicitOverride.trim();
    } else {
      const referer = request.headers.get('referer');
      const originHeader = request.headers.get('origin');
      const candidate = originHeader || (referer ? new URL(referer).origin : null);
      if (candidate && callbackBase && callbackBase.includes('localhost') && !candidate.includes('localhost')) {
        callbackBase = candidate;
      }
    }
  } catch {}

  // Ensure callback uses https if Didit will redirect from https -> avoid mixed content blocks on mobile
  if (callbackBase && callbackBase.startsWith('http://') && !callbackBase.includes('localhost')) {
    // Auto-upgrade to https assumption; user can still supply http explicitly via override if needed
    callbackBase = callbackBase.replace('http://', 'https://');
  }

  if (!apiKey || !workflowId || !callbackBase) {
    return NextResponse.json(
      { error: 'Server misconfiguration: missing DIDIT_API_KEY, DIDIT_WORKFLOW_ID or NEXT_PUBLIC_APP_URL' },
      { status: 500 }
    );
  }

  try {
    let chosenCallback = `${callbackBase}/verification-success`;

    // If test callback requested, override with a well-known public page to isolate redirect issues
    if (useTestCallback) {
      // Prefer user supplied test URL, else fallback to example.com
      const candidate = (testCallbackUrl && /^https?:\/\//.test(testCallbackUrl)) ? testCallbackUrl : 'https://example.com/';
      chosenCallback = candidate;
    }
    const response = await fetch('https://verification.didit.me/v2/session/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        callback: chosenCallback,
        callback_url: chosenCallback, // send both just in case
        vendor_data: 'USER_ID_PLACEHOLDER',
      }),
    });

    if (!response.ok) {
      let detail: any = null;
      try { detail = await response.json(); } catch { detail = await response.text(); }
      console.error('Didit Create Session error:', detail);
      return NextResponse.json(
        { error: 'Failed to create verification session', detail },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Normalize response to always expose verification_url
    const verification_url = (data.url || data.verification_url);
    return NextResponse.json({
      ...data,
      verification_url,
      effective_callback: chosenCallback,
      debug_origin: request.headers.get('origin'),
      debug_referer: request.headers.get('referer'),
      callback_source: useTestCallback ? 'test-callback' : (explicitOverride ? 'explicit-override' : 'auto-detect'),
      test_mode: useTestCallback,
    });
  } catch (error) {
    console.error('Unexpected error creating Didit session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
