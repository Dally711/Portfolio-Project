import './WhoWeAre.css'
import { Link } from 'react-router-dom'
import mainClinicImage from '../../assets/images/woman-having-physiotherapy-session-clinic.jpg'

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

function WhoWeAre() {
  return (
    <section className="section who-section container-fluid">
      <div className="who-layout">
        <div className="who-media" aria-label="Meridian physiotherapy clinic">
          <figure className="who-main-image">
            <img src={mainClinicImage} alt="Physiotherapist treating a patient in clinic" />
          </figure>
        </div>

        <div className="who-copy">
          <p className="eyebrow">Who We Are</p>
          <h2>Physiotherapy care designed around you.</h2>
          <p>
            Meridian Health Physiotherapy is a modern clinic focused on helping
            patients move better, recover with confidence, and return to daily
            life with less pain. Our team combines hands-on treatment, guided
            exercise, and clear education so every visit has a purpose.
          </p>

          <div className="who-proof">
            <div className="who-years">
              <strong>8<span>+</span></strong>
              <p>Years serving our community</p>
            </div>
            <ul>
              <li>3,500+ clients helped</li>
              <li>12,000+ appointments completed</li>
              <li>4.9/5 patient satisfaction</li>
            </ul>
          </div>

          <Link className="button who-button" to="/team">
            Learn More About our Team
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default WhoWeAre
