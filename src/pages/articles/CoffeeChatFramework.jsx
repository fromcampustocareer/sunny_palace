import { Link } from 'react-router-dom'
import ArticleLayout from '../../components/ArticleLayout'
import { ArticleEngagement } from '../components/ArticleEngagement'
import ArticleSubscribe from '../../components/ArticleSubscribe'
import { useT } from '../../hooks/useT'
import { useShare } from '../../hooks/useShare'

export default function CoffeeChatFramework() {
  const t = useT('coffeeChatFramework')

  const { share, copied, copiedLabel } = useShare(t.shareTitle)

  return (
    <ArticleLayout title={t.pageTitle}>
      <header className="art-header">
        <span className="art-header__label art-header__label--jose">{t.headerLabel}</span>
        <h1 className="art-header__title">{t.headerTitle}</h1>
        <p className="art-header__subtitle">{t.headerSubtitle}</p>
        <div className="art-header__meta">
          <img src="/images/jose.jpeg" alt={t.authorAlt} className="art-header__avatar" />
          <div className="art-header__author-info">
            <span className="art-header__author-name">{t.authorName}</span>
            <span className="art-header__date">{t.authorDate}</span>
          </div>
        </div>
      </header>

      <ArticleEngagement
        likes={61}
        comments={19}
        share={share}
        copied={copied}
        copiedLabel={copiedLabel}
        shareBtn={t.shareBtn}
      />

      <article className="art-body">
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <p>{t.p3}</p>

        <h2>{t.h2Anatomy}</h2>
        <p>{t.pAnatomy}</p>
        <ol>
          {t.anatomyList.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ol>
        <p>{t.pSimple}</p>

        <h2>{t.h2Template}</h2>
        <div className="art-callout">
          <p>{t.templateLine1}</p>
          <p>{t.templateLine2}</p>
          <p>{t.templateLine3}</p>
          <p>{t.templateLine4}</p>
          <p>{t.templateLine5}</p>
        </div>

        <h3>{t.h3WhyWorks}</h3>
        <ul>
          {t.whyWorksList.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t.h2Prep}</h2>

        <h3>{t.h3Step1}</h3>
        <p>{t.pStep1}</p>

        <h3>{t.h3Step2}</h3>
        <p>{t.pStep2}</p>

        <h3>{t.h3Step3}</h3>
        <p>{t.pStep3}</p>

        <h2>{t.h2During}</h2>
        <p>{t.pDuring}</p>
        <ul>
          {t.duringList.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t.h2After}</h2>
        <p>{t.pAfter}</p>

        <blockquote>
          <p>{t.blockquote}</p>
        </blockquote>

        <h2>{t.h2Mistakes}</h2>
        <ul>
          {t.mistakesList.map(item => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <p>{t.pClose}</p>
      </article>

      <ArticleSubscribe source="article_coffee_chat_framework" />

      <section className="art-recs">
        <h3 className="art-recs__title">{t.recsTitle}</h3>
        <div className="art-recs__grid">
          <Link to="/articles/late-cycle-internships" className="art-recs__card">
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
