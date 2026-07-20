import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import {
  calculateMonthlyDifference,
  filterByCategory,
  filterByGeography,
  formatNumber,
  formatRefDate,
  getLatestValue,
  getUniqueValues,
  removeInvalidRows,
  sortChronologically,
  toSafeNumber,
} from '../utils/dataUtils'
import { resolveDatasetGeography } from '../utils/geographyUtils'

export default function HomePage() {
  const { copy, language, datasetConfigs, summaries, updateSummary, selectedGeography } = useOutletContext()
  const [activeHeroId, setActiveHeroId] = useState('grocery')
  const [heroSlides, setHeroSlides] = useState({})
  const [overviewPeriod, setOverviewPeriod] = useState(3)
  const [overviewVisible, setOverviewVisible] = useState(false)
  const overviewRef = useRef(null)
  const overviewStartedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    const config = datasetConfigs.find((item) => item.id === activeHeroId)
    if (!config) return undefined

    // Carousel datasets are loaded only when their slide is first selected.
    // The shared service cache prevents another fetch on the full data page.
    async function loadHeroStory() {
      try {
        const summary = await buildPreviewSummary(config, selectedGeography)

        if (!cancelled) {
          setHeroSlides((current) => ({ ...current, [activeHeroId]: summary }))
          updateSummary(activeHeroId, summary)
        }
      } catch (error) {
        if (!cancelled) {
          setHeroSlides((current) => ({ ...current, [activeHeroId]: { error: error.message } }))
        }
      }
    }

    loadHeroStory()
    return () => { cancelled = true }
  }, [activeHeroId, datasetConfigs, selectedGeography, updateSummary])

  useEffect(() => {
    const node = overviewRef.current
    if (!node || !('IntersectionObserver' in window)) {
      queueMicrotask(() => setOverviewVisible(true))
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setOverviewVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '300px 0px' })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    overviewStartedRef.current = false
  }, [selectedGeography])

  useEffect(() => {
    if (!overviewVisible || overviewStartedRef.current) return
    overviewStartedRef.current = true

    // The four overview series start loading only as the user approaches this
    // section. Each result is cached and appears independently when ready.
    datasetConfigs.forEach(async (config) => {
      try {
        const summary = await buildPreviewSummary(config, selectedGeography)
        updateSummary(config.id, summary)
        setHeroSlides((current) => current[config.id]
          ? current
          : { ...current, [config.id]: summary })
      } catch {
        updateSummary(config.id, { unavailable: true })
      }
    })
  }, [overviewVisible, datasetConfigs, selectedGeography, updateSummary])

  return (
    <>
      <Hero
        copy={copy}
        slides={datasetConfigs}
        slideData={heroSlides}
        activeSlideId={activeHeroId}
        onSlideChange={setActiveHeroId}
        language={language}
      />

      <section className="overview-section page-section" id="overview" ref={overviewRef}>
        <div className="overview-heading-row">
          <SectionHeading eyebrow={copy.overviewEyebrow} title={copy.overviewTitle} description={copy.overviewDescription} />
          <div className="overview-period" aria-label={copy.overviewPeriod}>
            <span>{copy.overviewPeriod}</span>
            <div>
              {[1, 3, 6, 12].map((months) => (
                <button
                  type="button"
                  key={months}
                  className={overviewPeriod === months ? 'is-active' : ''}
                  aria-pressed={overviewPeriod === months}
                  onClick={() => setOverviewPeriod(months)}
                >
                  {months === 12 ? copy.oneYear : `${months}${copy.monthShort}`}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bento-grid">
          {datasetConfigs.map((config, index) => (
            <OverviewCard
              key={config.id}
              config={config}
              summary={summaries[config.id]}
              language={language}
              copy={copy}
              periodMonths={overviewPeriod}
              featured={index === 0 || index === 3}
            />
          ))}
        </div>
      </section>

      <section className="introduction-section page-section">
        <div className="intro-number" aria-hidden="true">04</div>
        <SectionHeading eyebrow={copy.introEyebrow} title={copy.introTitle} description={copy.introText} />
      </section>

      <section className="route-directory page-section">
        <SectionHeading eyebrow={copy.dashboardEyebrow} title={copy.dashboardTitle} description={copy.dashboardDescription} align="center" />
        <div className="route-directory-grid">
          {datasetConfigs.map((config) => (
            <Link key={config.id} className={`route-directory-card route-directory-${config.id}`} to={`/${config.id}`}>
              <span>{config.number}</span>
              <h3>{config.title}</h3>
              <p>{config.cardDescription}</p>
              <strong>{copy.exploreSection} →</strong>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

function OverviewCard({ config, summary, language, copy, featured, periodMonths }) {
  const hasValue = summary && !summary.unavailable
  const availableValues = hasValue ? summary.trend.filter(Number.isFinite) : []
  const isAnnualRent = config.id === 'rent'
  const periodValues = availableValues.slice(isAnnualRent ? -1 : -periodMonths)
  const average = periodValues.length
    ? periodValues.reduce((total, value) => total + value, 0) / periodValues.length
    : null
  const comparisonValue = isAnnualRent || periodMonths === 1
    ? availableValues.at(-2)
    : periodValues[0]
  const latestValue = periodValues.at(-1)
  const periodChange = Number.isFinite(comparisonValue) && Number.isFinite(latestValue)
    ? (config.usePercentageChange && comparisonValue !== 0
        ? ((latestValue - comparisonValue) / comparisonValue) * 100
        : latestValue - comparisonValue)
    : null
  const value = Number.isFinite(average)
    ? formatSummaryValue({ ...summary, value: average }, config.id, language)
    : hasValue ? copy.unavailable : copy.awaitingData
  const change = formatPeriodChange(periodChange, config, language, copy)

  return (
    <Link className={`bento-card bento-card-${config.id}${featured ? ' bento-card-featured' : ''}`} to={`/${config.id}`}>
      <div className="bento-card-top"><span className="bento-number">{config.number}</span><span className="bento-arrow" aria-hidden="true">↗</span></div>
      <p className="bento-label">{config.title}</p>
      <strong className="bento-value">{value}</strong>
      {hasValue ? (
        <>
          <p className="bento-context">{isAnnualRent ? copy.latestObservation : copy.averageOverPeriod.replace('{months}', periodMonths)} · {summary.category} · {formatRefDate(summary.date, language)}</p>
          <div className="bento-trend"><MiniSparkline values={periodValues} color={config.color} /><span>{change}</span></div>
        </>
      ) : <p className="bento-context">{config.cardDescription}</p>}
      <span className="bento-link">{copy.exploreSection}</span>
    </Link>
  )
}

function MiniSparkline({ values = [], color }) {
  if (values.length < 2) return <span className="sparkline-placeholder" aria-hidden="true" />
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${28 - ((value - min) / range) * 24}`).join(' ')

  return <svg className="sparkline" viewBox="0 0 100 32" role="img" aria-label="Recent trend"><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" /></svg>
}

function formatSummaryValue(summary, id, language) {
  const value = formatNumber(summary.value, language)
  if (id === 'grocery' || id === 'rent') return language === 'fr' ? `${value} $` : `$${value}`
  if (id === 'gas') return `${value} ¢/L`
  return value
}

function formatPeriodChange(value, config, language, copy) {
  if (!Number.isFinite(value)) return '—'
  const sign = value > 0 ? '+' : ''
  const formatted = formatNumber(value, language)
  if (config.usePercentageChange) return `${sign}${formatted}%`
  if (config.id === 'grocery' || config.id === 'rent') return language === 'fr' ? `${sign}${formatted} $` : `${sign}$${formatted}`
  if (config.id === 'gas') return `${sign}${formatted} ¢/L`
  return `${sign}${formatted} ${copy.points}`
}

async function buildPreviewSummary(config, sharedGeography) {
  const rows = await config.loader()
  const columns = config.columns
  const geographies = getUniqueValues(rows, columns.geography)
  const geography = resolveDatasetGeography(geographies, sharedGeography, config.preferredGeography)
  if (!geography) throw new Error('No observations are available for the selected geography.')
  const geographyRows = filterByGeography(rows, geography, columns.geography)
  const categoryRows = filterByCategory(geographyRows, config.preferredCategory, columns.category)
  const series = sortChronologically(removeInvalidRows(categoryRows, columns), columns.date)
  const latest = getLatestValue(series, columns)

  if (!latest) throw new Error('No valid observation is available for this preview.')

  return {
    value: latest.value,
    unit: latest.unit,
    date: latest.date,
    geography,
    category: config.preferredCategory,
    change: calculateMonthlyDifference(series, columns),
    changeIsPercentage: false,
    trend: series.slice(-18).map((row) => toSafeNumber(row[columns.value])),
  }
}
