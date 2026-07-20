export default function MapLegend({ domain, colorScale, unit, copy, formatValue }) {
  if (!domain) return null
  const [min, max] = domain
  const midpoint = min + ((max - min) / 2)
  const stops = Array.from({ length: 9 }, (_, index) => colorScale(min + ((max - min) * index / 8)))

  return (
    <div className="map-legend" aria-label={`${copy.mapLegend}: ${formatValue(min)} ${copy.toWord} ${formatValue(max)}`}>
      <div className="map-legend-title"><strong>{copy.mapLegend}</strong><span>{unit}</span></div>
      <div className="map-legend-ramp" style={{ background: `linear-gradient(90deg, ${stops.join(', ')})` }} />
      <div className="map-legend-values">
        <span>{formatValue(min)}</span><span>{formatValue(midpoint)}</span><span>{formatValue(max)}</span>
      </div>
      <div className="map-unavailable-key"><i aria-hidden="true" />{copy.unavailableData}</div>
    </div>
  )
}

