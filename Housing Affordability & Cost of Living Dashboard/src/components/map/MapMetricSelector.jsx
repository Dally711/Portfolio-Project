export default function MapMetricSelector({ metrics, selectedMetric, onChange, copy }) {
  return (
    <div className="map-metric-control">
      <span>{copy.showOnMap}</span>
      <div className="map-metric-buttons" role="group" aria-label={copy.showOnMap}>
        {metrics.map((metric) => (
          <button
            type="button"
            key={metric.id}
            className={selectedMetric === metric.id ? 'is-active' : ''}
            aria-pressed={selectedMetric === metric.id}
            onClick={() => onChange(metric.id)}
          >
            {metric.title}
          </button>
        ))}
      </div>
    </div>
  )
}

