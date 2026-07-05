import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'
import { ArticleEngagement } from '../../components/ArticleEngagement'
import ArticleSubscribe from '../../components/ArticleSubscribe'
import { useT } from '../../hooks/useT'
import { useShare } from '../../hooks/useShare'

export default function First90Days() {
  const t = useT('first90Days')

  const { share, copied, copiedLabel } = useShare(t.shareTitle)

  return (
    <ArticleLayout title={t.pageTitle}>
      <header className="art-header">
        <span className="art-header__label art-header__label--jocelyn">{t.headerLabel}</span>
        <h1 className="art-header__title">{t.headerTitle}</h1>
        <p className="art-header__subtitle">{t.headerSubtitle}</p>
        <div className="art-header__meta">
          <img src="/images/jocelyn.jpeg" alt={t.authorAlt} className="art-header__avatar" />
          <div className="art-header__author-info">
            <span className="art-header__author-name">{t.authorName}</span>
            <span className="art-header__date">{t.authorDate}</span>
          </div>
        </div>
      </header>

      <ArticleEngagement
        likes={58}
        comments={22}
        share={share}
        copied={copied}
        copiedLabel={copiedLabel}
        shareBtn={t.shareBtn}
      />

      <article className="art-body">
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <p>{t.p3}</p>
        <p>{t.p4}</p>

        <h2>{t.h2Before}</h2>

        <h3>{t.h3Benefits}</h3>
        <p>{t.pBenefits}</p>
        <ul>
          {t.benefitsList.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h3>{t.h3Equity}</h3>
        <p>{t.pEquity}</p>

        <h2>{t.h2Days1}</h2>
        <p>{t.pDays1}</p>
        <ul>
          {t.days1List.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t.h2Days30}</h2>
        <p>{t.pDays30}</p>
        <ul>
          {t.days30List.map(item => <li key={item}>{item}</li>)}
        </ul>

        <blockquote>
          <p>{t.blockquote}</p>
        </blockquote>

        <h2>{t.h2Days60}</h2>
        <p>{t.pDays60}</p>

        <h3>{t.h3Comms}</h3>
        <p>{t.pComms}</p>

        <h2>{t.h2Wishes}</h2>
        <ul>
          {t.wishesList.map(item => <li key={item}>{item}</li>)}
        </ul>

        <p>{t.pClose}</p>
      </article>

      <ArticleSubscribe source="article_first_90_days" />

      <section className="art-recs">
        <h3 className="art-recs__title">{t.recsTitle}</h3>
        <div className="art-recs__grid">
          <Link to="/articles/negotiate-salary" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec1Tag}</div>
            <h4 className="art-recs__card-title">{t.rec1Title}</h4>
          </Link>
          <Link to="/articles/rejection" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec2Tag}</div>
            <h4 className="art-recs__card-title">{t.rec2Title}</h4>
          </Link>
        </div>
      </section>

    </ArticleLayout>
  )
}
