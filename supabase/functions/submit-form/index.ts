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