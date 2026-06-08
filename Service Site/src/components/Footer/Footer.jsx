import { Link } from 'react-router-dom'
import './Footer.css'
import footerBackground from '../../assets/images/woman-having-physiotherapy-session-clinic.jpg'
import meridianLogo from '../../assets/logos/meridian-logo-white.png'

function Footer() {
  const goToPageStart = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  return (
    <footer
      className="footer container-fluid"
      style={{ '--footer-background': `url(${footerBackground})` }}
    >
      <div className="footer-main d-grid">
        <div className="footer-brand d-grid">
          <img
            className="img-fluid"
            src={meridianLogo}
            alt="Meridian Health Physiotherapy"
          />
          <p>
            Physiotherapy care for pain relief, injury recovery, posture, and
            long-term mobility.
          </p>
        </div>

        <nav className="footer-column d-grid" aria-label="Footer navigation">
          <strong>Quick Links</strong>
          <Link to="/" onClick={goToPageStart}>Home</Link>
          <Link to="/services" onClick={goToPageStart}>Services</Link>
          <Link to="/team" onClick={goToPageStart}>Team</Link>
          <Link to="/faq" onClick={goToPageStart}>FAQ</Link>
          <Link to="/contact" onClick={goToPageStart}>Contact</Link>
        </nav>

        <div className="footer-column d-grid">
          <strong>Info</strong>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of service</a>
          <a href="#refund">Refund policy</a>
          <a href="#shipping">Shipping policy</a>
        </div>

        <div className="footer-column footer-contact d-grid">
          <strong>Quick Contact</strong>
          <span>Address</span>
          <span>308 Negra Arroyo Lane, Albuquerque, NM</span>
          <a className="footer-phone" href="tel:+15058425662">
            (505) 842-5662
          </a>
          <a href="mailto:info@meridianhealth.ca">info@meridianhealth.ca</a>
        </div>
      </div>

      <div className="footer-bottom d-flex flex-wrap justify-content-between">
        <span>Designed by Jaïme Tapa</span>
        <span>© 2026 Meridian Health Physiotherapy</span>
      </div>
    </footer>
  )
}

export default Footer
