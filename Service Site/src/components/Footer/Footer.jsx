import './Footer.css'
import footerBackground from '../../assets/images/woman-having-physiotherapy-session-clinic.jpg'
import meridianLogo from '../../assets/logos/meridian-logo-white.png'

function Footer() {
  return (
    <footer
      className="footer"
      style={{ '--footer-background': `url(${footerBackground})` }}
    >
      <div className="footer-main">
        <div className="footer-brand">
          <img src={meridianLogo} alt="Meridian Health Physiotherapy" />
          <p>
            Physiotherapy care for pain relief, injury recovery, posture, and
            long-term mobility.
          </p>
        </div>

        <nav className="footer-column" aria-label="Footer navigation">
          <strong>Quick Links</strong>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#team">Team</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="footer-column">
          <strong>Info</strong>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of service</a>
          <a href="#refund">Refund policy</a>
          <a href="#shipping">Shipping policy</a>
        </div>

        <div className="footer-column footer-contact">
          <strong>Quick Contact</strong>
          <span>Address</span>
          <span>308 Negra Arroyo Lane, Albuquerque, NM</span>
          <a className="footer-phone" href="tel:+15058425662">
            (505) 842-5662
          </a>
          <a href="mailto:info@meridianhealth.ca">info@meridianhealth.ca</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Designed by Jaïme Tapa</span>
        <span>SEG 3125 Assignment 2</span>
        <span>© 2026 Meridian Health Physiotherapy</span>
      </div>
    </footer>
  )
}

export default Footer
