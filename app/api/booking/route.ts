import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, contact, concept, language } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json({ success: false, error: 'Invalid name' }, { status: 400 });
  }
  if (!contact || typeof contact !== 'string' || contact.trim().length < 3) {
    return NextResponse.json({ success: false, error: 'Invalid contact' }, { status: 400 });
  }
  if (!concept || typeof concept !== 'string' || concept.trim().length < 10) {
    return NextResponse.json({ success: false, error: 'Invalid concept' }, { status: 400 });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.error('GOOGLE_SCRIPT_URL is not configured');
    return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        contact: contact.trim(),
        concept: concept.trim(),
        language: language || 'en',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Apps Script returned ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking submission failed:', error);
    return NextResponse.json(
      { success: false, error: 'Submission failed' },
      { status: 502 }
    );
  }
}
