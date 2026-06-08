import ArticleLayout from '../components/ArticleLayout'

// Privacy Policy — written to reflect how the app ACTUALLY handles data
// (Supabase + RLS/column grants, Cloudflare Turnstile, Resend email). Keep this
// in sync with real practices; if data flows change, update this page.
const EFFECTIVE_DATE = 'June 8, 2026'
const CONTACT_EMAIL = 'campustocareerteam@gmail.com'

export default function PrivacyPolicy() {
  return (
    <ArticleLayout title="Privacy Policy" footerWidth={760}>
      <style>{`
        .pp { max-width: 760px; margin: 0 auto; padding: clamp(2.5rem, 6vw, 5rem) 1.4rem 4rem; color: var(--color-dark); }
        .pp__kicker { font-family: var(--font-body); font-size: .72rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: var(--color-accent); margin: 0 0 1rem; }
        .pp__title { font-family: var(--font-display); font-weight: 700; letter-spacing: -.02em; line-height: 1.02; font-size: clamp(2.4rem, 6vw, 3.6rem); margin: 0 0 .8rem; color: var(--color-navy); }
        .pp__meta { font-family: var(--font-body); font-size: .92rem; color: var(--color-muted); margin: 0 0 2.4rem; }
        .pp__lede { font-family: var(--font-serif); font-style: italic; font-size: clamp(1.1rem, 2vw, 1.32rem); line-height: 1.6; color: var(--color-muted); margin: 0 0 2.6rem; padding-bottom: 2.2rem; border-bottom: 1px solid rgba(0,0,0,.1); }
        .pp h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(1.3rem, 2.6vw, 1.7rem); letter-spacing: -.01em; color: var(--color-navy); margin: 2.8rem 0 .9rem; scroll-margin-top: 90px; }
        .pp h3 { font-family: var(--font-body); font-weight: 700; font-size: 1.02rem; color: var(--color-dark); margin: 1.6rem 0 .5rem; }
        .pp p, .pp li { font-family: var(--font-body); font-size: 1.02rem; line-height: 1.75; color: #2A2117; }
        .pp p { margin: 0 0 1rem; }
        .pp ul { margin: 0 0 1.2rem; padding-left: 1.2rem; }
        .pp li { margin: 0 0 .5rem; }
        .pp strong { color: var(--color-navy); font-weight: 700; }
        .pp a { color: var(--color-accent); text-decoration: underline; text-underline-offset: 2px; }
        .pp__toc { background: var(--color-surface); border: 1px solid rgba(0,0,0,.08); border-radius: 14px; padding: 1.4rem 1.6rem; margin: 0 0 2.4rem; }
        .pp__toc p { font-weight: 700; font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; color: var(--color-muted); margin: 0 0 .7rem; }
        .pp__toc ol { margin: 0; padding-left: 1.1rem; columns: 2; column-gap: 2rem; }
        .pp__toc li { font-size: .92rem; margin: 0 0 .35rem; }
        .pp__callout { background: rgba(58,125,107,.08); border-left: 3px solid var(--color-teal); border-radius: 0 10px 10px 0; padding: 1.1rem 1.3rem; margin: 1.4rem 0 1.6rem; }
        .pp__callout p { margin: 0; font-size: .97rem; }
        .pp__table { width: 100%; border-collapse: collapse; margin: 1rem 0 1.6rem; font-size: .92rem; }
        .pp__table th, .pp__table td { text-align: left; padding: .7rem .8rem; border-bottom: 1px solid rgba(0,0,0,.1); vertical-align: top; font-family: var(--font-body); line-height: 1.5; }
        .pp__table th { font-weight: 700; color: var(--color-navy); background: var(--color-surface); }
        .pp__note { font-size: .9rem; color: var(--color-muted); font-style: italic; }
        @media (max-width: 560px){ .pp__toc ol { columns: 1; } }
      `}</style>

      <div className="pp">
        <p className="pp__kicker">From Campus to Career</p>
        <h1 className="pp__title">Privacy Policy</h1>
        <p className="pp__meta">Effective {EFFECTIVE_DATE} · Last updated {EFFECTIVE_DATE}</p>

        <p className="pp__lede">
          Jose&nbsp;×&nbsp;Jocelyn is built for first-generation and underrepresented students. Many of you are
          trusting an online platform with your name and story for the first time — so we want to be unusually
          clear about exactly what we collect, why, who we share it with, and the concrete steps we take to keep it safe.
        </p>

        <div className="pp__toc">
          <p>Contents</p>
          <ol>
            <li><a href="#who">Who we are</a></li>
            <li><a href="#collect">What we collect</a></li>
            <li><a href="#use">How we use it</a></li>
            <li><a href="#public">What becomes public</a></li>
            <li><a href="#share">Who we share it with</a></li>
            <li><a href="#security">How we secure your data</a></li>
            <li><a href="#retention">How long we keep it</a></li>
            <li><a href="#rights">Your rights &amp; choices</a></li>
            <li><a href="#cookies">Cookies &amp; tracking</a></li>
            <li><a href="#children">Children &amp; students</a></li>
            <li><a href="#intl">Where data is stored</a></li>
            <li><a href="#changes">Changes &amp; contact</a></li>
          </ol>
        </div>

        <h2 id="who">1. Who we are</h2>
        <p>
          This policy covers the website at <strong>fromcampuscareer.com</strong> (“Jose&nbsp;×&nbsp;Jocelyn,” “we,”
          “us”), a free community resource — a coffee-chat network, opportunity board, resume library, and
          career content — run by Jose and Jocelyn. We are the controllers of the personal information described here.
          Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2 id="collect">2. Information we collect</h2>
        <p>We only collect what you choose to give us. We do <strong>not</strong> buy personal data, and we do not run
          advertising or behavioral-tracking networks. Depending on what you do on the site, this may include:</p>
        <h3>Information you give us directly</h3>
        <ul>
          <li><strong>Newsletter / waitlist signups:</strong> your name, email, and optionally your school or occupation and language preference.</li>
          <li><strong>Contact form:</strong> your name, email, and the message you send.</li>
          <li><strong>Coffee Chat Network profiles:</strong> name, email, pronouns, LinkedIn URL, role/title, location, the topics you’re open to, your capacity, an optional profile photo, and your explicit consent to be listed.</li>
          <li><strong>Resume submissions:</strong> a handle, email, role/role-type, stage, target companies, background tags, an optional story, your uploaded resume (PDF), an optional avatar, and your download/annotation preferences.</li>
          <li><strong>Opportunity Board submissions:</strong> the role, company, link, deadline, eligibility, and a contact email for the submitter.</li>
          <li><strong>Panelist applications &amp; other forms</strong> (templates, interview prep, bridge-year, LinkedIn series): the name, email, and free-text details you enter.</li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li><strong>Anti-abuse signals:</strong> when you submit a form, Cloudflare Turnstile runs a bot check that may process your IP address and basic device/browser signals to confirm you’re human. We never see a tracking profile from this.</li>
          <li><strong>Hosting logs:</strong> our hosting and database providers keep standard, short-lived server logs (e.g., IP address, timestamp) needed to operate and secure the service.</li>
          <li>We do <strong>not</strong> use Google Analytics, advertising pixels, or cross-site trackers.</li>
        </ul>

        <h2 id="use">3. How we use your information</h2>
        <ul>
          <li>To operate the features you use — list your coffee-chat profile, publish a resume or opportunity, etc.</li>
          <li>To send you the emails you asked for (a welcome email, the newsletter, a confirmation that your profile is live).</li>
          <li>To respond to your messages.</li>
          <li>To moderate submissions and keep the community safe (review queues, spam/abuse prevention).</li>
          <li>To protect the service and its users (security, fraud and abuse prevention, debugging).</li>
        </ul>
        <p>Our basis for processing is your <strong>consent</strong> and the steps necessary to provide a service you’ve
          voluntarily requested. You can withdraw consent at any time (see <a href="#rights">Your rights</a>).</p>

        <h2 id="public">4. What becomes public — and what never does</h2>
        <div className="pp__callout">
          <p><strong>Your email address is never made public.</strong> When you list a coffee-chat profile or post a resume
            or opportunity, only the non-private fields are shown publicly. Contact emails are stored privately and are
            technically blocked from public access (see Security below).</p>
        </div>
        <p>Some features are, by design, a public directory. If you submit one of the following, the listed fields become
          visible to anyone once approved/posted:</p>
        <ul>
          <li><strong>Coffee Chat profile:</strong> your name, pronouns, role/title, location, topics, LinkedIn URL, and photo become public so people can find and reach you. (You provide the LinkedIn link specifically so others can connect.)</li>
          <li><strong>Resume submission:</strong> your handle, role, stage, target companies, story, and avatar become public; your <em>email and the resume PDF itself are kept private</em> (the PDF lives in a private store and is not publicly downloadable unless you enable it).</li>
          <li><strong>Opportunity submission:</strong> the role, company, and link become public; the submitter’s email is kept private.</li>
        </ul>
        <p>Newsletter, waitlist, contact-form, and application data are <strong>not</strong> published — they’re only used as described above.</p>

        <h2 id="share">5. Who we share your information with</h2>
        <p>We don’t sell your data and we don’t share it for advertising. We use a small set of trusted service providers
          (“sub-processors”) to run the site. They process data only to provide their service to us:</p>
        <table className="pp__table">
          <thead><tr><th>Provider</th><th>What it does</th><th>Data involved</th></tr></thead>
          <tbody>
            <tr><td><strong>Supabase</strong></td><td>Database &amp; file storage (US region)</td><td>All submitted data; resume PDFs &amp; avatars</td></tr>
            <tr><td><strong>Cloudflare</strong></td><td>Website hosting/CDN &amp; Turnstile bot protection</td><td>Page requests; anti-abuse signals (IP/device)</td></tr>
            <tr><td><strong>Resend</strong></td><td>Sends our emails</td><td>Your name &amp; email, to deliver mail you requested</td></tr>
          </tbody>
        </table>
        <p className="pp__note">Our pages also load fonts (Fontshare, Google Fonts) and company logos (Simple Icons,
          Google’s favicon service); requesting those assets may expose your IP to those providers, as with any website.</p>
        <p>We may also disclose information if required by law, or to protect the rights, safety, and security of our
          users and the service.</p>

        <h2 id="security">6. How we secure your data</h2>
        <p>Security isn’t an afterthought here — the platform was built and independently hardened around protecting your
          information. Concretely:</p>
        <ul>
          <li><strong>Encryption everywhere.</strong> All traffic is served over HTTPS/TLS and enforced with HSTS; data is encrypted at rest by our database provider.</li>
          <li><strong>Strict database access controls.</strong> Every table uses Row-Level Security, and <strong>column-level permissions</strong> ensure personal fields like your <strong>email</strong> (and resume LinkedIn URL) are technically unreadable through the public interface — only non-private fields can be fetched.</li>
          <li><strong>No public write access.</strong> The public can’t write directly to our database. Every submission flows through a gated server function that verifies a human (Cloudflare Turnstile), validates input, and runs with controlled privileges.</li>
          <li><strong>Private file storage.</strong> Resume PDFs are stored in a <strong>private</strong> bucket that isn’t publicly accessible; uploads are restricted by file type and size, and only the intended formats are allowed.</li>
          <li><strong>Server-side moderation &amp; auditing.</strong> Submissions are reviewed before going live where applicable, the “published/approved” status is set on the server (never by the browser), and moderation actions are recorded in an audit log.</li>
          <li><strong>Anti-abuse &amp; rate protection.</strong> Cloudflare Turnstile guards every form to block bots, spam, and automated scraping of the service.</li>
          <li><strong>Input sanitization.</strong> User-supplied links and text are sanitized and escaped to prevent injection and cross-site-scripting attacks; only safe <code>https</code> links are honored.</li>
          <li><strong>Hardened delivery.</strong> A strict Content-Security-Policy and security headers (HSTS, X-Frame-Options, no-sniff, referrer and permissions policies) defend against clickjacking, MIME-sniffing, and other browser-level attacks.</li>
          <li><strong>Secrets stay server-side.</strong> API keys and email/webhook secrets live only in the server environment — never in the browser — and email-triggering webhooks require a shared secret.</li>
          <li><strong>Least privilege.</strong> The public uses a restricted, read-limited role; privileged operations run only inside isolated server functions.</li>
        </ul>
        <div className="pp__callout">
          <p>No system is ever 100% secure. While we take these measures seriously, we can’t guarantee absolute security —
            so please share only what you’re comfortable making part of a community directory, and let us know immediately
            if you ever spot a problem.</p>
        </div>

        <h2 id="retention">7. How long we keep your information</h2>
        <p>We keep your information only as long as it’s useful for the purpose you gave it for:</p>
        <ul>
          <li><strong>Newsletter/waitlist:</strong> until you unsubscribe or ask us to delete it.</li>
          <li><strong>Public listings</strong> (coffee chat, resume, opportunity): until you ask us to remove or update them, or we retire the feature.</li>
          <li><strong>Contact &amp; application messages:</strong> kept as long as needed to follow up, then periodically cleared.</li>
        </ul>
        <p>You can ask us to delete your data at any time, and we’ll do so promptly unless we’re required to keep it.</p>

        <h2 id="rights">8. Your rights &amp; choices</h2>
        <p>You’re in control of your information. You can ask us to:</p>
        <ul>
          <li><strong>Access</strong> a copy of the personal data we hold about you.</li>
          <li><strong>Correct</strong> anything that’s wrong or out of date.</li>
          <li><strong>Delete</strong> your data or take down a public listing.</li>
          <li><strong>Unsubscribe</strong> from emails (use the link in any email, or just ask).</li>
          <li><strong>Withdraw consent</strong> for any processing based on it.</li>
        </ul>
        <p>To exercise any of these, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address you
          signed up with, and we’ll take care of it. Depending on where you live (for example, under GDPR or the CCPA),
          you may have additional rights, including the right to lodge a complaint with your local data-protection authority.</p>

        <h2 id="cookies">9. Cookies &amp; tracking</h2>
        <p>We keep this minimal. We don’t use advertising or analytics cookies. The site stores a small preference in your
          browser’s local storage (for example, your language choice), and Cloudflare Turnstile may set functional storage
          strictly to perform its bot check. None of this is used to track you across other websites.</p>

        <h2 id="children">10. Children &amp; students</h2>
        <p>This site is intended for college students and adults navigating early careers. It is not directed to children
          under 13 (or under 16 where applicable), and we don’t knowingly collect their information. If you believe a minor
          has given us personal data, contact us and we’ll remove it.</p>

        <h2 id="intl">11. Where your data is stored</h2>
        <p>Our database and files are hosted in the United States. If you access the site from outside the U.S., your
          information will be transferred to and processed there. By using the site, you understand this transfer takes place.</p>

        <h2 id="changes">12. Changes to this policy &amp; how to reach us</h2>
        <p>We may update this policy as the site evolves; we’ll change the “Last updated” date above and, for significant
          changes, do our best to give notice. Your continued use after an update means you accept the revised policy.</p>
        <p>For any privacy question or request, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We read every message.</p>
        <p className="pp__note" style={{ marginTop: '2rem' }}>This policy is provided in good faith to explain our actual
          practices; it isn’t legal advice. If you have specific legal requirements, please consult an attorney.</p>
      </div>
    </ArticleLayout>
  )
}
