import teamImageOne from '../../assets/team/female-physiotherapist-massaging-male-patient-office.jpg'
import teamImageTwo from '../../assets/team/physiotherapy-doctor-assisting-elderly-patient-with-leg-exercise-clinic.jpg'
import teamImageThree from '../../assets/team/amara-johnson.jpg'
import './Team.css'

const therapists = [
  {
    name: 'Dr. Sarah Wilson',
    specialty: 'Sports Injury Specialist',
    bio: 'Sarah helps active patients recover from acute injuries and rebuild strength with clear return-to-play plans.',
    image: teamImageOne,
  },
  {
    name: 'Michael Chen',
    specialty: 'Back Pain and Mobility Specialist',
    bio: 'Michael focuses on spinal mobility, persistent back pain, and practical movement strategies for daily life.',
    image: teamImageTwo,
  },
  {
    name: 'Amara Johnson',
    specialty: 'Post-Surgery Rehabilitation Specialist',
    bio: 'Amara supports patients after orthopedic procedures with structured progressions and careful monitoring.',
    image: teamImageThree,
  },
]

function ImageFrame({ src, alt }) {
  return (
    <figure className="image-frame">
      <img src={src} alt={alt} />
    </figure>
  )
}

function Team() {
  return (
    <section className="section team-section" id="team">
      <div className="center-heading">
        <p className="eyebrow">Meet Our Team</p>
        <h2>
          Meet your physiotherapy <em>team.</em>
        </h2>
      </div>
      <div className="team-grid">
        {therapists.map((therapist) => (
          <article className="team-card" key={therapist.name}>
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
