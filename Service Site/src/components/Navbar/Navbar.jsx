import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import meridianLogoWhite from '../../assets/logos/meridian-logo-white.png'
import './Navbar.css'

function ArrowIcon() {
  return (
    <span className="arrow-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </span>
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const goToPageStart = () => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  return (
    <header className="navbar navbar-expand-lg">
      <Link className="brand" to="/" aria-label="Meridian home" onClick={goToPageStart}>
        <img src={meridianLogoWhite} alt="Meridian Health Physiotherapy" />
      </Link>
      <button
        className="menu-toggle"
        type="button"
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav
        className={`navbar-nav ${menuOpen ? 'is-open' : ''}`}
        id="primary-navigation"
        aria-label="Primary navigation"
      >
        <NavLink className="nav-link" to="/" end onClick={goToPageStart}>Home</NavLink>
        <NavLink className="nav-link" to="/services" onClick={goToPageStart}>Services</NavLink>
        <NavLink className="nav-link" to="/team" onClick={goToPageStart}>Team</NavLink>
        <NavLink className="nav-link" to="/faq" onClick={goToPageStart}>FAQ</NavLink>
        <NavLink className="nav-link" to="/contact" onClick={goToPageStart}>Contact</NavLink>
      </nav>
      <Link className="btn button button-small" to="/booking" onClick={goToPageStart}>
        <span className="button-text">Book Appointment</span> <ArrowIcon />
      </Link>
    </header>
  )
}

export default Navbar
