import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, phone, description, note, placement, size, photo, photoName, language } = body;

  // Required fields validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json({ success: false, error: 'Invalid name' }, { status: 400 });
  }
  if (!email || typeof email !== 'string' || email.trim().length < 3) {
    return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
  }
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return NextResponse.json({ success: false, error: 'Invalid description' }, { status: 400 });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.error('GOOGLE_SCRIPT_URL is not configured');
    return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 });
  }

  try {
    // Longer timeout for photo uploads (Apps Script needs time to save to Drive)
    const controller = new AbortController();
    const timeoutMs = photo ? 30000 : 10000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: (phone || '').trim(),
        description: description.trim(),
        note: (note || '').trim(),
        placement: (placement || '').trim(),
        size: (size || '').trim(),
        photo: photo || '',
        photoName: photoName || '',
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
