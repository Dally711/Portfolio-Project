import backPainImage from '../../assets/images/medium-shot-man-helping-patient-physiotherapy.jpg'
import sportsRehabImage from '../../assets/images/young-woman-doing-exercises-simulator-with-therapist-gym_1157-38324.jpg'
import postSurgeryImage from '../../assets/images/patient-doing-physical-rehabilitation-helped-by-therapists.jpg'
import postureImage from '../../assets/images/physiotherapy-concept-full-shot_23-2149047502.jpg'
import './Services.css'

// Service card content is kept in one array so prices and images are easy to edit.
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
      <div className="center-heading text-center mx-auto">
        <p className="eyebrow">Services and Pricing</p>
        <h2>
          Restoring movement, <em>relieving pain.</em>
        </h2>
      </div>
      <div className="service-showcase container-fluid px-0">
        <div className="service-list row g-4">
          {/* Build one service card for each item in the services array. */}
          {services.map((service) => (
            <article
              className={`service-card ${
                service.iconImage ? 'service-card-with-image' : ''
              } col`}
              key={service.title}
            >
              <figure className="service-icon-image">
                <img
                  className="img-fluid"
                  src={service.iconImage}
                  alt={`${service.title} service`}
                />
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
