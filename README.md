# From Campus to Career — Jose x Jocelyn

> A structured ecosystem that turns first‑gen ambition into real career outcomes.

Built by two first-generation Mexican-Americans in tech, **From Campus to Career** is a platform that gives first-gen and underrepresented students the roadmap, connections, and tools they never had access to — told by two people at different stages of the same journey.

---

## Founders

**Jose G. Cruz-Lopez** — Still in it. Covers internship recruiting, cold outreach, application strategy, and breaking into tech from zero connections.

**Jocelyn Vazquez** — Made it. First-gen Information Systems grad now working in tech and data. Covers compensation, negotiation, corporate culture, onboarding, and early-career growth.

---

## Platform

### Pages

> **Pre-launch note:** the site currently runs in **waitlist mode** (see [Launch Status](#launch-status)). Several surfaces are intentionally gated as "Coming soon" until launch. The "Status" column below reflects that gating.

| Route | Page | Status |
|---|---|---|
| `/` | Home | Live · **waitlist mode** gates the full site pre-launch |
| `/linkedin-series` | LinkedIn Series | Live · single live drop + published posts (episode browser hidden) |
| `/career-templates` | Career Templates | Live · pre-launch — only the tracker is live, rest "Coming soon" |
| `/coffee-chat` | Coffee Chat Network | Live |
| `/resume-reviews` | Resume Reviews | Live |
| `/resume-reviews/companies` | Resume Companies Directory | Live |
| `/resume-reviews/builder` | AI Resume Builder | Live |
| `/bridge-year` | Bridge Year Sprint | 🔒 **Coming soon** — route redirects to `/` |
| `/interview-prep` | Interview Prep Sprint | 🔒 **Coming soon** — route redirects to `/` |
| `/opportunity-board` | Opportunity Board | Live |
| `/partner-panels` | Partner Panels | Live |
| `/articles` + `/articles/*` | La Voz del Día (index + 6 articles) | 🔒 **Coming soon** — cards show a "Coming soon" badge; CTA collects newsletter signups |

### The Four Pillars

**Content** — Split-screen LinkedIn series and plug-and-play career templates. Real talk from both sides, without the fluff.

**Sprints** — Small-cohort programs built around a single career milestone. Bridge Year Sprint and Interview Prep keep you accountable and moving forward.

**Community** — Curated opportunity board, partner panels, coffee chat networks, and resume review circles. Real connections, not just a group chat.

**La Voz del Día** — Articles on recruiting, internships, full-time offers, and first-gen survival. Written by both of us from both sides of the bridge.

---

## Launch Status

The site is in a **pre-launch / waitlist phase**. Two mechanisms control what visitors can reach.

### 1. Waitlist mode (whole-site gate)

A single flag in **`src/pages/Home.jsx`** controls it:

```js
// Pre-launch waitlist mode: hides nav links, search, and every section after the
// hero, and replaces the Get in Touch CTA with a Waitlist button.
const WAITLIST_MODE = true   // flip to false to reveal the full public site
```

When `true`, the homepage renders **only the hero + a waitlist signup**; the nav links, command-palette search, and every section below the hero are hidden. The waitlist form posts to the `add-to-waitlist` Supabase edge function.

> **Working locally:** flip `WAITLIST_MODE` to `false` in your working copy to develop against the full site, but **keep `true` committed** so production stays gated. Stage files explicitly (don't `git add .`) so the local override never lands in a commit.

### 2. "Coming soon" gating (per-feature)

Even with the full site revealed, individual features that aren't ready yet are closed off:

| Feature | Gating |
|---|---|
| **La Voz del Día** articles | Cards show a muted "Coming soon" badge and don't link; the "View All Articles" CTA opens a **newsletter-signup modal** (saves to the `subscribers` table, `source: 'home-la-voz'`) so people get notified when articles drop. |
| **Career Templates** | All templates show a "Coming soon" CTA **except** the live Internship Application Tracker (#01), which links to the real "Career Chisme Sheet" Google Sheet. Two networking templates (Personal Pitch, LinkedIn Outreach) are available via a copy-picker. Live links live in a `TEMPLATE_LINKS` map; `ROW_COLORS` drives per-row card color. |
| **Sprints** (Bridge Year, Interview Prep) | Closed off in **all four entry points**: the Services "Sprints" tab buttons, the nav Services dropdown, and the command-palette search (`comingSoon: true` flag → disabled result, never navigates). The `/bridge-year` and `/interview-prep` **routes redirect to `/`** (`<Navigate to="/" replace />` in `src/App.jsx`) so direct URLs can't reach them either. |

To re-open a gated feature at launch: flip `WAITLIST_MODE`, remove the relevant "Coming soon" markers, and restore the two sprint routes to render `<BridgeYear />` / `<InterviewPrep />`.

---

## Design System

The platform follows a deliberate brand identity captured in `.impeccable.md` at project root. Four pages have been brought up to flagship quality (40/40 on the internal critique scoring rubric).

### Brand Identity

- **Personality**: Real. Warm. Grounded.
- **Palette**: Mexican earthenware — terracotta (`--color-accent`), gold (`--color-gold` / `--color-gold-dark`), cream (`--color-cream`), navy (`--color-navy`), teal (`--color-teal`)
- **Banned anti-pattern**: white-card backgrounds with thin borders + colored top stripes (the "LinkedIn Learning" SaaS template look). Replaced site-wide with **tinted surface blocks**.
- **Anti-references**: bootcamp landing pages, nonprofit charity aesthetic, Instagram Canva-slide career influencers.
- **Emotional goal**: "I finally found people who are two steps ahead of me and actually want me to catch up."

### Typography

| Token | Family | Use |
|---|---|---|
| `--font-display` | **Clash Display** | Headlines, titles, kickers |
| `--font-body` | **Satoshi** | Body copy, inputs, paragraphs |
| `--font-serif` | **Playfair Display** (italic) | Editorial em accents |

Defined in `article.css` `:root` block. Loaded via Fontshare (Clash + Satoshi) and Google Fonts (Playfair).

### Component Patterns

The four upgraded pages share a consistent vocabulary:

- **Hero**: 1240px container, terracotta accent rule before kicker, kicker at 800 weight + .2em tracking with trailing rule line, italic Playfair em accent on the title's `<em>`, subtle warm radial gradient blob for ambience
- **Filter pills**: 999px radius, cream surface (`rgba(255,255,255,.55)`), warm-tinted border, active state with dark-fill + inset highlight, terracotta focus ring at 3px offset
- **Cards**: cream-tinted gradient surfaces (no white-card pattern), 14-16px radius, warm diffusion shadow (tinted to background hue), 3-col → 2-col → 1-col responsive grid with CSS-only stagger entrance
- **Forms**: 2-column intro+form layout, inline per-field error captions with leading dot, ARIA `aria-invalid` + `aria-describedby` wiring, soft character counter (hidden < 500 chars), retry-able error card on submit failure, class-based success state with SVG check icon
- **Modals**: solid cream surface with deep diffusion shadow, dimmed `.7` alpha overlay with 8px backdrop-blur, focus trap + ESC + click-outside close, body scroll lock while open
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` block disables transforms, transitions, and animations on every interactive element

### Internationalization

All page copy lives in `src/translations/en.js` and `src/translations/es.js`. The four upgraded pages have full EN + ES translations including form perks, error messages, retry buttons, and modal labels.

---

## Recent Upgrades (Q2 2026)

### Launch Prep (May 2026)

Pre-launch pass to gate unfinished features and start collecting interest. See [Launch Status](#launch-status) for how the gating works.

- **Homepage gallery** — replaced the placeholder carousel (collage + colored icon cards) with **6 branded "From Campus to Career" graphics** (launch calendar, learn-the-rules, rejection, degree, millennial-vs-gen-z, rejection-is-redirection); each card has `role="img"` + alt text.
- **La Voz del Día** — all 6 article cards marked **"Coming soon"** (non-clickable badge); "View All Articles" replaced by a **newsletter-signup modal** that writes to `subscribers` (`source: 'home-la-voz'`) with full loading / error / success states and a focus trap.
- **Career Templates** —
  - All templates gated to **"Coming soon"** except the live Internship Application Tracker (#01 → real Google Sheet).
  - **Two new available templates** (Personal Pitch / Networking Intro, LinkedIn Outreach) added at #02–#03, authored with real fill-in-the-blank scripts.
  - **Copy-picker modal**: multi-option templates store labeled `variants`; clicking "Copy Template" opens a picker so users copy just the version they want (each with its own copy button + "Copied!" feedback). The preview modal is variant-aware.
  - **Per-row color scheme**: card color is assigned by grid row (`ROW_COLORS`, every 3 cards) instead of per-category, so each row is one uniform color; the category legend was removed.
- **Sprints** — Bridge Year Sprint and Interview Prep closed off as **"Coming soon"** across the Sprints tab, the nav Services dropdown, and command-palette search; their routes (`/bridge-year`, `/interview-prep`) now redirect to `/`.
- **Performance / correctness** — `preconnect` hints for the font origins (faster LCP); React `key` warnings fixed; nav hide-on-scroll moved from a raw scroll listener to GSAP `ScrollTrigger`; dead footer links removed.

### Resume Reviews — `/resume-reviews`

- White-card + colored-top-stripe banned pattern eliminated → tinted surface blocks per stage (intern blue / new-grad terracotta / fulltime navy / apprenticeship gold / pivot / contract muted)
- Fake content lines (skeleton bars) replaced with real story preview
- Skeleton loader cards while Supabase fetches
- Hero distillation with terracotta accent rule + italic gold serif on title
- Featured cards wear a gold "wax-seal" treatment
- Asymmetric layout: sidebar filters + sticky meta panel

### Coffee Chat — `/coffee-chat`

- 8 instances of the white-card anti-pattern eliminated (cards, form, search, 4 filter selects, multi-select trigger, photo button, placeholder)
- 9-row card collapsed into 3-tier hierarchy: identity row → topic block (italic gold serif headline) → tags + meta footer
- Filter row promoted to terracotta-active pill chips
- Modal template box redesigned as printed-letter card
- 6-card skeleton loader matching new card layout

### LinkedIn Series — `/linkedin-series`

- Layout redesigned: 1240px container, asymmetric hero, 2-column episodes (sticky meta panel + posts grid)
- Multi-axis filter (lens × topic) with axis-grouping vertical rule and `aria-pressed`
- Episode TOC chips for jumping between episodes; auto-grey when filtered out
- Filter result count with `aria-live="polite"` for screen readers
- "Coming Soon" status pill scoped to episode 01 only (was carpet-bombing 30+ posts)
- Posts grid locked to 3-col / 2-col / 1-col responsive
- CTA bridge between episodes and form for conversion path
- Stats trust band: 3 cells (was 4) with terracotta tick lead on the cadence stat
- 2-column form intro+form layout with check-icon perks list
- Per-field validation + retry-able error card + soft char counter + email blur validation
- 40 fake-em-dashes (`" - "` parenthetical breaks) swept from EN+ES copy
- `--font-serif` token defined globally so italic em accents render in Playfair

### Career Templates — `/career-templates`

- White-card + 3px-colored-top-stripe anti-pattern eliminated → per-stage cream-tinted gradient surfaces
- Filter pills + stage badges + author badges promoted to 999px radius
- Card CTAs become per-stage tinted hover halos
- Card num color drift fixed: pure black → warm gold tint
- Form section bg navy → teal so it doesn't blur into the navy signoff
- Form chrome contrast bumped for the new teal background (label .5 → .85, dark-tinted input bg)
- **Preview button + modal** added per card: eye icon launches a dialog with the template body in a printed-letter card; one-click copy-to-clipboard with confirmation
- Form perks list with 3 entries (every request read · you'll know first · email stays private)
- 10 fake-em-dashes swept from EN+ES copy
- Duplicate page-level footer removed (ArticleLayout provides one)

---

## Architecture

```
src/
├── pages/                    # Route components (one file per route)
│   ├── Home.jsx
│   ├── LinkedInSeries.jsx
│   ├── CareerTemplates.jsx
│   ├── CoffeeChat.jsx
│   ├── ResumeReviews.jsx
│   ├── ResumeBuilder.jsx
│   ├── ResumeCompanies.jsx
│   ├── BridgeYear.jsx
│   ├── InterviewPrep.jsx
│   ├── OpportunityBoard.jsx
│   ├── PartnerPanels.jsx
│   └── articles/             # Long-form article pages
├── components/
│   ├── ArticleLayout.jsx     # Shared layout: nav + sign-off + footer
│   ├── ResumeSubNav.jsx      # Resume section sub-navigation
│   └── ArticleSubscribe.jsx
├── translations/
│   ├── en.js                 # English copy (all namespaces)
│   ├── es.js                 # Spanish copy (all namespaces)
│   └── ...
├── hooks/
│   └── useT.js               # Translation hook — reads namespace from EN/ES
├── lib/
│   ├── supabase.js           # Supabase client
│   └── gemini.js             # Gemini Flash REST client (resume builder AI chat)
└── main.jsx                  # Root + router
```

### Styling Approach

- **Page-level CSS** lives in `<style>{`...`}</style>` blocks inside each page component (CSS-in-JS via template literals). Lets pages own their styling without a CSS module per route.
- **Shared brand styles** in `article.css` and `style.css` at project root.
- **Tailwind 3** loaded via `src/index.css` for utility classes when needed.
- **Design tokens** (`--font-display`, `--color-cream`, etc.) defined in `article.css` `:root`.

---

## Tech Stack

- **React 18** + **React Router v6**
- **Vite 5** — dev server and build tooling
- **Tailwind CSS 3** + **PostCSS**
- **GSAP 3** + **ScrollTrigger** — scroll-driven animations on long-form articles
- **Supabase** — backend, auth, database, storage (resume PDFs, profile avatars)
- **Gemini Flash** (Google AI Studio) — default LLM for resume-builder chat
- **Fontshare** — Clash Display + Satoshi
- **Google Fonts** — Playfair Display (italic editorial accents)

---

## Local Development

```bash
npm install
npm run dev
```

Runs at `http://localhost:3000`.

```bash
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

### Environment

Create `.env.local` with:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key   # for /resume-reviews/builder
```

The Vite dev server is fixed to **port 3000** with `awaitWriteFinish` watcher tuning (see `vite.config.js`) to avoid HMR white-screens from atomic IDE saves.

### Backend (Supabase)

The frontend talks to Supabase directly (anon key) plus two edge functions. Tables referenced in code:

| Table | Used by |
|---|---|
| `subscribers` | Newsletter signup (La Voz CTA, article pages) — `source` column segments the audience (`home-la-voz`, `article`, …) |
| `template_requests` | Career Templates "request a template" form |
| `linkedin_episode_requests` | LinkedIn Series suggestion form |
| `coffee_chat_profiles` / `panelists` | Coffee Chat / Partner Panels directories |
| `opportunities` | Opportunity Board |
| `resumes` / `resume_submissions` / `avatars` | Resume Reviews + Builder (storage-backed) |
| `bridge_year_subscribers` / `bridge_year_suggestions` / `interview_prep_requests` / `panel_suggestions` | Sprint + panel capture forms |

**Edge functions** (`${VITE_SUPABASE_URL}/functions/v1/…`): `add-to-waitlist` (homepage waitlist), `send-contact-email` (Get in Touch modal).

### Deployment

Deployed on **Cloudflare Pages** (build `npm run build` → `dist/`). SPA routing is handled by `public/_redirects` (`/* /index.html 200`) so client-side routes resolve on direct hits. Set the same `VITE_*` env vars in the Pages project settings.

---

## Quality

- ✅ **A11y**: ARIA on all interactive elements (`aria-pressed` on filter chips, `aria-modal` on dialogs, `aria-invalid` + `aria-describedby` on form fields, `aria-live` on result counts and error captions)
- ✅ **Reduced motion**: every page respects `prefers-reduced-motion: reduce` (transforms, transitions, and stagger animations all disable)
- ✅ **Responsive**: 3-col → 2-col → 1-col grids; hero collapses below 768px; form layouts collapse below 860px
- ✅ **i18n**: full EN + ES coverage for all upgraded pages
- ✅ **No AI-slop tells**: white-card patterns, em dashes, fake-em-dashes (` - ` parentheticals), generic SaaS chrome, and emoji glyphs systematically removed from upgraded pages

---

## License

All rights reserved. © 2026 Jose x Jocelyn.
