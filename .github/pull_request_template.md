<!--
  Thanks for the PR! Fill out each section. Delete sections that truly don't apply.
-->

## Summary

<!-- One or two sentences: what does this PR do and why? -->

## What changed

<!-- Bullet the concrete changes (files, behavior, schema/migrations, env vars). -->

-

## How tested

<!-- How did you verify this? Note that "works in the browser" is NOT sufficient
     for anything touching data access — the REST API and edge functions can be
     called directly. Include curl/test commands where relevant. -->

-

## Security review

This repo is heavily AI-assisted; most of our past security bugs were
plausible-but-wrong patterns that passed local testing. Review the full
[Security Review Checklist](../docs/SECURITY-REVIEW-CHECKLIST.md) and confirm
the high-value items below. Tick each box, or write `N/A`.

- [ ] **No `VITE_`-prefixed secrets** added — anything `VITE_*` is inlined into the public bundle (only the Supabase anon key / Turnstile site key may be `VITE_`).
- [ ] **Client cannot set `status` / role / visibility** fields — these are forced server-side (RLS `WITH CHECK` or a service-role function).
- [ ] **PII is not exposed via the REST API** — protected with column GRANTs or views, not just a client-side `select` list (RLS hides rows, not columns).
- [ ] **User-submitted URLs are sanitized** before use as an `href` (only `http(s):`; no `javascript:`/`data:`).
- [ ] **Validation happens at the server / DB boundary**, not only in the browser.
- [ ] **User input is HTML-escaped in emails** (and newlines stripped from subjects).
- [ ] I reviewed the rest of the [Security Review Checklist](../docs/SECURITY-REVIEW-CHECKLIST.md) (storage buckets, webhook secrets, security headers/CSP, error messages, committed metadata) and nothing in this PR violates it.
