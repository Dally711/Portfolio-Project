import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header({ language, onLanguageChange, links, copy }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" onClick={closeMenu} aria-label={copy.homeLabel}>
        <span className="wordmark-mark" aria-hidden="true">⌁</span>
        {/* Public assets are served from the site root by Vite. */}
        <img className="navbar-logo" src="/images/logo-living-cost.png" alt="" />
      </Link>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label={copy.menuLabel}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>

      <div className={`header-menu${menuOpen ? ' is-open' : ''}`} id="site-navigation">
        <nav aria-label={copy.navigation}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={closeMenu}
              className={({ isActive }) => isActive ? 'is-active' : ''}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="language-switcher" aria-label={copy.languageLabel}>
          <button type="button" className={language === 'en' ? 'is-active' : ''} aria-pressed={language === 'en'} onClick={() => { onLanguageChange('en'); closeMenu() }}>EN</button>
          <button type="button" className={language === 'fr' ? 'is-active' : ''} aria-pressed={language === 'fr'} onClick={() => { onLanguageChange('fr'); closeMenu() }}>FR</button>
        </div>
      </div>
    </header>
  )
}
