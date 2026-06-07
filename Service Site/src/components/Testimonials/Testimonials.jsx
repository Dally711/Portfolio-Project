import './Testimonials.css'

const testimonials = [
  {
    name: 'Emily R.',
    quote:
      'Meridian helped me return to running after months of knee pain. The plan was clear, realistic, and easy to follow.',
  },
  {
    name: 'Daniel P.',
    quote:
      'The team explained what was causing my back pain and gave me practical exercises that actually fit my workday.',
  },
  {
    name: 'Nadia S.',
    quote:
      'After surgery, I felt supported at every stage. The appointments were professional, calm, and very organized.',
  },
]

function Testimonials() {
  return (
    <section className="section testimonials-section container-fluid" id="testimonials">
      <div className="center-heading text-center mx-auto">
        <p className="eyebrow">Testimonials</p>
        <h2>
          What our patients <em>are saying.</em>
        </h2>
      </div>
      <div className="testimonial-grid d-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card h-100" key={testimonial.name}>
            <div className="testimonial-stars" aria-label="5 out of 5 stars">
              *****
            </div>
            <blockquote>{testimonial.quote}</blockquote>
            <p>{testimonial.name}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
