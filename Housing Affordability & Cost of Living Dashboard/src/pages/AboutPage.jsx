import { useOutletContext } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

export default function AboutPage() {
  const { copy } = useOutletContext()

  return (
    <section className="about-section page-section route-about-page">
      <SectionHeading eyebrow={copy.aboutEyebrow} title={copy.aboutTitle} description={copy.aboutDescription} />
      <div className="about-grid">
        <InfoCard icon="✦" title={copy.officialTitle} text={copy.officialText} />
        <InfoCard icon="⌁" title={copy.localTitle} text={copy.localText} />
        <InfoCard icon="◫" title={copy.studentTitle} text={copy.studentText} />
      </div>
    </section>
  )
}

function InfoCard({ icon, title, text }) {
  return <article className="info-card"><span aria-hidden="true">{icon}</span><h3>{title}</h3><p>{text}</p></article>
}
