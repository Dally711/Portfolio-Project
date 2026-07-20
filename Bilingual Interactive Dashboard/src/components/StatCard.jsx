export default function StatCard({ label, value, detail }) {
  // This reusable card keeps supporting chart statistics visually consistent.
  return (
    <article className="chart-stat-card card border-0">
      <p>{label}</p>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  )
}
