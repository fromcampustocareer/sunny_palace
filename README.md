# From Campus to Career — Jose x Jocelyn

This is the website for **From Campus to Career**, built by us — Jose and Jocelyn, two first-gen Mexican-Americans in tech. The site gives first-gen and underrepresented students the roadmap, connections, and tools we never had: career templates, coffee chats, resume reviews, an opportunity board, and articles written from both sides of the journey.

- **Jose G. Cruz-Lopez** — still in it. Internship recruiting, cold outreach, applying with zero connections.
- **Jocelyn Vazquez** — made it. First-gen Information Systems grad working in tech and data. Compensation, negotiation, corporate life, early-career growth.

---

## How This Repo Is Organized

The project has two big parts: the **frontend** (the website people see) and the **backend** (the database and server functions on Supabase). Here's the map:

```
Jose-x-Jocelyn/
│
├── FRONTEND — the website itself
│   ├── index.html            # The single HTML page the whole app loads into
│   ├── src/                  # All the React code
│   │   ├── main.jsx          # Entry point — starts the app and loads the styles
│   │   ├── App.jsx           # The router — decides which page shows for each URL
│   │   ├── pages/            # One file per page (Home, CoffeeChat, ResumeReviews...)
│   │   │   └── articles/     # The La Voz del Día article pages
│   │   ├── components/       # Reusable pieces (layout, footer, subscribe box, etc.)
│   │   ├── styles/           # Site-wide CSS (style.css + article.css live here)
│   │   ├── translations/     # All the words on the site — en.js (English) and es.js (Spanish)
│   │   ├── hooks/            # Small helpers (useT for translations, useShare)
│   │   ├── context/          # LanguageContext — remembers if the visitor picked EN or ES
│   │   ├── data/             # Static lists (companies, opportunities)
│   │   └── lib/              # supabase.js (connects to the backend) + safeUrl.js
│   └── public/               # Images and files served exactly as-is
│       ├── images/           # Every image the site uses
│       └── pinanta/          # The piñata animation frames on the homepage
│
├── BACKEND — Supabase (database + server functions)
│   └── supabase/
│       ├── functions/        # Edge functions — small server programs
│       │   ├── add-to-waitlist/       # Saves waitlist signups from the homepage
│       │   ├── send-contact-email/    # Powers the "Get in Touch" form
│       │   ├── submit-form/           # Handles the other public form submissions
│       │   ├── send-welcome-email/    # Welcome email for new subscribers
│       │   └── coffee-chat-welcome/   # Welcome email for coffee chat signups
│       ├── migrations/       # The database history — every table and security rule,
│       │                     # in numbered order (001 → 021). Never edit old ones;
│       │                     # add a new numbered file to change the database.
│       ├── admin-queries.sql # Handy queries for checking data as an admin
│       └── config.toml       # Supabase project settings
│
├── DOCS — notes and guides
│   └── docs/
│       ├── SECURITY.md                  # How security works on this project
│       ├── SECURITY-AUDIT.md            # Full security audit report
│       ├── SECURITY-REVIEW-CHECKLIST.md # Checklist before shipping changes
│       ├── BACKUP.md                    # How backups work
│       └── superpowers/                 # Old planning docs (Spanish toggle, etc.)
│
├── CONFIG — these HAVE to stay in the root folder (the tools look for them there)
│   ├── package.json          # Project name, scripts, and the libraries we use
│   ├── vite.config.js        # Vite (the build tool) settings
│   ├── tailwind.config.js    # Our brand colors and fonts for Tailwind
│   ├── postcss.config.js     # CSS processing (Tailwind needs it)
│   ├── vercel.json           # Vercel hosting rules — redirects + security headers
│   └── .impeccable.md        # Our design system rules (colors, fonts, do's and don'ts)
│
└── archive/                  # The ORIGINAL site before we rebuilt it in React.
                              # Kept for reference only — nothing here is live.
```

**Quick "where do I go" guide:**

| I want to change... | Go to... |
|---|---|
| Words/text on a page | `src/translations/en.js` and `es.js` (change both!) |
| How a page looks or works | `src/pages/` — find the page's file |
| An image | `public/images/` |
| Site-wide styles, colors, fonts | `src/styles/` |
| Which URL shows which page | `src/App.jsx` |
| The database | Add a new numbered file in `supabase/migrations/` |
| Emails / form handling | `supabase/functions/` |

---

## Running the Site on Your Computer

