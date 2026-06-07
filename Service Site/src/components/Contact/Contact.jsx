import './Contact.css'

function Contact() {
  return (
    <section className="section contact-section container-fluid" id="contact">
      <div className="section-heading split-heading d-grid">
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
      <div className="contact-layout d-grid">
        <div className="contact-card h-100">
          <h3>Clinic Information</h3>
          <address>
            <strong>Address</strong>
            308 Negra Arroyo Lane, Albuquerque, NM
          </address>
          <p>
            <strong>Phone</strong>
            <a href="tel:+15058425662">(505) 842-5662</a>
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

        {/* Embedded Google Map for the clinic location. */}
        <iframe
          className="contact-map w-100"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d816.3333143887619!2d-106.59580122394262!3d35.073405152531954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87220b0f09eb0fd9%3A0xd936842096636439!2s465%20Washington%20St%20SE%2C%20Albuquerque%2C%20NM%2087108%2C%20%C3%89tats-Unis!5e0!3m2!1sfr!2sca!4v1780859858495!5m2!1sfr!2sca"
          title="Meridian Health Physiotherapy location map"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  )
}

export default Contact
