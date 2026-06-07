import { Link } from 'react-router-dom'
import './Hero.css'
import heroImage from '../../assets/images/physiotherapist-helping-patient-her-clinic.jpg'

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

function Hero() {
  return (
    <section
      className="hero-section"
      id="home"
      style={{ '--hero-image': `url(${heroImage})` }}
    >
      <div className="hero-copy">
        <h1>
          Move Better. <span>Feel Better.</span> Live Better.
        </h1>
        <p className="hero-subtitle">
          Professional physiotherapy care for pain relief, injury recovery, and
          long-term mobility.
        </p>
        <div className="hero-actions d-flex flex-wrap justify-content-center">
          <Link className="btn button button-light" to="/booking">
            Book Appointment <ArrowIcon />
          </Link>
          <Link className="btn button button-outline" to="/services">
            View Services <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
