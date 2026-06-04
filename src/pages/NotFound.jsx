import { Link } from 'react-router-dom'
import ArticleLayout from '../components/ArticleLayout'
import { useLang } from '../context/LanguageContext'

// Inline copy (rather than the i18n files) keeps this fallback self-contained.
const COPY = {
  en: {
    title: 'Page not found',
    heading: "This page doesn't exist",
    body: 'The link may be broken, or the page may have moved.',
    cta: 'Back to home →',
  },
  es: {
    title: 'Página no encontrada',
    heading: 'Esta página no existe',
    body: 'Es posible que el enlace esté roto o que la página se haya movido.',
    cta: 'Volver al inicio →',
  },
}

export default function NotFound() {
  const { lang } = useLang()
  const c = COPY[lang] ?? COPY.en

  return (
    <ArticleLayout title={c.title}>
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '120px 24px 96px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(72px,14vw,128px)', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1, margin: 0 }}>404</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, color: 'var(--color-dark)', margin: '20px 0 12px' }}>{c.heading}</h1>
        <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: 32 }}>{c.body}</p>
        <Link to="/" className="art-signoff__cta">{c.cta}</Link>
      </section>
    </ArticleLayout>
  )
}
