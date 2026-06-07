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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.329240306772!2d-75.78490894850681!3d45.34907487714223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce07bb80a666a7%3A0x985407ac7bf2ad20!2s1850%20Merivale%20Rd%2C%20Nepean%2C%20ON!5e0!3m2!1sfr!2sca!4v1780805403746!5m2!1sfr!2sca"
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
