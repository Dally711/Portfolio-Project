export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`editorial-heading editorial-heading-${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
