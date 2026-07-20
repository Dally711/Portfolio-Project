import { useEffect, useState } from 'react'
import { loaders } from '../data/dataService'
import { datasetConfigs, metricOrder } from '../data/datasetConfig'
import { buildSeries, formatDate, formatValue, latestAndChange } from '../utils/dataUtils'

export default function KpiGrid({ copy, language }) {
  const [summaries, setSummaries] = useState({})

  useEffect(() => {
    let cancelled = false
    // Independent card updates make system status visible while large CSVs finish parsing.
    metricOrder.forEach(async (metric) => {
      try {
        const dataKey = metric === 'housing' ? 'house' : metric
        const config = datasetConfigs[dataKey]
        const rows = await loaders[dataKey]()
        const series = buildSeries(rows, config, config.preferredGeography, config.preferredCategory, config.preferredStructure)
        if (!cancelled) setSummaries((current) => ({ ...current, [metric]: latestAndChange(series, config) ?? { unavailable: true } }))
      } catch {
        if (!cancelled) setSummaries((current) => ({ ...current, [metric]: { unavailable: true } }))
      }
    })
    return () => { cancelled = true }
  }, [])

  return (
    <aside className="hero-indicators card border-0" aria-labelledby="kpi-title">
      <div className="hero-indicators-heading">
        <div><p className="eyebrow">{copy.latest}</p><h2 id="kpi-title">{copy.kpis}</h2></div>
        <p>{copy.kpiIntro}</p>
      </div>
      <div className="hero-indicators-grid">
        {metricOrder.map((metric) => {
          // Housing's overview card uses the house-price dataset within the broader category.
          const dataKey = metric === 'housing' ? 'house' : metric
          const config = datasetConfigs[dataKey]
          const summary = summaries[metric]
          return <article className="kpi-card" key={metric}>
              <p className="kpi-label">{copy[metric]}</p>
              {!summary ? <div className="placeholder-glow" aria-label={copy.loading}><span className="placeholder col-7" /></div> : summary.unavailable ? <strong>{copy.unavailable}</strong> : <>
                <strong>{formatValue(summary.value, config, language)}</strong>
                <p>{formatDate(summary.date, language)} · {config.preferredGeography}</p>
                <small>{copy.previousChange}: {formatValue(summary.change, config, language, true)}</small>
              </>}
            </article>
        })}
      </div>
    </aside>
  )
}
