import './Hero.css'
import heroImage from '../../assets/images/physiotherapist-helping-patient-her-clinic.jpg'

function ArrowIcon() {
  return (
    <span className="arrow-icon" aria-hidden="true">
      -&gt;
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
        <div className="hero-actions">
          <a className="button button-light" href="#booking">
            Book Appointment <ArrowIcon />
          </a>
          <a className="button button-outline" href="#services">
            View Services <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
