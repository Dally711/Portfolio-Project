import { Link } from 'react-router-dom'
import { formatNumber, formatRefDate } from '../utils/dataUtils'

export default function Hero({ copy, slides, slideData, activeSlideId, onSlideChange, language }) {
  const activeIndex = Math.max(0, slides.findIndex((slide) => slide.id === activeSlideId))
  const activeSlide = slides[activeIndex]
  const data = slideData[activeSlide.id]
  const loading = !data
  const hasData = data && !data.error && Number.isFinite(data.value)
  const value = hasData ? formatDatasetValue(data.value, activeSlide.id, language) : '—'
  const change = hasData && Number.isFinite(data.change)
    ? formatDatasetChange(data.change, activeSlide.id, language, copy)
    : '—'

  const showSlide = (index) => {
    const wrappedIndex = (index + slides.length) % slides.length
    onSlideChange(slides[wrappedIndex].id)
  }

  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{copy.heroEyebrow}</p>
        <h1>{copy.heroTitle}</h1>
        <p className="hero-lede">{copy.heroText}</p>
        <div className="hero-actions">
          <Link className="button button-primary" to={`/${activeSlide.id}`}>{copy.exploreData}</Link>
          <Link className="button button-secondary" to="/about">{copy.aboutProject}</Link>
        </div>
        <div className="hero-trust"><span aria-hidden="true">✓</span>{copy.heroTrust}</div>
      </div>

      <div className="hero-visual" role="region" aria-roledescription="carousel" aria-label={copy.heroCarouselLabel}>
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

        <div className="hero-data-card hero-data-main" aria-live="polite">
          <div className="hero-data-header">
            <span>{activeSlide.title} · {copy.latestObservation}</span>
            <span className="carousel-count">{activeIndex + 1} / {slides.length}</span>
          </div>

          {loading ? (
            <div className="hero-metric-skeleton" aria-label={copy.loadingHero}><span /><span /><span /></div>
          ) : data.error ? (
            <div className="hero-data-unavailable" role="status"><strong>—</strong><p>{copy.heroUnavailable}</p></div>
          ) : (
            <div className="hero-slide-content" key={activeSlide.id}>
              <strong>{value}</strong>
              <p>
                {data.category} · {data.geography}
                {formatBaselineLabel(data.unit, language, copy)}
              </p>
              <HeroSparkline values={data.trend} label={`${activeSlide.title}: ${copy.recentTrend}`} color={activeSlide.color} />
            </div>
          )}

          <div className="carousel-controls">
            <button type="button" className="carousel-arrow" onClick={() => showSlide(activeIndex - 1)} aria-label={copy.previousSlide}>←</button>
            <div className="carousel-dots" aria-label={copy.chooseSlide}>
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.id}
                  className={index === activeIndex ? 'is-active' : ''}
                  aria-label={`${copy.showSlide} ${slide.title}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => showSlide(index)}
                />
              ))}
            </div>
            <button type="button" className="carousel-arrow" onClick={() => showSlide(activeIndex + 1)} aria-label={copy.nextSlide}>→</button>
          </div>
        </div>

        <div className="hero-data-card hero-data-small hero-data-grocery">
          <span className="data-icon data-icon-green" aria-hidden="true">↗</span>
          <div><strong>{change}</strong><small>{copy.previousPeriodChange}</small></div>
        </div>
        <div className="hero-data-card hero-data-small hero-data-housing">
          <span className="data-icon data-icon-orange" aria-hidden="true">◷</span>
          <div><strong>{hasData ? formatRefDate(data.date, language) : '—'}</strong><small>{copy.latestObservation}</small></div>
        </div>
      </div>
    </section>
  )
}

function HeroSparkline({ values = [], label, color }) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${92 - ((value - min) / range) * 78}`).join(' ')

  return (
    <svg className="hero-sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={label}>
      <path d={`M0,100 L${points.replaceAll(' ', ' L')} L100,100 Z`} fill={`${color}1f`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function formatDatasetValue(value, datasetId, language) {
  const formatted = formatNumber(value, language)
  if (datasetId === 'grocery' || datasetId === 'rent') return language === 'fr' ? `${formatted} $` : `$${formatted}`
  if (datasetId === 'gas') return `${formatted} ¢/L`
  return formatted
}

function formatDatasetChange(value, datasetId, language, copy) {
  const sign = value > 0 ? '+' : ''
  const formatted = formatNumber(value, language)
  if (datasetId === 'grocery' || datasetId === 'rent') return language === 'fr' ? `${sign}${formatted} $` : `${sign}$${formatted}`
  if (datasetId === 'gas') return `${sign}${formatted} ¢/L`
  return `${sign}${formatted} ${copy.points}`
}

function formatBaselineLabel(unit, language, copy) {
  const match = String(unit ?? '').match(/(\d{4})(\d{2})?\s*=\s*100/)
  if (!match) return ''

  const baseline = match[2]
    ? new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', {
        month: 'short', year: 'numeric', timeZone: 'UTC',
      }).format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1)))
    : match[1]

  return ` · ${copy.baseline}: ${baseline}`
}
