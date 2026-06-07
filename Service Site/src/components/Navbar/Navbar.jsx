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
      <a className="brand" href="#home" aria-label="Meridian home">
        <img src={meridianLogoWhite} alt="Meridian Health Physiotherapy" />
      </a>
      <nav className="navbar-nav" aria-label="Primary navigation">
        <a className="nav-link" href="#home">Home</a>
        <a className="nav-link" href="#services">Services</a>
        <a className="nav-link" href="#team">Team</a>
        <a className="nav-link" href="#faq">FAQ</a>
        <a className="nav-link" href="#contact">Contact</a>
      </nav>
      <a className="btn button button-small" href="#booking">
        Book Appointment <ArrowIcon />
      </a>
    </header>
  )
}

export default Navbar
