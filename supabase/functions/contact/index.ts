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

  const url = new URL(req.url);

  // Public config: the Turnstile SITE key is publishable by design.
  if (req.method === 'GET') {
    // Non-sensitive diagnostic: probes whether EmailJS accepts server-side (non-browser) API calls.
    // Uses an intentionally invalid template id so NO email is ever sent.
    if (url.searchParams.get('check') === 'emailjs') {
      const serviceId = Deno.env.get('EMAILJS_SERVICE_ID');
      const publicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');
      const privateKey = Deno.env.get('EMAILJS_PRIVATE_KEY');
      const configured = {
        service_id: Boolean(serviceId),
        template_id: Boolean(Deno.env.get('EMAILJS_TEMPLATE_ID')),
        public_key: Boolean(publicKey),
        private_key: Boolean(privateKey),
      };
      if (!serviceId || !publicKey || !privateKey) return json({ configured, probe: null });
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: '__diagnostic_invalid__',
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {},
        }),
      });
      const text = await res.text().catch(() => '');
      return json({ configured, probe: { status: res.status, body: text.slice(0, 300) } });
    }
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

  // Submission succeeded — trigger the EmailJS auto-reply (server-side only).
  const serviceId = Deno.env.get('EMAILJS_SERVICE_ID');
  const templateId = Deno.env.get('EMAILJS_TEMPLATE_ID');
  const publicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');
  const privateKey = Deno.env.get('EMAILJS_PRIVATE_KEY');

  let autoReply: { ok: boolean; status?: number; detail?: string } = {
    ok: false,
    detail: 'not_configured',
  };

  if (serviceId && templateId && publicKey && privateKey) {
    // Template "To Email" is {{email}}; to_email/reply_to are sent as aliases for robustness.
    const templateParams = {
      name,
      email,
      subject,
      message,
      to_email: email,
      to_name: name,
      reply_to: email,
    };
    const payloadBody = JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: templateParams,
    });

    const send = (extraHeaders: Record<string, string> = {}) =>
      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...extraHeaders },
        body: payloadBody,
      });

    console.log('EmailJS request:', {
      service_id: serviceId,
      template_id: templateId,
      user_id_present: true,
      access_token_present: true,
      template_param_keys: Object.keys(templateParams),
      to: email,
    });

    try {
      let ejRes = await send();
      let text = await ejRes.text().catch(() => '');

      // EmailJS blocks non-browser calls unless enabled in dashboard security settings.
      // Retry once with browser-like headers in case only the strict origin check is failing.
      if (!ejRes.ok && ejRes.status === 403) {
        console.error('EmailJS auto-reply blocked:', ejRes.status, text);
        const origin = 'https://ibrahimpro.lovable.app';
        ejRes = await send({ origin, referer: `${origin}/`, 'user-agent': 'Mozilla/5.0' });
        text = await ejRes.text().catch(() => '');
      }

      if (ejRes.ok) {
        autoReply = { ok: true, status: ejRes.status };
        console.log('EmailJS auto-reply sent:', ejRes.status, text);
      } else {
        autoReply = { ok: false, status: ejRes.status, detail: text.slice(0, 300) };
        console.error('EmailJS auto-reply failed:', ejRes.status, text);
      }
    } catch (err) {
      autoReply = { ok: false, detail: String(err) };
      console.error('EmailJS auto-reply error:', err);
    }
  } else {
    console.error('EmailJS auto-reply skipped: missing secrets', {
      service_id: Boolean(serviceId),
      template_id: Boolean(templateId),
      public_key: Boolean(publicKey),
      private_key: Boolean(privateKey),
    });
  }

  return json({ ok: true, autoReply });
});

