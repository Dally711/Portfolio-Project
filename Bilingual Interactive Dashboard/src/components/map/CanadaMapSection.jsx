import { useEffect, useMemo, useState } from 'react'
import { scaleSequential } from 'd3-scale'
import { interpolateYlGn } from 'd3-scale-chromatic'
import CanadaMap from './CanadaMap'
import MapLegend from './MapLegend'
import MapMetricSelector from './MapMetricSelector'
import MapTooltip from './MapTooltip'
import RegionSummary from './RegionSummary'
import ErrorState from '../ErrorState'
import LoadingState from '../LoadingState'
import { normalizeGeographyName } from '../../utils/geographyUtils'
import { buildRegionalMetricData, getMetricDomain } from '../../utils/mapDataUtils'
import { formatNumber } from '../../utils/dataUtils'

export default function CanadaMapSection({ datasetConfigs, selectedGeography, onGeographyChange, language, copy }) {
  const [metricId, setMetricId] = useState('grocery')
  const [datasets, setDatasets] = useState({})
  const [errors, setErrors] = useState({})
  const [loadVersion, setLoadVersion] = useState(0)
  const [preview, setPreview] = useState(null)
  const config = datasetConfigs.find((item) => item.id === metricId)

  useEffect(() => {
    let cancelled = false
    // Keep only datasets the user has selected. The service adds a second cache
    // layer, so revisiting this route never refetches an already parsed CSV.
    if (datasets[metricId] || errors[metricId]) return undefined

    async function loadMetric() {
      try {
        const rows = await config.loader()
        if (!cancelled) setDatasets((current) => ({ ...current, [metricId]: rows }))
      } catch (loadError) {
        if (!cancelled) setErrors((current) => ({ ...current, [metricId]: loadError.message }))
      }
    }

    loadMetric()
    return () => { cancelled = true }
  }, [config, datasets, errors, loadVersion, metricId])

  const regionalData = useMemo(
    () => datasets[metricId] ? buildRegionalMetricData(datasets[metricId], config) : [],
    [datasets, metricId, config],
  )
  const domain = useMemo(() => getMetricDomain(regionalData), [regionalData])
  const colorScale = useMemo(
    () => scaleSequential(interpolateYlGn).domain(domain ?? [0, 1]),
    [domain],
  )
  const selectedRegion = normalizeGeographyName(selectedGeography)
  const error = errors[metricId] ?? ''
  const loading = !datasets[metricId] && !error
  const selectedDatum = selectedRegion === 'Canada'
    ? null
    : regionalData.find((item) => item.region === selectedRegion)
  const metricLabel = getMetricLabel(metricId, config.preferredCategory, copy)
  const unit = getMetricUnit(metricId, language)
  const formatValue = (value) => formatMetricValue(value, metricId, language)

  function selectRegion(region) {
    onGeographyChange(selectedRegion === region ? 'Canada' : region)
  }

  function previewRegion(datum, event) {
    const pointerEvent = event?.clientX ? { x: event.clientX, y: event.clientY } : null
    setPreview({ datum, position: pointerEvent })
  }

  return (
    <section className="canada-map-section page-section" aria-labelledby="map-title">
      <div className="map-section-heading">
        <div>
          <p className="eyebrow">{copy.mapEyebrow}</p>
          <h1 id="map-title">{copy.mapTitle}</h1>
          <p>{copy.mapDescription}</p>
        </div>
        <button type="button" className="map-reset-button" onClick={() => onGeographyChange('Canada')} disabled={selectedRegion === 'Canada'}>
          {copy.resetCanada}
        </button>
      </div>

      <MapMetricSelector metrics={datasetConfigs} selectedMetric={metricId} onChange={setMetricId} copy={copy} />
      <p className="map-measure-label"><span aria-hidden="true">●</span>{metricLabel}</p>

      <div className="map-story-layout">
        <div className="map-card">
          {loading ? <LoadingState message={copy.loadingMap} /> : error ? (
            <ErrorState
              title={copy.errorTitle}
              message={error}
              retryLabel={copy.retry}
              onRetry={() => {
                setErrors((current) => ({ ...current, [metricId]: '' }))
                setLoadVersion((value) => value + 1)
              }}
            />
          ) : domain ? (
            <>
              <CanadaMap
                regionalData={regionalData}
                selectedRegion={selectedRegion}
                colorScale={colorScale}
                metricLabel={metricLabel}
                formatValue={formatValue}
                onSelect={selectRegion}
                onPreview={previewRegion}
                onClearPreview={() => setPreview(null)}
              />
              <MapLegend domain={domain} colorScale={colorScale} unit={unit} copy={copy} formatValue={formatValue} />
            </>
          ) : <p className="map-unavailable" role="status">{copy.mapUnavailable}</p>}
        </div>

        <RegionSummary datum={selectedDatum} metricLabel={metricLabel} formatValue={formatValue} language={language} copy={copy} metricId={metricId} />
      </div>

      <MapTooltip datum={preview?.datum} position={preview?.position} metricLabel={metricLabel} formatValue={formatValue} language={language} copy={copy} metricId={metricId} />
    </section>
  )
}

function getMetricLabel(metricId, category, copy) {
  const templates = {
    grocery: copy.groceryMapMetric,
    inflation: copy.inflationMapMetric,
    housing: copy.housingMapMetric,
    rent: copy.rentMapMetric,
    gas: copy.gasMapMetric,
  }
  return templates[metricId].replace('{category}', category)
}

function getMetricUnit(metricId, language) {
  if (metricId === 'grocery') return language === 'fr' ? 'dollars' : 'dollars'
  if (metricId === 'rent') return language === 'fr' ? 'dollars par mois' : 'dollars per month'
  if (metricId === 'gas') return language === 'fr' ? 'cents par litre' : 'cents per litre'
  return language === 'fr' ? 'points d’indice' : 'index points'
}

function formatMetricValue(value, metricId, language) {
  if (!Number.isFinite(value)) return '—'
  const formatted = formatNumber(value, language)
  if (metricId === 'grocery' || metricId === 'rent') return language === 'fr' ? `${formatted} $` : `$${formatted}`
  if (metricId === 'gas') return `${formatted} ¢/L`
  return formatted
}
