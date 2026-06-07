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
  'Michael Chen',
  'Amara Johnson',
]

const initialBooking = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  service: services[0].name,
  therapist: therapists[0],
  date: '',
  time: '',
  isFirstAppointment: false,
  notes: '',
}

function ArrowIcon() {
  return (
    <span className="arrow-icon" aria-hidden="true">
      -&gt;
    </span>
  )
}

function ImageFrame({ src, alt }) {
  return (
    <figure className="image-frame">
      <img src={src} alt={alt} />
    </figure>
  )
}

function Appointment() {
  const [booking, setBooking] = useState(initialBooking)
  const [confirmation, setConfirmation] = useState(null)
  const selectedService = services.find(
    (service) => service.name === booking.service,
  )

  const handleBookingChange = (event) => {
    const { checked, name, type, value } = event.target
    setBooking((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setConfirmation({
      name: `${booking.firstName} ${booking.lastName}`,
      service: booking.service,
      price: selectedService.price,
      therapist: booking.therapist,
      date: booking.date,
      time: booking.time,
      isFirstAppointment: booking.isFirstAppointment,
    })
  }

  return (
    <section className="section booking-section" id="booking">
      <div className="section-heading split-heading">
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

      <div className="booking-layout">
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              First Name
              <input
                name="firstName"
                value={booking.firstName}
                onChange={handleBookingChange}
                required
                type="text"
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
              >
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
              >
                {therapists.map((therapist) => (
                  <option key={therapist}>{therapist}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="price-summary" aria-live="polite">
            <span>Selected treatment price</span>
            <strong>{selectedService.price}</strong>
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
              />
            </label>
          </div>

          <label className="checkbox-field">
            <input
              name="isFirstAppointment"
              checked={booking.isFirstAppointment}
              onChange={handleBookingChange}
              type="checkbox"
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
              placeholder="Tell us about your symptoms, goals, or access needs."
            ></textarea>
          </label>

          <button className="button form-button" type="submit">
            Submit Appointment Request <ArrowIcon />
          </button>
        </form>

        <aside className="booking-side">
          <ImageFrame
            src={rehabExerciseImage}
            alt="Patient doing rehabilitation exercises with therapist support"
          />
          {confirmation && (
            <div className="confirmation-card" role="status">
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
          )}
        </aside>
      </div>
    </section>
  )
}

export default Appointment
