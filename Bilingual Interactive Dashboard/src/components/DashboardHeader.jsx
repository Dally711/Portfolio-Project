export default function DashboardHeader({ language, setLanguage, copy }) {
  // Anchor links provide quick navigation without turning the dashboard into separate pages.
  const links = [
    ['#top', copy.navHome], ['#dashboard-controls', copy.navExplore], ['#trends', copy.navTrends],
    ['#regions', copy.navRegions], ['#insights', copy.navInsights], ['#about', copy.navAbout],
  ]

  return (
    <header className="dashboard-header sticky-top">
      <div className="container-xl header-inner py-2">
        <a href="#top" className="brand-link" aria-label={copy.dashboard}>
          <img src="/images/logo-living-cost.png" alt="" className="brand-logo" />
        </a>
        <nav className="dashboard-nav" aria-label={copy.primaryNavigation}>
          <ul>{links.map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        </nav>
        <div className="language-toggle" role="group" aria-label={copy.language}>
          <button type="button" className={language === 'en' ? 'active' : ''} aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
          <span aria-hidden="true">|</span>
          <button type="button" className={language === 'fr' ? 'active' : ''} aria-pressed={language === 'fr'} onClick={() => setLanguage('fr')}>FR</button>
        </div>
      </div>
    </header>
  )
}
