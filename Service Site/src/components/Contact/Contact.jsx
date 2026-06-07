import rehabSupportImage from '../../assets/images/patient-doing-physical-rehabilitation-helped-by-therapists.jpg'
import './Contact.css'

function Placeholder({ label, variant = 'image' }) {
  return (
    <div className={`placeholder placeholder-${variant}`} aria-label={label}>
      <div className="placeholder-mark" aria-hidden="true">
        <span></span>
        <span></span>
      </div>
      <p>{label}</p>
    </div>
  )
}

function ImageFrame({ src, alt }) {
  return (
    <figure className="image-frame">
      <img src={src} alt={alt} />
    </figure>
  )
}

function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="section-heading split-heading">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>
            Ready to move <em>better?</em>
          </h2>
        </div>
        <p>
          Convenient physiotherapy care in Ottawa with clear communication
          before and after every appointment.
        </p>
      </div>
      <div className="contact-layout">
        <div className="contact-card">
          <h3>Clinic Information</h3>
          <address>
            <strong>Address</strong>
            308 Negra Arroyo Lane, Ottawa, ON
          </address>
          <p>
            <strong>Phone</strong>
            <a href="tel:+16135550184">(613) 555-0184</a>
          </p>
          <p>
            <strong>Email</strong>
            <a href="mailto:info@meridianhealth.ca">
              info@meridianhealth.ca
            </a>
          </p>
          <div className="hours">
            <strong>Hours</strong>
            <span>Monday-Friday: 8:00 AM - 7:00 PM</span>
            <span>Saturday: 9:00 AM - 3:00 PM</span>
            <span>Sunday: Closed</span>
          </div>
        </div>
        <div className="contact-media">
          <Placeholder label="Replace with map image" />
          <ImageFrame
            src={rehabSupportImage}
            alt="Patient doing physical rehabilitation helped by therapists"
          />
        </div>
      </div>
    </section>
  )
}

export default Contact
