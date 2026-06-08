import { useState } from 'react'
import './FAQ.css'

// FAQ content is stored as data so questions can be edited without changing markup.
const faqs = [
  {
    question: 'Do you accept insurance?',
    answer:
      'Yes. Meridian provides receipts you can submit to your insurance provider. Coverage depends on your individual plan.',
  },
  {
    question: 'Do I need a referral from a doctor to receive treatment?',
    answer:
      'No referral is required to book physiotherapy. Some insurance plans may ask for one before reimbursing you.',
  },
  {
    question: 'How do I know which treatment option is right for me?',
    answer:
      'Your physiotherapist will assess your symptoms, movement, goals, and history before recommending the most appropriate treatment plan.',
  },
  {
    question: 'Can I get a same-day appointment?',
    answer:
      'Same-day appointments may be available depending on the schedule. Use the booking form or call the clinic to check availability.',
  },
  {
    question: 'What should I expect during my first visit?',
    answer:
      'Your first appointment includes a detailed assessment, movement testing, a discussion of your goals, and an initial treatment plan.',
  },
  {
    question: 'Can I receive multiple types of treatment during a single visit?',
    answer:
      'Yes. Your session may include hands-on therapy, guided exercises, mobility work, and education depending on your needs.',
  },
  {
    question: 'How long is a physiotherapy session?',
    answer:
      'Most sessions are 45 to 60 minutes, depending on your treatment plan and the type of appointment selected.',
  },
  {
    question: 'What are the prices?',
    answer:
      'Prices range from $80 for posture assessments to $120 for post-surgery recovery sessions. Service cards list the current appointment pricing.',
  },
  {
    question: 'What conditions do you treat?',
    answer:
      'Meridian treats back pain, sports injuries, post-surgery recovery, posture concerns, mobility limitations, and recurring stiffness.',
  },
  {
    question: 'What types of services does Meridian Health Physiotherapy provide?',
    answer:
      'Services include back pain treatment, sports rehabilitation, post-surgery recovery, and posture assessments.',
  },
]

function FAQ() {
  // Tracks which FAQ item is currently expanded.
  const [openFaq, setOpenFaq] = useState(0)
  const middleIndex = Math.ceil(faqs.length / 2)
  const faqColumns = [faqs.slice(0, middleIndex), faqs.slice(middleIndex)]

  return (
    <section className="section faq-section" id="faq">
      <div className="center-heading">
        <p className="eyebrow">FAQ</p>
        <h2>
          Questions? We're <em>happy to help.</em>
        </h2>
      </div>
      <div className="faq-list d-grid">
        {faqColumns.map((column, columnIndex) => (
          <div className="faq-column" key={`faq-column-${columnIndex}`}>
            {/* Render FAQ items and toggle the answer for the selected question. */}
            {column.map((faq, index) => {
              const faqIndex = columnIndex * middleIndex + index
              const isOpen = openFaq === faqIndex

              return (
                <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={faq.question}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : faqIndex)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle" aria-hidden="true">
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path className="faq-toggle-horizontal" d="M6 12h12" />
                        <path className="faq-toggle-vertical" d="M12 6v12" />
                      </svg>
                    </span>
                  </button>
                  <div className="faq-answer-wrap" aria-hidden={!isOpen}>
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                </article>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ
