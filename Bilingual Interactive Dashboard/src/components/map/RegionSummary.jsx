import { Link } from 'react-router-dom'
import { formatRefDate } from '../../utils/dataUtils'

export default function RegionSummary({ datum, metricLabel, formatValue, language, copy, metricId }) {
  if (!datum) {
    return (
      <aside className="region-summary region-summary-empty">
        <span className="region-summary-icon" aria-hidden="true">⌖</span>
        <p className="eyebrow">{copy.canadaWide}</p>
        <h2>{copy.selectRegionPrompt}</h2>
        <p>{copy.selectRegionHelp}</p>
      </aside>
    )
  }

  const changeText = Number.isFinite(datum.change)
    ? (metricId === 'rent' ? copy.rentRegionTrend : copy.regionTrend)
        .replace('{direction}', datum.change >= 0 ? copy.increased : copy.decreased)
        .replace('{change}', Math.abs(datum.change).toFixed(1))
        .replace('{dollars}', formatSignedCurrency(Math.abs(datum.difference), language))
    : copy.trendSummaryUnavailable

  return (
    <aside className="region-summary" aria-live="polite">
      <p className="eyebrow">{copy.selectedRegion}</p>
      <h2>{datum.region}</h2>
      <p className="region-summary-metric">{metricLabel}</p>
      <strong className="region-summary-value">
        {Number.isFinite(datum.value) ? formatValue(datum.value) : copy.unavailable}
      </strong>
      {datum.date && <p>{copy.latestObservation}: {formatRefDate(datum.date, language)}</p>}
      {datum.isRegionalAverage && <p className="regional-average-note">{copy.regionalAverageNote}</p>}
      <p className="region-trend-summary">{changeText}</p>
      <div className="region-links" aria-label={copy.exploreRegionPages}>
        {[
          ['/grocery', copy.grocery],
          ['/inflation', copy.inflation],
          ['/housing', copy.housing],
          ['/gas', copy.gas],
        ].map(([to, label]) => <Link key={to} to={to}>{label}<span aria-hidden="true">↗</span></Link>)}
      </div>
    </aside>
  )
}

function formatSignedCurrency(value, language) {
  if (!Number.isFinite(value)) return '—'
  const formatted = new Intl.NumberFormat(language === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 0 }).format(value)
  return language === 'fr' ? `${formatted} $` : `$${formatted}`
}
