import { useState } from 'react'
import rehabExerciseImage from '../../assets/images/woman-having-physiotherapy-session.jpg'
import './Appointment.css'

const services = [
  {
    name: 'Back Pain Treatment',
    price: '$95 / session',
  },
  {
    name: 'Sports Rehabilitation',
    price: '$110 / session',
  },
  {
    name: 'Post-Surgery Recovery',
    price: '$120 / session',
  },
  {
    name: 'Posture Assessment',
    price: '$80 / assessment',
  },
]

const therapists = [
  'Dr. Sarah Wilson',
  'Gregory House',
  'Meredith Grey',
]

// Keeps every form input controlled by React state.
const initialBooking = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  service: '',
  therapist: '',
  date: '',
  time: '',
  isFirstAppointment: false,
  notes: '',
}

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

function ImageFrame({ src, alt }) {
  return (
    <figure className="image-frame">
      <img className="img-fluid" src={src} alt={alt} />
    </figure>
  )
}

function Appointment() {
  const [booking, setBooking] = useState(initialBooking)
  const [confirmation, setConfirmation] = useState(null)

  // Finds the price that matches the selected service so it updates live.
  const selectedService = services.find(
    (service) => service.name === booking.service,
  )

  // Handles text inputs, selects, textareas, and the checkbox from one function.
  const handleBookingChange = (event) => {
    const { checked, name, type, value } = event.target
    setBooking((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Prevents a real form submission and shows a confirmation summary instead.
  const handleSubmit = (event) => {
    event.preventDefault()
    setConfirmation({
      name: `${booking.firstName} ${booking.lastName}`,
      service: booking.service,
      price: selectedService?.price ?? 'Not selected',
      therapist: booking.therapist,
      date: booking.date,
      time: booking.time,
      isFirstAppointment: booking.isFirstAppointment,
    })
  }

  return (
    <section className="section booking-section container-fluid" id="booking">
      <div className="section-heading split-heading d-grid">
        <div>
          <p className="eyebrow">Book Appointment</p>
          <h2>
            Start your recovery <em>journey today.</em>
          </h2>
        </div>
        <p>
          Submit your preferred appointment details and Meridian will confirm
          availability.
        </p>
      </div>

      <div className="booking-layout d-grid">
        <form className="booking-form d-grid" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              First Name
              <input
                name="firstName"
                value={booking.firstName}
                onChange={handleBookingChange}
                required
                type="text"
                className="form-control"
                autoComplete="given-name"
              />
            </label>
            <label>
              Last Name
              <input
                name="lastName"
                value={booking.lastName}
                onChange={handleBookingChange}
                required
                type="text"
                className="form-control"
                autoComplete="family-name"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Email
              <input
                name="email"
                value={booking.email}
                onChange={handleBookingChange}
                required
                type="email"
                className="form-control"
                autoComplete="email"
              />
            </label>
            <label>
              Phone Number
              <input
                name="phone"
                value={booking.phone}
                onChange={handleBookingChange}
                required
                type="tel"
                className="form-control"
                autoComplete="tel"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Service Selection
              <select
                name="service"
                value={booking.service}
                onChange={handleBookingChange}
                required
                className="form-select"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.name}>{service.name}</option>
                ))}
              </select>
            </label>
            <label>
              Therapist Selection
              <select
                name="therapist"
                value={booking.therapist}
                onChange={handleBookingChange}
                required
                className="form-select"
              >
                <option value="">Select a therapist</option>
                {therapists.map((therapist) => (
                  <option key={therapist}>{therapist}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Shows the current treatment price before the user submits. */}
          <div className="price-summary d-flex" aria-live="polite">
            <span>Selected treatment price</span>
            <strong>{selectedService ? selectedService.price : 'Select a service'}</strong>
          </div>

          <div className="form-row">
            <label>
              Date
              <input
                name="date"
                value={booking.date}
                onChange={handleBookingChange}
                required
                type="date"
                className="form-control"
              />
            </label>
            <label>
              Time
              <input
                name="time"
                value={booking.time}
                onChange={handleBookingChange}
                required
                type="time"
                className="form-control"
              />
            </label>
          </div>

          <label className="checkbox-field">
            <input
              name="isFirstAppointment"
              checked={booking.isFirstAppointment}
              onChange={handleBookingChange}
              type="checkbox"
              className="form-check-input"
            />
            <span>This is my first appointment at Meridian.</span>
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={booking.notes}
              onChange={handleBookingChange}
              rows="5"
              className="form-control"
              placeholder="Tell us about your symptoms, goals, or access needs."
            ></textarea>
          </label>

          <button className="btn button form-button" type="submit">
            Submit Appointment Request <ArrowIcon />
          </button>
        </form>

        {/* Side panel keeps the support image and the generated booking summary. */}
        <aside className="booking-side d-grid">
          <ImageFrame
            src={rehabExerciseImage}
            alt="Patient doing rehabilitation exercises with therapist support"
          />
          {confirmation && (
            <>
              <p className="text-success booking-success" role="status">
                Success! Your appointment request has been submitted. Meridian
                Health Physiotherapy will contact you to confirm the booking.
              </p>
              <div className="confirmation-card">
                <p className="eyebrow">Appointment Request Received</p>
                <h3>Thank you, {confirmation.name}.</h3>
                <dl>
                  <div>
                    <dt>Service</dt>
                    <dd>{confirmation.service}</dd>
                  </div>
                  <div>
                    <dt>Price</dt>
                    <dd>{confirmation.price}</dd>
                  </div>
                  <div>
                    <dt>Therapist</dt>
                    <dd>{confirmation.therapist}</dd>
                  </div>
                  <div>
                    <dt>First Visit</dt>
                    <dd>{confirmation.isFirstAppointment ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{confirmation.date}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>{confirmation.time}</dd>
                  </div>
                </dl>
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}

export default Appointment
