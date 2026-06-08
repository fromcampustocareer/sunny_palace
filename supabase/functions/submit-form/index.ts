import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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