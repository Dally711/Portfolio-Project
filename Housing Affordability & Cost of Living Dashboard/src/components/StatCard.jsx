export default function StatCard({ label, value, detail, tone = 'neutral' }) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {detail && <p className="stat-detail">{detail}</p>}
    </div>
  )
}
