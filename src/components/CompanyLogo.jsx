import { useState } from 'react'
import { simpleIconUrl, faviconUrl } from '../data/companies'

// Renders a company logo with graceful, tiered fallback so a mark is ALWAYS
// shown and an image never appears broken:
//   1. Simple Icons brand mark (crisp) — when the company has a `slug`.
//   2. Real-logo favicon by `domain` — covers brands Simple Icons removed
//      (e.g. Microsoft, Amazon) and anything else with a website.
//   3. A letter mark — only if both image sources fail.
//
// Props:
//   company       - catalog entry { name, slug, domain, letter, color }
//   size          - px (square)
//   tint          - hex (no #) to recolor the Simple Icons mark, e.g. '8A7E72'
//   muted         - apply a grayscale wash to the favicon fallback so it blends
//                   with a tinted/monochrome context
//   className     - applied to the <img>
//   letterClassName / letterStyle - styling for the letter fallback span
export default function CompanyLogo({
  company,
  size = 24,
  tint = null,
  muted = false,
  className = '',
  letterClassName = '',
  letterStyle = {},
}) {
  // Build the ordered list of image sources available for this company.
  const sources = []
  if (company?.slug) sources.push({ type: 'icon', src: simpleIconUrl(company.slug, tint) })
  if (company?.domain) sources.push({ type: 'favicon', src: faviconUrl(company.domain, Math.max(64, size * 2)) })

  const [idx, setIdx] = useState(0)
  const current = sources[idx]

  if (!current) {
    return (
      <span
        className={letterClassName}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: size, height: size,
          fontSize: Math.round(size * 0.42), fontWeight: 800,
          ...letterStyle,
        }}
        aria-hidden="true"
      >
        {company?.letter || company?.name?.[0] || '?'}
      </span>
    )
  }

  return (
    <img
      src={current.src}
      alt={company?.name || ''}
      width={size}
      height={size}
      loading="lazy"
      className={className}
      style={{
        width: size, height: size, objectFit: 'contain',
        filter: muted && current.type === 'favicon' ? 'grayscale(1) opacity(.7)' : undefined,
      }}
      onError={() => setIdx(i => i + 1)}
    />
  )
}
