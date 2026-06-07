import { Link, NavLink } from 'react-router-dom'
import meridianLogoWhite from '../../assets/logos/meridian-logo-white.png'
import './Navbar.css'

function ArrowIcon() {
  return (
    <span className="arrow-icon" aria-hidden="true">
      -&gt;
    </span>
  )
}

function Navbar() {
  return (
    <header className="navbar navbar-expand-lg">
      <Link className="brand" to="/" aria-label="Meridian home">
        <img src={meridianLogoWhite} alt="Meridian Health Physiotherapy" />
      </Link>
      <nav className="navbar-nav" aria-label="Primary navigation">
        <NavLink className="nav-link" to="/" end>Home</NavLink>
        <NavLink className="nav-link" to="/services">Services</NavLink>
        <NavLink className="nav-link" to="/team">Team</NavLink>
        <NavLink className="nav-link" to="/faq">FAQ</NavLink>
        <NavLink className="nav-link" to="/contact">Contact</NavLink>
      </nav>
      <Link className="btn button button-small" to="/booking">
        Book Appointment <ArrowIcon />
      </Link>
    </header>
  )
}

export default Navbar
