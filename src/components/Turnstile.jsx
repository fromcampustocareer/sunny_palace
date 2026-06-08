import { useEffect, useRef, useCallback } from 'react'

// Cloudflare Turnstile widget. Shared across every public form (contact, waitlist,
// coffee chat, resume reviews, opportunity board). It surfaces the verification
// token to the parent via onToken(token) and clears it (onToken('')) on expiry/error.
//
// The Cloudflare script is injected once on demand — we do NOT touch index.html so
// the widget only loads on pages that actually render a form.
//
// If VITE_TURNSTILE_SITE_KEY is unset (e.g. local dev without the var) the component
// renders nothing and never blocks submission, so the app still builds and runs.
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY