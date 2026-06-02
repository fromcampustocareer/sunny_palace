import { NavLink } from 'react-router-dom'
import { useT } from '../hooks/useT'

export default function ResumeSubNav() {
  const t = useT('resumeSubnav')
  // Companies + Builder are planned features. They're shown as disabled
  // "Coming soon" tabs (no link) until they're built.
  const tabs = [
    { to: '/resume-reviews', label: t.explore, end: true },
    { label: t.companies, soon: true },
    { label: t.builder, soon: true },
  ]

  return (
    <nav className="rsn" aria-label={t.ariaLabel}>
      <style>{`
        .rsn {
          max-width: 1240px;
          margin: 0 auto;
          /* Clear the fixed top nav (~60px) so the sub-nav isn't hidden under it */
          padding: 80px clamp(20px, 5vw, 56px) 0;
          display: flex;
          gap: 4px;
          border-bottom: 1px solid rgba(0,0,0,.08);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .rsn::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) { .rsn { padding-top: 64px; } }
        .rsn__tab {
          position: relative;
          padding: 10px 14px 14px;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-muted);
          text-decoration: none;
          white-space: nowrap;
          transition: color .18s;
        }
        .rsn__tab:hover { color: var(--color-dark); }
        .rsn__tab--active { color: var(--color-accent); }
        .rsn__tab--active::after {
          content: '';
          position: absolute;
          left: 14px; right: 14px; bottom: -1px;
          height: 2px;
          background: var(--color-accent);
          border-radius: 2px 2px 0 0;
        }
        .rsn__tab--soon {
          color: var(--color-muted);
          opacity: .55;
          cursor: default;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .rsn__tab--soon:hover { color: var(--color-muted); }
        .rsn__soon-badge {
          font-family: var(--font-display);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--color-accent);
          background: rgba(179,69,57,.1);
          padding: 2px 6px;
          border-radius: 999px;
          white-space: nowrap;
        }
      `}</style>
      {tabs.map(tab => (
        tab.soon ? (
          <span
            key={tab.label}
            className="rsn__tab rsn__tab--soon"
            aria-disabled="true"
            title={t.soon}
          >
            {tab.label}
            <span className="rsn__soon-badge">{t.soon}</span>
          </span>
        ) : (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) => `rsn__tab${isActive ? ' rsn__tab--active' : ''}`}
          >
            {tab.label}
          </NavLink>
        )
      ))}
    </nav>
  )
}
