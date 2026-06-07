import './WhyChoose.css'
import assessmentIcon from '../../assets/icons/assessment.png'
import physicalTherapyIcon from '../../assets/icons/physical-therapy.png'
import progressIcon from '../../assets/icons/progress.png'
import scheduleIcon from '../../assets/icons/schedule.png'

// Steps shown in the "How It Works" process section.
const processSteps = [
  {
    number: '01',
    icon: scheduleIcon,
    title: 'Schedule Your Visit',
    description:
      'Book online or call our team. We quickly confirm your appointment and prepare for your assessment.',
  },
  {
    number: '02',
    icon: assessmentIcon,
    title: 'Expert Assessment',
    description:
      'Your therapist reviews your symptoms, movement, goals, and daily routine to identify the best path forward.',
  },
  {
    number: '03',
    icon: physicalTherapyIcon,
    title: 'Focused Treatment',
    description:
      'We combine hands-on care, exercise therapy, and education to support steady, measurable progress.',
  },
  {
    number: '04',
    icon: progressIcon,
    title: 'Follow-Up Plan',
    description:
      'You leave with clear next steps, home exercises, and a care plan designed for long-term mobility.',
  },
]

function WhyChoose() {
  return (
    <section className="section feature-section container-fluid">
      <div className="why-process-heading text-center mx-auto">
        <p className="eyebrow">How It Works</p>
        <h2>Our working process</h2>
        <p>
          Whether you are recovering from an injury or building long-term mobility,
          Meridian keeps your physiotherapy care simple, organized, and focused
          on lasting progress.
        </p>
      </div>
      <div className="process-grid d-grid">
        {/* Each process card uses the same structure with different step content. */}
        {processSteps.map((step) => (
          <article className="process-card h-100" key={step.number}>
            <div className="process-icon" aria-hidden="true">
              <img src={step.icon} alt="" />
            </div>
            <div className="process-line" aria-hidden="true">
              <span></span>
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <strong aria-hidden="true">{step.number}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WhyChoose
