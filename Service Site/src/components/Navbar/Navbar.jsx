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
    <header className="navbar">
      <a className="brand" href="#home" aria-label="Meridian home">
        <img src={meridianLogoWhite} alt="Meridian Health Physiotherapy" />
      </a>
      <nav aria-label="Primary navigation">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#team">Team</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="button button-small" href="#booking">
        Book Appointment <ArrowIcon />
      </a>
    </header>
  )
}

export default Navbar
