import { Link } from 'react-router-dom'
import './BookNow.css'

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

function BookNow() {
  return (
    <section className="book-now-section container-fluid text-center">
      <div className="book-now-panel mx-auto">
        <p className="eyebrow mx-auto">Ready To Start?</p>
        <h2>Book your physiotherapy appointment today.</h2>
        <p>
          Choose a treatment, pick a therapist, and reserve a time that works
          for your schedule.
        </p>
        <Link className="btn button book-now-button" to="/booking">
          Book Appointment
          <ArrowIcon />
        </Link>
      </div>
    </section>
  )
}

export default BookNow
