import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Home from './pages/Home'

// Home loads eagerly (it's the landing page). Every other route is code-split so the
// initial bundle stays small; each page's chunk is fetched on navigation.
const CoffeeChat = lazy(() => import('./pages/CoffeeChat'))
const OpportunityBoard = lazy(() => import('./pages/OpportunityBoard'))
const ResumeReviews = lazy(() => import('./pages/ResumeReviews'))
const LinkedInSeries = lazy(() => import('./pages/LinkedInSeries'))
const CareerTemplates = lazy(() => import('./pages/CareerTemplates'))
const ArticlesIndex = lazy(() => import('./pages/articles/ArticlesIndex'))
const LateCycleInternships = lazy(() => import('./pages/articles/LateCycleInternships'))
const First90Days = lazy(() => import('./pages/articles/First90Days'))
const FirstGenPlaybook = lazy(() => import('./pages/articles/FirstGenPlaybook'))
const CoffeeChatFramework = lazy(() => import('./pages/articles/CoffeeChatFramework'))
const NegotiateSalary = lazy(() => import('./pages/articles/NegotiateSalary'))
const Rejection = lazy(() => import('./pages/articles/Rejection'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Pre-launch, these routes redirect instead of rendering, so their components are not
// imported (keeps them out of the bundle). To restore one at launch, lazy-import it here
// and swap its <Navigate> below for the real element, e.g.:
//   const InterviewPrep = lazy(() => import('./pages/InterviewPrep'))
//   <Route path="/interview-prep" element={<InterviewPrep />} />
// Gated: InterviewPrep, ResumeCompanies, ResumeBuilder, PartnerPanels, BridgeYear.

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--color-cream)' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coffee-chat" element={<CoffeeChat />} />
          <Route path="/opportunity-board" element={<OpportunityBoard />} />
          {/* Sprint not open yet — redirect direct visits home. Restore <InterviewPrep /> at launch. */}
          <Route path="/interview-prep" element={<Navigate to="/" replace />} />
          <Route path="/resume-reviews" element={<ResumeReviews />} />
          {/* Coming soon — shown as disabled "Coming soon" tabs in ResumeSubNav. Restore <ResumeCompanies /> / <ResumeBuilder /> at launch. */}
          <Route path="/resume-reviews/companies" element={<Navigate to="/resume-reviews" replace />} />
          <Route path="/resume-reviews/builder" element={<Navigate to="/resume-reviews" replace />} />
          {/* Not open yet — redirect direct visits home. Restore <PartnerPanels /> at launch. */}
          <Route path="/partner-panels" element={<Navigate to="/" replace />} />
          <Route path="/linkedin-series" element={<LinkedInSeries />} />
          <Route path="/career-templates" element={<CareerTemplates />} />
          {/* Sprint not open yet — redirect direct visits home. Restore <BridgeYear /> at launch. */}
          <Route path="/bridge-year" element={<Navigate to="/" replace />} />
          <Route path="/articles" element={<ArticlesIndex />} />
          <Route path="/articles/late-cycle-internships" element={<LateCycleInternships />} />
          <Route path="/articles/first-90-days" element={<First90Days />} />
          <Route path="/articles/first-gen-internship-playbook" element={<FirstGenPlaybook />} />
          <Route path="/articles/coffee-chat-framework" element={<CoffeeChatFramework />} />
          <Route path="/articles/negotiate-salary" element={<NegotiateSalary />} />
          <Route path="/articles/rejection" element={<Rejection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
