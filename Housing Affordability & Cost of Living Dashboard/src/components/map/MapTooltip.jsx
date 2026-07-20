import { formatRefDate } from '../../utils/dataUtils'

export default function MapTooltip({ datum, position, metricLabel, formatValue, language, copy, metricId }) {
  if (!datum) return null

  const style = position ? { left: position.x + 16, top: position.y + 16 } : undefined
  return (
    <div className={`map-tooltip${position ? '' : ' map-tooltip-keyboard'}`} style={style} role="tooltip">
      <strong>{datum.region}</strong>
      <span>{metricLabel}</span>
      <b>{Number.isFinite(datum.value) ? formatValue(datum.value) : copy.unavailable}</b>
      {datum.date && <small>{copy.latestObservation}: {formatRefDate(datum.date, language)}</small>}
      {Number.isFinite(datum.change) && (
        <small>
          {metricId === 'rent' ? copy.annualChange : copy.monthlyChange}: {' '}
          {metricId === 'rent' && Number.isFinite(datum.difference)
            ? `${formatRentDifference(datum.difference, language)} · `
            : ''}
          {datum.change > 0 ? '+' : ''}{datum.change.toFixed(1)}%
        </small>
      )}
    </div>
  )
}

function formatRentDifference(value, language) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  const formatted = new Intl.NumberFormat(language === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 0 }).format(Math.abs(value))
  return language === 'fr' ? `${sign}${formatted} $` : `${sign}$${formatted}`
}
