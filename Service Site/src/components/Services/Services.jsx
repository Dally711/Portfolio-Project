import backPainImage from '../../assets/images/medium-shot-man-helping-patient-physiotherapy.jpg'
import sportsRehabImage from '../../assets/images/young-woman-doing-exercises-simulator-with-therapist-gym_1157-38324.jpg'
import postSurgeryImage from '../../assets/images/patient-doing-physical-rehabilitation-helped-by-therapists.jpg'
import postureImage from '../../assets/images/physiotherapy-concept-full-shot_23-2149047502.jpg'
import './Services.css'

const services = [
  {
    title: 'Back Pain Treatment',
    description:
      'Hands-on treatment and guided strengthening to reduce pain, stiffness, and recurring flare-ups.',
    price: '$95 / session',
    iconImage: backPainImage,
  },
  {
    title: 'Sports Rehabilitation',
    description:
      'Recovery plans for sprains, strains, and performance injuries so you can return with confidence.',
    price: '$110 / session',
    iconImage: sportsRehabImage,
  },
  {
    title: 'Post-Surgery Recovery',
    description:
      'Progressive mobility and strength programs aligned with your surgical recovery timeline.',
    price: '$120 / session',
    iconImage: postSurgeryImage,
  },
  {
    title: 'Posture Assessment',
    description:
      'Movement screening, ergonomic advice, and exercise plans for better everyday alignment.',
    price: '$80 / assessment',
    iconImage: postureImage,
  },
]

function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="center-heading">
        <p className="eyebrow">Services and Pricing</p>
        <h2>
          Restoring movement, <em>relieving pain.</em>
        </h2>
      </div>
      <div className="service-showcase">
        <div className="service-list">
          {services.map((service) => (
            <article
              className={`service-card ${
                service.iconImage ? 'service-card-with-image' : ''
              }`}
              key={service.title}
            >
              <figure className="service-icon-image">
                <img src={service.iconImage} alt={`${service.title} service`} />
              </figure>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <strong>{service.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
