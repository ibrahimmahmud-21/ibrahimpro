import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzezggv';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Public config: the Turnstile SITE key is publishable by design.
  if (req.method === 'GET') {
    return json({ siteKey: Deno.env.get('TURNSTILE_SITE_KEY') ?? null });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(payload.name);
  const email = str(payload.email);
  const subject = str(payload.subject);
  const message = str(payload.message);
  const token = str(payload.turnstileToken);
  const honeypot = str(payload.website);

  // Silently accept bot submissions caught by the honeypot.
  if (honeypot) return json({ ok: true });

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 100) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)
    errors.email = 'Please enter a valid email address.';
  if (subject.length < 2 || subject.length > 150) errors.subject = 'Please enter a subject.';
  if (message.length < 10 || message.length > 2000)
    errors.message = 'Please write at least 10 characters.';
  if (Object.keys(errors).length > 0) return json({ error: 'Validation failed', errors }, 400);

  if (!token) return json({ error: 'Please complete the security verification.' }, 400);

  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) return json({ error: 'Security verification is not configured.' }, 500);

  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const verifyBody = new URLSearchParams({ secret, response: token });
  if (ip) verifyBody.set('remoteip', ip);

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: verifyBody,
  });
  const verify = await verifyRes.json().catch(() => null);
  if (!verify?.success) {
    return json({ error: 'Security verification failed. Please try again.' }, 400);
  }

  const fsRes = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ name, email, subject, message }),
  });

  if (!fsRes.ok) {
    const fsJson = await fsRes.json().catch(() => null);
    const msg = fsJson?.errors?.[0]?.message || 'Something went wrong. Please try again.';
    return json({ error: msg }, 502);
  }

  return json({ ok: true });
});
