/**
 * POST /api/lead — the lead form endpoint.
 *
 * This is the port of inc/form.php. Vercel runs it as a serverless function, so
 * a few things that PHP got from a long-lived server had to change:
 *
 *  · No filesystem. lead_store() appended to storage/leads-YYYY-MM.jsonl, which
 *    on Vercel would be written to an ephemeral container and lost. Delivery is
 *    email (Resend) and/or a webhook instead — configured by env var, and the
 *    request is rejected rather than silently accepted when neither is set.
 *  · No session, so no CSRF token round trip. Cross-origin form posts are
 *    blocked by checking Origin against Host, which is what a same-origin form
 *    needs and all a token was buying here.
 *  · No shared memory, so the rate limiter is per-instance and best-effort.
 *    Treat it as a speed bump, not a control — see the README if you need a real
 *    one (Upstash/Vercel KV).
 *
 * What did NOT change: the TCPA consent is mandatory, unticked by default, and
 * its exact wording is recorded with the submission alongside the timestamp,
 * page, IP and user agent. Consent you cannot evidence is consent you do not
 * have.
 */

const MAX = { name: 80, phone: 32, email: 120, postcode: 24, message: 1200 };
const MIN_ELAPSED_MS = 3000; // a human cannot read and complete this faster
const RATE_MAX = 5; // submissions per IP per hour
const RATE_WINDOW_MS = 60 * 60 * 1000;

/* Kept in sync with MAIN_SERVICES in src/config/site.js. Duplicated rather than
   imported because the API runs outside the Vite bundle, where import.meta.env
   does not exist. */
const SERVICES = ['Pest control', 'Roofing', 'Gardening', 'Plumbing'];

const CONSENT_TEXT =
  'By clicking submit, I consent to receive calls and text messages from AD Housing Services and its network of independent contractors at the number provided. Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to opt out.';

/* Per-instance, so it resets on a cold start and is not shared between the
   several instances Vercel may run concurrently. */
const hits = new Map();

function rateExceeded(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => t > now - RATE_WINDOW_MS);
  hits.set(ip, recent);

  if (hits.size > 5000) hits.clear(); // crude ceiling so this cannot grow forever
  return recent.length >= RATE_MAX;
}

function recordHit(ip) {
  hits.set(ip, [...(hits.get(ip) ?? []), Date.now()]);
}

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function validate(body) {
  const errors = {};
  const values = {
    name: clean(body.name, MAX.name),
    phone: clean(body.phone, MAX.phone),
    email: clean(body.email, MAX.email),
    postcode: clean(body.postcode, MAX.postcode),
    message: clean(body.message, MAX.message),
    service: clean(body.service, 60),
  };

  if (values.name === '') errors.name = 'Please tell us your name.';

  const digits = values.phone.replace(/\D/g, '');
  if (values.phone === '') {
    errors.phone = 'A phone number is needed so we can call you back.';
  } else if (digits.length < 7 || digits.length > 15) {
    errors.phone = 'That does not look like a complete phone number.';
  }

  if (values.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'That email address does not look right.';
  }

  if (!SERVICES.includes(values.service)) {
    errors.service = 'Please choose the service you need.';
  }

  if (values.message === '') errors.message = 'Tell us briefly what you have noticed.';

  /* TCPA: consent must be affirmative. There is no path that treats a missing
     checkbox as agreement. */
  if (body.consent !== true && body.consent !== 'yes') {
    errors.consent =
      'We need your consent to call or text you back before we can take the enquiry.';
  }

  return { errors, values };
}

function formatLead(lead) {
  return [
    'New enquiry from the website.',
    '',
    `Name:     ${lead.name}`,
    `Phone:    ${lead.phone}`,
    `Email:    ${lead.email || '—'}`,
    `Postcode: ${lead.postcode || '—'}`,
    `Service:  ${lead.service}`,
    '',
    'Message:',
    lead.message,
    '',
    '---',
    `Consent given: ${lead.consentText}`,
    `Recorded:      ${lead.submittedAt} from ${lead.page}`,
    `IP:            ${lead.ip}`,
    `User agent:    ${lead.userAgent}`,
  ].join('\n');
}

async function deliver(lead) {
  const delivered = [];

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;

  if (resendKey && to && from) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email || undefined,
        subject: `Website enquiry: ${lead.service} — ${lead.name}`,
        text: formatLead(lead),
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
    }
    delivered.push('email');
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded ${response.status}`);
    }
    delivered.push('webhook');
  }

  return delivered;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  /* Same-origin only. A browser always sends Origin on a cross-origin POST, so
     a mismatch here is the case a CSRF token existed to catch. */
  const origin = req.headers.origin;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (origin) {
    let originHost;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    if (originHost !== host) {
      return res.status(403).json({ ok: false, message: 'Request blocked.' });
    }
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};

  /* Honeypot and time trap. Both report success so a bot learns nothing about
     which signal caught it. */
  const tooFast =
    typeof body.elapsedMs === 'number' && body.elapsedMs >= 0 && body.elapsedMs < MIN_ELAPSED_MS;
  if (String(body.website ?? '').trim() !== '' || tooFast) {
    return res.status(200).json({ ok: true });
  }

  const ip =
    (req.headers['x-forwarded-for'] ?? '').toString().split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (rateExceeded(ip)) {
    return res.status(429).json({
      ok: false,
      message: 'Too many enquiries from this connection in the last hour. Please call instead.',
    });
  }

  const { errors, values } = validate(body);
  if (Object.keys(errors).length) {
    return res.status(422).json({ ok: false, errors });
  }

  const lead = {
    ...values,
    submittedAt: new Date().toISOString(),
    page: clean(body.page, 200) || '/contact',
    ip,
    userAgent: String(req.headers['user-agent'] ?? '').slice(0, 200),
    consent: true,
    consentText: CONSENT_TEXT,
  };

  try {
    const delivered = await deliver(lead);

    if (delivered.length === 0) {
      /* Nothing is configured, so this lead would vanish. Say so rather than
         showing a success message over a dropped enquiry — the visitor still
         has the phone number, and losing a paid lead silently is the worst
         outcome available here. */
      console.error('[lead] no delivery channel configured; enquiry not stored', {
        page: lead.page,
      });
      return res.status(503).json({
        ok: false,
        message:
          'The enquiry form is not connected yet. Please call us instead — the number is on this page.',
      });
    }

    recordHit(ip);
    console.log(`[lead] delivered via ${delivered.join(' + ')} from ${lead.page}`);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[lead] delivery failed', error);
    return res.status(502).json({
      ok: false,
      message: 'We could not send that. Please call us instead — the number is below.',
    });
  }
}
