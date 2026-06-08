import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.107.0'

// Public, Turnstile-gated insert proxy for the three moderated forms:
//   coffee_chat  -> coffee_chat_profiles
//   resume       -> resume_submissions
//   opportunity  -> opportunities
//
// The browser no longer inserts these rows directly (anon INSERT is revoked in
// migration 007). All inserts flow through here, run with the service role, and
// require a valid Cloudflare Turnstile token. Server-side we force status/visibility
// fields and whitelist columns so a crafted client payload can't self-approve a row.

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN')
const TURNSTILE_SECRET = Deno.env.get('TURNSTILE_SECRET')
const MAX_BODY_BYTES = 1_000_000 // ~1MB — these are JSON rows, not file uploads.

const corsHeaders = {
  // Lock to the production origin when configured; only fall back to '*' for local dev.
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

// Verify a Cloudflare Turnstile token. Returns true only on a verified human.
async function verifyTurnstile(token: unknown, remoteip?: string | null): Promise<boolean> {
  if (!TURNSTILE_SECRET) {
    console.error('TURNSTILE_SECRET is not set — rejecting submission')
    return false
  }
  if (!token || typeof token !== 'string') return false
  try {
    const form = new URLSearchParams()
    form.set('secret', TURNSTILE_SECRET)
    form.set('response', token)
    if (remoteip) form.set('remoteip', remoteip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    const data = await res.json()
    return data?.success === true
  } catch (err) {
    console.error('Turnstile verify error:', err)
    return false
  }
}

// Whitelisted, type-coercing column maps. The client can ONLY influence these
// fields; everything else (status, public_profile, like_count, view_count, ids,
// timestamps) is set server-side or left to DB defaults.
const TABLE_BY_TYPE: Record<string, string> = {
  coffee_chat: 'coffee_chat_profiles',
  resume: 'resume_submissions',
  opportunity: 'opportunities',
}

const str = (v: unknown) => (typeof v === 'string' ? v : null)
const trimOrNull = (v: unknown) => {
  const s = str(v)
  const t = s?.trim()
  return t ? t : null
}
const strArray = (v: unknown) =>
  Array.isArray(v) ? v.filter((x) => typeof x === 'string').map((x) => String(x)) : []

function buildRow(type: string, payload: Record<string, unknown>): Record<string, unknown> {
  switch (type) {
    case 'coffee_chat':
      return {
        name: trimOrNull(payload.name),
        pronouns: trimOrNull(payload.pronouns),
        email: trimOrNull(payload.email),
        linkedin_url: trimOrNull(payload.linkedin_url),
        role_title: trimOrNull(payload.role_title),
        location: trimOrNull(payload.location),
        role_function: strArray(payload.role_function),
        identity_tags: strArray(payload.identity_tags),
        topics: trimOrNull(payload.topics),
        capacity: trimOrNull(payload.capacity),
        avatar_url: trimOrNull(payload.avatar_url),
        consented_at: new Date().toISOString(),
        // Force server-side — never trust the client for these:
        status: 'pending',
        public_profile: false,
      }
    case 'resume':
      return {
        handle: trimOrNull(payload.handle),
        email: trimOrNull(payload.email),
        linkedin_url: trimOrNull(payload.linkedin_url),
        role_title: trimOrNull(payload.role_title),
        role_type: trimOrNull(payload.role_type),
        stage: trimOrNull(payload.stage),
        target_companies: str(payload.target_companies), // free-text column, not an array
        background_tags: strArray(payload.background_tags),
        allow_download: payload.allow_download === true,
        allow_annotation: payload.allow_annotation === true,
        story: trimOrNull(payload.story),
        file_name: trimOrNull(payload.file_name),
        avatar_url: trimOrNull(payload.avatar_url),
        // Force server-side:
        status: 'pending',
      }
    case 'opportunity':
      return {
        role: trimOrNull(payload.role),
        company: trimOrNull(payload.company),
        role_type: trimOrNull(payload.role_type),
        link: trimOrNull(payload.link),
        deadline: trimOrNull(payload.deadline),
        eligibility: trimOrNull(payload.eligibility),
        why: trimOrNull(payload.why),
        submitted_by: trimOrNull(payload.submitted_by),
        location: trimOrNull(payload.location),
        pay: trimOrNull(payload.pay),
        // Force server-side — opportunities also enter the moderation queue now:
        status: 'pending',
      }
    default:
      return {}
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  // Reject oversized bodies up front when the client declares a length.
  const declaredLen = Number(req.headers.get('content-length') || '0')
  if (declaredLen > MAX_BODY_BYTES) {
    return json({ error: 'Payload too large' }, 413)
  }

  try {
    const raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) {
      return json({ error: 'Payload too large' }, 413)
    }

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(raw)
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }

    const { type, turnstileToken, payload } = parsed as {
      type?: string
      turnstileToken?: string
      payload?: Record<string, unknown>
    }

    // 1. Turnstile gate — generic 403 on failure, no work done.
    const remoteip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    const ok = await verifyTurnstile(turnstileToken, remoteip)
    if (!ok) {
      return json({ error: 'Verification failed' }, 403)
    }

    // 2. Validate type → table.
    if (!type || !(type in TABLE_BY_TYPE)) {
      return json({ error: 'Invalid submission type' }, 400)
    }
    const table = TABLE_BY_TYPE[type]
    const row = buildRow(type, (payload && typeof payload === 'object') ? payload : {})

    // 3. Service-role client (bypasses RLS). Prefer the new secret key, fall back
    //    to the legacy service_role key — mirrors add-to-waitlist.
    const serviceKey = (() => {
      try {
        const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}')
        if (secretKeys?.default) return secretKeys.default
      } catch (_) { /* fall through to legacy key */ }
      return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    })()

    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', serviceKey)

    const { error: dbErr } = await supabase.from(table).insert(row)
    if (dbErr) {
      // Keep DB internals out of the client response.
      console.error(`Insert error (${table}):`, dbErr)
      return json({ error: 'Could not save submission' }, 500)
    }

    return json({ ok: true }, 200)
  } catch (err) {
    console.error('Function error:', err)
    return json({ error: 'Unexpected error' }, 500)
  }
})
