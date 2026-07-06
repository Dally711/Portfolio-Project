// Shared two-column form wrapper used by checkout steps.
export function FormGrid({ title, children }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="form-grid">{children}</div>
    </div>
  )
}
