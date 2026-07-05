import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'
import { ArticleEngagement } from '../components/ArticleEngagement'
import ArticleSubscribe from '../../components/ArticleSubscribe'
import { useT } from '../../hooks/useT'
import { useShare } from '../../hooks/useShare'

export default function Rejection() {
  const t = useT('rejection')

  const { share, copied, copiedLabel } = useShare(t.shareTitle)

  return (
    <ArticleLayout title={t.pageTitle}>
      <header className="art-header">
        <span className="art-header__label art-header__label--both">{t.headerLabel}</span>
        <h1 className="art-header__title">{t.headerTitle}</h1>
        <p className="art-header__subtitle">{t.headerSubtitle}</p>
        <div className="art-header__meta art-header__meta--both">
          <div className="art-header__avatars" role="group" aria-label={t.authorsAriaLabel}>
            <img src="/images/jose.jpeg" alt="" className="art-header__avatar art-header__avatar--stack" width="44" height="44" decoding="async" />
            <img src="/images/jocelyn.jpeg" alt="" className="art-header__avatar art-header__avatar--stack" width="44" height="44" decoding="async" />
          </div>
          <div className="art-header__author-info">
            <span className="art-header__author-name">{t.authorName}</span>
            <span className="art-header__date">{t.authorDate}</span>
          </div>
        </div>
      </header>

      <ArticleEngagement
        likes={63}
        comments={18}
        share={share}
        copied={copied}
        copiedLabel={copiedLabel}
        shareBtn={t.shareBtn}
      />

      <article className="art-body">
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <p>{t.p3}</p>

        <h2>{t.h2Jose}</h2>
        <p>{t.p4}</p>
        <p>{t.p5}</p>
        <p>{t.p6}</p>

        <h2>{t.h2Jocelyn}</h2>
        <p>{t.p7}</p>
        <p>{t.p8}</p>
        <p>{t.p9}</p>

        <h2>{t.h2Meaning}</h2>
        <p>{t.pNeverMeans}</p>
        <ul>
          {t.neverList.map(item => <li key={item}>{item}</li>)}
        </ul>

        <p>{t.pUsuallyMeans}</p>
        <ul>
          {t.usuallyList.map(item => <li key={item}>{item}</li>)}
        </ul>
        <p>{t.pControl}</p>

        <h2>{t.h2Process}</h2>

        <h3>{t.h3Feel}</h3>
        <p>{t.pFeel}</p>

        <h3>{t.h3Window}</h3>
        <p>{t.pWindow}</p>

        <h3>{t.h3Debrief}</h3>
        <p>{t.pDebrief}</p>
        <ul>
          {t.debriefList.map(item => <li key={item}>{item}</li>)}
        </ul>
        <p>{t.pNotebook}</p>

        <h3>{t.h3Talk}</h3>
        <p>{t.pTalk}</p>

        <blockquote>
          <p>{t.blockquote}</p>
        </blockquote>

        <h2>{t.h2Numbers}</h2>
        <p>{t.pNumbers1}</p>
        <p>{t.pNumbers2}</p>
        <p>{t.pNumbers3}</p>
      </article>

      <ArticleSubscribe source="article_rejection" />

      <section className="art-recs">
        <h3 className="art-recs__title">{t.recsTitle}</h3>
        <div className="art-recs__grid">
          <Link to="/articles/coffee-chat-framework" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec1Tag}</div>
            <h4 className="art-recs__card-title">{t.rec1Title}</h4>
          </Link>
          <Link to="/articles/negotiate-salary" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec2Tag}</div>
            <h4 className="art-recs__card-title">{t.rec2Title}</h4>
          </Link>
        </div>
      </section>

    </ArticleLayout>
  )
}
