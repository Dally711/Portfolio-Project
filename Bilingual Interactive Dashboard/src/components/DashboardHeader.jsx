export default function DashboardHeader({ language, setLanguage, copy }) {
  return (
    <header className="dashboard-header sticky-top">
      <div className="container-xl d-flex align-items-center justify-content-between gap-3 py-2">
        <a href="#top" className="brand-link" aria-label={copy.dashboard}>
          <img src="/images/logo-living-cost.png" alt="" className="brand-logo" />
        </a>
        <span className="dashboard-label d-none d-md-inline">{copy.dashboard}</span>
        <div className="language-toggle" role="group" aria-label={copy.language}>
          <button type="button" className={language === 'en' ? 'active' : ''} aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
          <span aria-hidden="true">|</span>
          <button type="button" className={language === 'fr' ? 'active' : ''} aria-pressed={language === 'fr'} onClick={() => setLanguage('fr')}>FR</button>
        </div>
      </div>
    </header>
  )
}