You need [Node.js](https://nodejs.org) installed (version 18 or newer). Then:

**1. Install the project's libraries** (first time only, or when `package.json` changes):

```bash
npm install
```

**2. Create your environment file.** Make a file called `.env.local` in the root folder with the two Supabase keys (get them from the Supabase dashboard → Project Settings → API):

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

This file is git-ignored on purpose — keys never get committed.

**3. Start the site:**

```bash
npm run dev
```

Open `http://localhost:3000`. The page auto-refreshes as you save changes.

**Other commands:**

```bash
npm run build     # Build the real production version into dist/
npm run preview   # Preview that production build locally
```

---

## Launch Status — Waitlist Mode

The site is currently **pre-launch**. One flag controls the whole gate, at the top of `src/pages/Home.jsx`:

```js
const WAITLIST_MODE = true   // flip to false to reveal the full site
```

While `true`, the homepage only shows the hero + a waitlist signup form (it saves to Supabase through the `add-to-waitlist` function). Nav links, search, and everything below the hero stay hidden.

> **Working locally:** flip it to `false` on your machine to see the full site while you work, but **always commit it as `true`** so the live site stays gated. Stage files one by one (don't `git add .`) so the flip never sneaks into a commit.

**What's live vs. gated right now** (the source of truth is `src/App.jsx`):

| URL | Page | Status |
|---|---|---|
| `/` | Home | Live (waitlist mode) |
| `/coffee-chat` | Coffee Chat Network | Live |
| `/opportunity-board` | Opportunity Board | Live |
| `/resume-reviews` | Resume Reviews | Live |
| `/linkedin-series` | LinkedIn Series | Live |
| `/career-templates` | Career Templates | Live (only the tracker template is unlocked) |
| `/articles` + 6 articles | La Voz del Día | Pages exist, marked "Coming soon" on the homepage |
| `/privacy` | Privacy Policy | Live |
| `/bridge-year`, `/interview-prep`, `/partner-panels` | Sprints + Panels | Gated — these URLs redirect to the homepage |
| `/resume-reviews/companies`, `/resume-reviews/builder` | Resume extras | Gated — redirect to `/resume-reviews` |

To open a gated page at launch: restore its real route in `src/App.jsx` (swap the `<Navigate .../>` back to the page component) and remove its "Coming soon" markers.

---

## The Backend, Explained Simply

We don't run our own server. **Supabase** is our backend — it gives us a database, file storage (resume PDFs, profile photos), and "edge functions" (small programs that run on Supabase's servers when the site calls them).

**How the site talks to it:** `src/lib/supabase.js` creates the connection using the two keys from `.env.local`. Forms either write to the database directly or call an edge function at `https://<project>.supabase.co/functions/v1/<function-name>`.

**The main database tables:**

| Table | What it stores |
|---|---|
| `subscribers` | Newsletter signups (a `source` column tracks where each one came from) |
| `waitlist_subscribers` | Pre-launch waitlist signups from the homepage |
| `coffee_chat_profiles` / `panelists` | The Coffee Chat and Partner Panels directories |
| `opportunities` | Opportunity Board postings |
| `resumes` / `resume_submissions` | Resume Reviews (files live in Supabase storage) |
| `template_requests` / `linkedin_episode_requests` | "Request a template" and episode suggestion forms |
| `bridge_year_subscribers` / `interview_prep_requests` / `panel_suggestions` | Interest capture for gated features |

**Changing the database:** never edit the tables by hand in the dashboard and never edit an old migration file. Write a new numbered SQL file in `supabase/migrations/` (next number in line, currently up to `021`) and apply it with the Supabase CLI. The numbered files are the full history of the database — that's how we can rebuild it from scratch if we ever need to.

**Security:** the database is locked down on purpose — public visitors can only do the specific things the migrations allow (like inserting a form submission). The full story is in `docs/SECURITY.md` and `docs/SECURITY-AUDIT.md`. Read `docs/SECURITY-REVIEW-CHECKLIST.md` before shipping anything that touches forms or data.

---

## How the Site Gets Deployed

The site is hosted on **Vercel**. Every push to `main` on GitHub triggers a new deploy automatically:

1. Vercel runs `npm run build`, which builds the site into `dist/`.
2. `vercel.json` tells Vercel to send every URL to `index.html` (so React Router can handle the routing) and adds our security headers (CSP, HSTS, etc.).
3. The same two `VITE_SUPABASE_*` variables from `.env.local` must be set in the Vercel project settings — the build needs them.

The `public/_headers` and `public/_redirects` files are the same rules in Cloudflare Pages format, from when the site lived there — Vercel ignores them, and they're kept in case we ever move back.

---

## Tech Stack

- **React 18** + **React Router 6** — the app and its pages
- **Vite 5** — dev server and build tool
- **Tailwind CSS 3** — utility styles (brand colors/fonts in `tailwind.config.js`)
- **GSAP 3** — the scroll animations
- **Supabase** — database, storage, and edge functions
- **Vercel** — hosting and deploys
- **Fonts** — Clash Display + Satoshi (Fontshare), Playfair Display (Google Fonts)

Design rules — our colors, fonts, and the patterns we deliberately avoid — live in `.impeccable.md`. Both languages matter: every visible string exists in `src/translations/en.js` **and** `es.js`.

---

## License

All rights reserved. © 2026 Jose x Jocelyn.
