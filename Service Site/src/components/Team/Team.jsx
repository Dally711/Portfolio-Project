import teamImageOne from '../../assets/team/female-physiotherapist-massaging-male-patient-office.jpg'
import teamImageTwo from '../../assets/team/physiotherapy-doctor-assisting-elderly-patient-with-leg-exercise-clinic.jpg'
import teamImageThree from '../../assets/team/amara-johnson.jpg'
import './Team.css'

// Therapist profile data used to render the team cards.
const therapists = [
  {
    name: 'Dr. Sarah Wilson',
    specialty: 'Sports Injury Specialist',
    bio: 'Sarah helps active patients recover from acute injuries and rebuild strength with clear return-to-play plans.',
    image: teamImageOne,
  },
  {
    name: 'Gregory House',
    specialty: 'Back Pain and Mobility Specialist',
    bio: 'Gregory focuses on spinal mobility, persistent back pain, and practical movement strategies for daily life.',
    image: teamImageTwo,
  },
  {
    name: 'Meredith Grey',
    specialty: 'Post-Surgery Rehabilitation Specialist',
    bio: 'Meredith supports patients after orthopedic procedures with structured progressions and careful monitoring.',
    image: teamImageThree,
  },
]

function ImageFrame({ src, alt }) {
  return (
    <figure className="image-frame">
      <img className="img-fluid" src={src} alt={alt} />
    </figure>
  )
}

function Team() {
  return (
    <section className="section team-section container-fluid" id="team">
      <div className="center-heading text-center mx-auto">
        <p className="eyebrow">Meet Our Team</p>
        <h2>
          Meet your physiotherapy <em>team.</em>
        </h2>
      </div>
      <div className="team-grid d-grid">
        {/* Build one profile card for each therapist. */}
        {therapists.map((therapist) => (
          <article className="team-card h-100" key={therapist.name}>
            <ImageFrame
              src={therapist.image}
              alt={`${therapist.name}, ${therapist.specialty}`}
            />
            <div className="team-card-body">
              <h3>{therapist.name}</h3>
              <p className="specialty">{therapist.specialty}</p>
              <p>{therapist.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Team
