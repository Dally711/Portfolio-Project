import { useState } from 'react'
import './FAQ.css'

const faqs = [
  {
    question: 'What should I expect during my first visit?',
    answer:
      'Your first appointment includes a detailed assessment, movement testing, a discussion of your goals, and an initial treatment plan.',
  },
  {
    question: "Do I need a doctor's referral?",
    answer:
      'No referral is required to book physiotherapy. Some insurance plans may request one for reimbursement, so it is worth checking your coverage.',
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
]

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

function FAQ() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <section className="section faq-section" id="faq">
      <div className="center-heading">
        <p className="eyebrow">FAQ</p>
        <h2>
          Questions? We're <em>happy to help.</em>
        </h2>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openFaq === index
          return (
            <article className="faq-item" key={faq.question}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenFaq(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <Placeholder label="Replace with FAQ icon" variant="icon" />
                <span>{faq.question}</span>
                <span className="faq-toggle">{isOpen ? '-' : '+'}</span>
              </button>
              {isOpen && <p className="faq-answer">{faq.answer}</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default FAQ
