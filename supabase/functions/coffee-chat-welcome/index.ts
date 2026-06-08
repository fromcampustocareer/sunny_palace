// Coffee Chat Network — confirmation email sent when a profile is APPROVED.
//
// SECURITY (HIGH-4 follow-up):
//   This function used to be an unauthenticated email-send vector: it ran with
//   verify_jwt=false and accepted {name,email,profileId} straight from the POST
//   body, so anyone holding the public anon/publishable key could make it blast
//   a "You're in the Coffee Chat Network" email to ANY address (spam/abuse).
//
//   It is now secured exactly like send-welcome-email:
//     1. It is NOT in the verify_jwt=false list in config.toml, so the gateway
//        requires a valid Authorization bearer (the anon key alone is rejected).
//     2. A shared-secret gate runs BEFORE the body is read: the caller must send
//        an `x-webhook-secret` header equal to env var WEBHOOK_SECRET. We fail
//        CLOSED if WEBHOOK_SECRET is unset, and compare in constant time.
//
// REPURPOSED: it is now fired by a Supabase **Database Webhook** on the
//   coffee_chat_profiles table (UPDATE), and only sends on the
//   pending -> approved transition (it self-guards; see the approval check).
//
// OPERATOR WIRING (Supabase Dashboard -> Database -> Webhooks):
//   - Create a webhook on table `coffee_chat_profiles`, event UPDATE.
//   - HTTP request -> POST to this function's URL
//       (https://<project-ref>.functions.supabase.co/coffee-chat-welcome).
//   - Headers:
//       Authorization: Bearer <a valid JWT, e.g. the service_role key>
//       x-webhook-secret: <the WEBHOOK_SECRET value>
//       Content-Type: application/json
//   - Supabase DB webhooks POST the standard payload shape:
//       { type, table, record, old_record }
//     This function reads email/name/id from `record`, and only emails when the
//     row transitioned into status='approved' (old_record.status !== 'approved'
//     && record.status === 'approved'). Webhook firings on any non-approval
//     update are a no-op (200 {skipped:true}, no email sent).
//
// Secrets:
//   supabase secrets set RESEND_API_KEY=<your Resend key>
//   supabase secrets set WEBHOOK_SECRET=<same secret used by send-welcome-email>
//
// Deploy (note: NO --no-verify-jwt; the gateway must keep JWT verification on):
//   supabase functions deploy coffee-chat-welcome

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')
// Resend won't let you send "from" a gmail.com address you don't own (no SPF/DKIM control).
// So the visible sender uses Resend's verified test domain, and replies route to the
// real campus-to-career inbox via reply_to. When fromcampuscareer.com is verified in
// Resend, swap FROM_EMAIL to something like 'Jose & Jocelyn <hello@fromcampuscareer.com>'.
const FROM_EMAIL = 'Jose & Jocelyn <onboarding@resend.dev>'
const REPLY_TO = 'campustocareerteam@gmail.com'

// Basic email shape check — not RFC-perfect, just enough to reject garbage
// before we hand it to Resend / interpolate it.
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
// Max length for the user-controlled first name (used in HTML and text bodies).
const MAX_NAME_LENGTH = 100

// Escape user-controlled values before interpolating them into an email `html`
// string, to prevent HTML/email injection. `&` MUST be escaped first.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Constant-time-ish string comparison to avoid leaking the secret via timing.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  // --- Shared-secret gate (must run BEFORE reading the body) ---
  // This function is intentionally NOT in the verify_jwt=false list, so the
  // gateway already requires a valid Authorization bearer. The shared secret
  // below is the real gate: the operator configures the Supabase DB webhook
  // (Dashboard -> Database -> Webhooks) to send the same value in the
  // `x-webhook-secret` header. Fail CLOSED if the env var is unset.
  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET is not configured; rejecting request')
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }
  const providedSecret = req.headers.get('x-webhook-secret') ?? ''
  if (!timingSafeEqual(providedSecret, WEBHOOK_SECRET)) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ sent: false, error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Supabase DB webhook payload shape: { type, table, record, old_record }.
    const payload = await req.json()
    const record = payload?.record
    const oldRecord = payload?.old_record

    // Only email on the pending -> approved transition. If we have an old_record
    // (a real UPDATE webhook), require the status to have just become 'approved'.
    // If called with only a record (manual/testing), still require approved.
    const isApproval = oldRecord
      ? oldRecord.status !== 'approved' && record?.status === 'approved'
      : record?.status === 'approved'
    if (!isApproval) {
      return new Response(JSON.stringify({ skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const email = typeof record?.email === 'string' ? record.email.trim() : ''
    if (!email || !EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({ sent: false, error: 'invalid email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const name = record?.name
    const profileId = record?.id
    const firstName = ((name || '').toString().split(/\s+/)[0] || 'there').slice(0, MAX_NAME_LENGTH)
    // profileId goes into a URL and an href attribute — URL-encode it so it can't
    // break out of the attribute / href.
    const profileUrl = profileId
      ? `https://josexjocelyn.com/coffee-chat?profile=${encodeURIComponent(String(profileId))}`
      : 'https://josexjocelyn.com/coffee-chat'

    const html = buildEmailHtml(firstName, profileUrl)
    const text = buildEmailText(firstName, profileUrl)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        reply_to: REPLY_TO,
        to: [email],
        subject: "You're in the Coffee Chat Network",
        html,
        text,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ sent: false, error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ sent: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ sent: false, error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function buildEmailText(firstName: string, profileUrl: string): string {
  return [
    `Hi ${firstName},`,
    '',
    "Your Coffee Chat Network profile is live. Students and peers in the Jose × Jocelyn community can now find you and reach out via your LinkedIn for short conversations.",
    '',
    `View your listing: ${profileUrl}`,
    '',
    'A few reminders:',
    '— You control how many chats you take per month — update us anytime.',
    "— You're never obligated to accept every request.",
    '— Reply to this email to edit, pause, or delete your profile.',
    '',
    "Thanks for being someone who shows up for the next person.",
    '',
    '— Jose & Jocelyn',
    'campustocareerteam@gmail.com',
  ].join('\n')
}

function buildEmailHtml(firstName: string, profileUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're in the Coffee Chat Network</title>
</head>
<body style="margin:0;padding:0;background:#F2E4CE;font-family:Georgia,serif;color:#1A1916;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2E4CE;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:#162B44;border-radius:12px 12px 0 0;padding:36px 40px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(242,228,206,.5);">From Campus to Career</p>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#F2E4CE;line-height:1.2;">You're in the Coffee Chat Network</h1>
            </td>
          </tr>
          <tr>
            <td style="background:#FFFFFF;padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Hi ${escapeHtml(firstName)},</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Your profile is live. Students and peers in the Jose × Jocelyn community can find you and reach out via your LinkedIn for short conversations about the work you do.</p>
              <p style="margin:0 0 24px;text-align:center;">
                <a href="${profileUrl}" style="display:inline-block;background:#1A1916;color:#F2E4CE;padding:14px 28px;border-radius:8px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:600;">View your listing →</a>
              </p>
              <p style="margin:0 0 8px;font-size:14px;line-height:1.65;color:#6B5E52;"><strong style="color:#1A1916;">A few reminders</strong></p>
              <ul style="margin:0 0 16px;padding-left:18px;font-size:14px;line-height:1.7;color:#6B5E52;">
                <li>You control how many chats you take per month — update us anytime.</li>
                <li>You're never obligated to accept every request.</li>
                <li>Reply to this email to edit, pause, or delete your profile.</li>
              </ul>
              <p style="margin:24px 0 0;font-size:14px;line-height:1.65;color:#6B5E52;">Thanks for being someone who shows up for the next person.</p>
              <p style="margin:8px 0 0;font-size:14px;color:#1A1916;">— Jose &amp; Jocelyn</p>
            </td>
          </tr>
          <tr>
            <td style="background:#F2E4CE;padding:24px 40px;border-radius:0 0 12px 12px;border-top:1px solid rgba(0,0,0,.08);">
              <p style="margin:0;font-size:12px;color:#6B5E52;line-height:1.6;">Replies to this email go straight to <a href="mailto:campustocareerteam@gmail.com" style="color:#162B44;">campustocareerteam@gmail.com</a>. We read every message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
