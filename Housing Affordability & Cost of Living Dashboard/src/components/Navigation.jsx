export default function Navigation({ sections, activeSection, onSelect, label }) {
  return (
    <nav className="dashboard-navigation" aria-label={label}>
      {sections.map((section) => (
        <button
          type="button"
          key={section.id}
          className={activeSection === section.id ? 'is-active' : ''}
          aria-current={activeSection === section.id ? 'page' : undefined}
          onClick={() => onSelect(section.id)}
        >
          <span aria-hidden="true">{section.icon}</span>
          {section.label}
        </button>
      ))}
    </nav>
  )
}
