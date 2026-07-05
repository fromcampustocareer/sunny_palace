import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'
import { ArticleEngagement } from '../components/ArticleEngagement'
import ArticleSubscribe from '../../components/ArticleSubscribe'
import { useT } from '../../hooks/useT'
import { useShare } from '../../hooks/useShare'

export default function NegotiateSalary() {
  const t = useT('negotiateSalary')

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
        likes={52}
        comments={15}
        share={share}
        copied={copied}
        copiedLabel={copiedLabel}
        shareBtn={t.shareBtn}
      />

      <article className="art-body">
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <p>{t.p3}</p>

        <h2>{t.h2Understand}</h2>
        <p>{t.pUnderstand}</p>
        <ul>
          {t.compList.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
        <p>{t.pPackage}</p>

        <h2>{t.h2Research}</h2>

        <h3>{t.h3Data}</h3>
        <p>{t.pData}</p>
        <ul>
          {t.dataList.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t.h2Convo}</h2>

        <h3>{t.h3WhenTheyOffer}</h3>
        <p>{t.pWhenTheyOffer}</p>
        <p>{t.pStalling}</p>

        <h3>{t.h3Counter}</h3>
        <p>{t.pCounter}</p>
        <div className="art-callout">
          <p>{t.calloutCounter}</p>
        </div>

        <p>{t.pPrinciples}</p>
        <ul>
          {t.principlesList.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t.h2IfNo}</h2>
        <p>{t.pIfNo1}</p>
        <p>{t.pIfNo2}</p>

        <blockquote>
          <p>{t.blockquote}</p>
        </blockquote>

        <h2>{t.h2Muscle}</h2>
        <p>{t.pMuscle1}</p>
        <p>{t.pMuscle2}</p>
      </article>

      <ArticleSubscribe source="article_negotiate_salary" />

      <section className="art-recs">
        <h3 className="art-recs__title">{t.recsTitle}</h3>
        <div className="art-recs__grid">
          <Link to="/articles/first-90-days" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec1Tag}</div>
            <h4 className="art-recs__card-title">{t.rec1Title}</h4>
          </Link>
          <Link to="/articles/first-gen-internship-playbook" className="art-recs__card">
            <div className="art-recs__card-tag">{t.rec2Tag}</div>
            <h4 className="art-recs__card-title">{t.rec2Title}</h4>
          </Link>
        </div>
      </section>

    </ArticleLayout>
  )
}
