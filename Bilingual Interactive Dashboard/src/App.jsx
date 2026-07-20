import { useEffect, useMemo, useState } from 'react'
import './App.css'
import BarChart from './components/BarChart'
import DashboardHeader from './components/DashboardHeader'
import FilterBar from './components/FilterBar'
import KpiGrid from './components/KpiGrid'
import LineChart from './components/LineChart'
import StatCard from './components/StatCard'
import { loaders } from './data/dataService'
import { datasetConfigs } from './data/datasetConfig'
import { translations } from './data/translations'
import {
  averagePeriodChanges, buildRegionalComparison, buildSeries, filterSeriesByDate, formatDate, formatPercent,
  formatValue, latestAndChange, pinFirst, safeNumber, unique,
} from './utils/dataUtils'

export default function App() {
  const [language, setLanguage] = useState('en')
  const [metric, setMetric] = useState('grocery')
  const [housingView, setHousingView] = useState('house')
  const [rows, setRows] = useState([])
  const [loadedMetric, setLoadedMetric] = useState('')
  const [loadError, setLoadError] = useState('')
  const [retryVersion, setRetryVersion] = useState(0)
  const [geography, setGeography] = useState('Canada')
  const [category, setCategory] = useState('')
  const [structure, setStructure] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [monthlyChangeDisplay, setMonthlyChangeDisplay] = useState('value')
  const copy = translations[language]
  const dataMetric = metric === 'housing' ? housingView : metric
  const config = datasetConfigs[dataMetric]
  const locale = language === 'fr' ? 'fr-CA' : 'en-CA'
  const loading = loadedMetric !== dataMetric && !loadError

  useEffect(() => {
    document.documentElement.lang = language
    document.title = copy.dashboard
  }, [language, copy.dashboard])

  useEffect(() => {
    let cancelled = false
    loaders[dataMetric]().then((data) => {
      if (!cancelled) { setRows(data); setLoadedMetric(dataMetric) }
    }).catch(() => {
      if (!cancelled) setLoadError(true)
    })
    return () => { cancelled = true }
  }, [dataMetric, retryVersion])

  const categoryOptions = useMemo(() => unique(rows, config.category), [rows, config.category])
  const structureOptions = useMemo(() => config.structure ? unique(rows, config.structure) : [], [rows, config.structure])
  const selectedCategory = categoryOptions.includes(category) ? category
    : (categoryOptions.includes(config.preferredCategory) ? config.preferredCategory : categoryOptions[0] ?? '')
  const selectedStructure = structureOptions.includes(structure) ? structure
    : (structureOptions.includes(config.preferredStructure) ? config.preferredStructure : structureOptions[0] ?? '')
  const rawGeographies = useMemo(() => unique(rows, config.geography), [rows, config.geography])
  const geographyOptions = useMemo(() => {
    const options = pinFirst(rawGeographies, 'Canada')
    if (!options.includes('Canada')) options.unshift('Canada')
    // Keep a selected region visible when a dataset mainly lists city-level geographies.
    if (geography !== 'Canada' && !options.includes(geography)) options.splice(1, 0, geography)
    return options
  }, [rawGeographies, geography])

  const completeSeries = useMemo(() => buildSeries(rows, config, geography, selectedCategory, selectedStructure), [rows, config, geography, selectedCategory, selectedStructure])
  const dateOptions = useMemo(() => unique(completeSeries, config.date), [completeSeries, config.date])
  const selectedStart = dateOptions.includes(startDate) ? startDate : dateOptions[0] ?? ''
  const selectedEnd = dateOptions.includes(endDate) ? endDate : dateOptions.at(-1) ?? ''
  const visibleSeries = useMemo(() => filterSeriesByDate(completeSeries, config, selectedStart, selectedEnd), [completeSeries, config, selectedStart, selectedEnd])
  const summary = useMemo(() => latestAndChange(visibleSeries, config), [visibleSeries, config])
  const averageChanges = useMemo(() => averagePeriodChanges(visibleSeries, config), [visibleSeries, config])
  const regionalData = useMemo(() => buildRegionalComparison(rows, config, selectedCategory, selectedStructure, selectedEnd), [rows, config, selectedCategory, selectedStructure, selectedEnd])
  const sortedBars = useMemo(() => [...regionalData].sort((a, b) => sortOrder === 'desc' ? b.value - a.value : a.value - b.value), [regionalData, sortOrder])
  const metricLabel = `${copy[dataMetric]} · ${selectedCategory}`
  const unitLabel = copy[`${dataMetric}Unit`]
  const displayValue = (value, signed = false) => formatValue(value, config, language, signed)

  const handleMetricChange = (nextMetric) => {
    setLoadError(''); setLoadedMetric(''); setMetric(nextMetric); setGeography('Canada'); setCategory(''); setStructure(''); setStartDate(''); setEndDate('')
  }
  const handleHousingViewChange = (nextView) => {
    setLoadError(''); setLoadedMetric(''); setHousingView(nextView); setGeography('Canada'); setCategory(''); setStructure(''); setStartDate(''); setEndDate('')
  }
  const resetFilters = () => {
    setGeography(config.preferredGeography); setCategory(config.preferredCategory)
    setStructure(config.preferredStructure ?? ''); setStartDate(''); setEndDate(''); setSortOrder('desc')
  }

  const lineSummary = summary ? fill(copy.chartSummary, {
    metric: copy[dataMetric], geography, count: visibleSeries.length,
    from: formatDate(selectedStart, language), to: formatDate(selectedEnd, language), value: displayValue(summary.value),
  }) : copy.noData
  const highestBar = regionalData.length ? [...regionalData].sort((a, b) => b.value - a.value)[0] : null
  const barSummary = highestBar ? fill(copy.barSummary, {
    metric: copy[dataMetric], count: regionalData.length, highest: highestBar.region, value: displayValue(highestBar.value),
  }) : copy.noData

  // These summaries keep the most useful values beside their related diagrams.
  const latestDetail = summary ? `${formatDate(summary.date, language)} · ${geography}` : copy.noData
  const comparisonDate = selectedEnd ? formatDate(selectedEnd, language) : copy.unavailable
  const explainer = buildMeasureExplainer(dataMetric, summary, copy, language)
  const isRent = dataMetric === 'rent'
  const absoluteMonthlyChange = isRent ? averageChanges.estimatedMonthlyValue : averageChanges.monthlyValue
  const percentageMonthlyChange = isRent ? averageChanges.estimatedMonthly : averageChanges.monthly
  const monthlyChangeCount = isRent ? averageChanges.yearlyCount : averageChanges.monthlyCount
  const absoluteUnitLabel = config.valueKind === 'currency' ? '$' : config.valueKind === 'gas' ? '¢/L' : copy.points

  return (
    <div id="top">
      <DashboardHeader language={language} setLanguage={setLanguage} copy={copy} />
      <main>
        <section className="dashboard-hero container-xl">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1>
              <p className="hero-copy">{copy.intro}</p><a href="#dashboard-controls" className="text-link">{copy.jumpToData} <span aria-hidden="true">↓</span></a>
            </div>
            <div className="col-lg-5"><KpiGrid copy={copy} language={language} /></div>
          </div>
        </section>

        <div className="dashboard-body">
          <div className="container-xl">
            <section id="dashboard-controls" className="dashboard-section controls-section" aria-label={copy.controls}>
              <div className="filter-heading">
                <p className="eyebrow">{copy.controls}</p>
                <h2>{copy.globalFilters}</h2>
                <p>{copy.globalFiltersText}</p>
              </div>
              <FilterBar copy={copy} metric={metric} setMetric={handleMetricChange} housingView={housingView} setHousingView={handleHousingViewChange} geography={geography} setGeography={setGeography}
                category={selectedCategory} setCategory={setCategory} structure={selectedStructure} setStructure={setStructure}
                startDate={selectedStart} setStartDate={setStartDate} endDate={selectedEnd} setEndDate={setEndDate}
                geographyOptions={geographyOptions} categoryOptions={pinFirst(categoryOptions, config.preferredCategory)}
                structureOptions={pinFirst(structureOptions, config.preferredStructure)} dateOptions={dateOptions}
                formatDateOption={(date) => formatDate(date, language)} onReset={resetFilters} />
            </section>

            {loadError ? <StatusCard title={copy.errorTitle}><button className="btn reset-button" onClick={() => { setLoadError(''); setLoadedMetric(''); setRetryVersion((value) => value + 1) }}>{copy.retry}</button></StatusCard>
              : loading ? <StatusCard title={copy.loading} loading /> : <>
                <section className="dashboard-section chart-section" aria-labelledby="line-chart-title">
                  <ChartHeading eyebrow={copy.lineEyebrow} title={`${copy.lineTitle}: ${copy[dataMetric]}`} text={`${selectedCategory} · ${geography} · ${formatDate(selectedStart, language)}–${formatDate(selectedEnd, language)}`} source={copy.source} />
                  {explainer && <article className="measure-explainer chart-explainer"><span aria-hidden="true">i</span><div><strong>{explainer.title}</strong><p>{explainer.text}</p></div></article>}
                  <div className="chart-with-stats">
                    <div className="chart-card card border-0">
                      {visibleSeries.length >= 2 ? <div className="line-chart-wrap"><LineChart labels={visibleSeries.map((row) => formatDate(row[config.date], language))} values={visibleSeries.map((row) => safeNumber(row[config.value]))} label={metricLabel} color={config.color} locale={locale} formatValue={displayValue} xTitle={copy.xAxis} yTitle={unitLabel} ariaLabel={lineSummary} /></div> : <EmptyState text={copy.noData} />}
                      <p className="chart-meta">{visibleSeries.length} {copy.observations} · {copy.source}</p>
                      <p className="visually-hidden">{lineSummary}</p>
                    </div>
                    <aside className="chart-stat-rail" aria-label={copy.lineStats}>
                      <ChangeUnitToggle copy={copy} unitLabel={absoluteUnitLabel} value={monthlyChangeDisplay} onChange={setMonthlyChangeDisplay} />
                      <StatCard label={isRent ? copy.averageMonthlyRent : copy.latest} value={summary ? displayValue(summary.value) : copy.unavailable} detail={latestDetail} />
                      <StatCard label={copy.averageMonthlyChange}
                        value={monthlyChangeDisplay === 'value' ? displayValue(absoluteMonthlyChange, true) : formatPercent(percentageMonthlyChange, language)}
                        detail={monthlyChangeCount ? (isRent ? copy.estimatedMonthlyRentDetail : copy.averageMonthlyToggleDetail) : (isRent ? copy.notEnoughYearlyData : copy.notEnoughMonthlyData)} />
                      <StatCard label={copy.averageYearlyChange}
                        value={monthlyChangeDisplay === 'value' ? displayValue(averageChanges.yearlyDollar, true) : formatPercent(averageChanges.yearly, language)}
                        detail={averageChanges.yearlyCount ? copy.averageYearlyToggleDetail : copy.notEnoughYearlyData} />
                    </aside>
                  </div>
                </section>

                <section className="dashboard-section chart-section" aria-labelledby="bar-chart-title">
                  <div className="section-intro align-items-end">
                    <div><p className="eyebrow">{copy.barEyebrow}</p><h2 id="bar-chart-title">{copy.barTitle}: {copy[dataMetric]}</h2><p>{copy.barText}</p></div>
                    <div className="sort-control"><label className="form-label" htmlFor="bar-sort">{copy.sort}</label><select className="form-select" id="bar-sort" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="desc">{copy.descending}</option><option value="asc">{copy.ascending}</option></select></div>
                  </div>
                  <div className="chart-with-stats">
                    <div className="chart-card card border-0">
                      {sortedBars.length ? <div className="bar-chart-wrap"><BarChart labels={sortedBars.map((item) => item.region)} values={sortedBars.map((item) => item.value)} label={metricLabel} color={config.color} locale={locale} formatValue={displayValue} xTitle={unitLabel} ariaLabel={barSummary} /></div> : <EmptyState text={copy.noData} />}
                      <p className="chart-meta">{copy.source}</p><p className="visually-hidden">{barSummary}</p>
                    </div>
                    <aside className="chart-stat-rail" aria-label={copy.barStats}>
                      <StatCard label={copy.highestRegion} value={highestBar?.region ?? copy.unavailable} detail={highestBar ? displayValue(highestBar.value) : copy.noData} />
                      <StatCard label={copy.regionsCompared} value={regionalData.length.toLocaleString(locale)} detail={selectedCategory} />
                      <StatCard label={copy.asOf} value={comparisonDate} detail={copy.latestRegionalValues} />
                    </aside>
                  </div>
                </section>

                <section className="dashboard-section insights-section" aria-labelledby="insights-title">
                  <div className="section-intro"><div><p className="eyebrow">{copy.insightsEyebrow}</p><h2 id="insights-title">{copy.insightsTitle}</h2></div></div>
                  <div className="row g-3">
                    <Insight number="01" title={copy.insightLatestTitle} text={summary ? fill(copy.insightLatest, { value: displayValue(summary.value), period: formatDate(summary.date, language) }) : copy.noData} />
                    <Insight number="02" title={copy.insightChangeTitle} text={changeInsight(summary, copy, displayValue)} />
                    <Insight number="03" title={copy.insightRangeTitle} text={fill(copy.insightRange, { count: visibleSeries.length })} />
                  </div>
                </section>
              </>}

            <section className="dashboard-section about-data card border-0" aria-labelledby="about-title">
              <div><p className="eyebrow">{copy.aboutEyebrow}</p><h2 id="about-title">{copy.aboutTitle}</h2></div>
              <div className="about-copy"><p>{copy.aboutText}</p><p>{copy.averageNote}</p><p>{copy.updatedNote}</p><p className="project-note">{copy.projectNote}</p></div>
            </section>
          </div>
        </div>
      </main>
      <footer className="dashboard-footer"><div className="container-xl d-flex flex-column flex-sm-row justify-content-between gap-2"><strong>{copy.footer}</strong><span>{copy.studentProject}</span></div></footer>
    </div>
  )
}

function ChartHeading({ eyebrow, title, text, source }) {
  return <div className="section-intro"><div><p className="eyebrow">{eyebrow}</p><h2 id="line-chart-title">{title}</h2><p>{text}</p></div><span className="source-badge">{source}</span></div>
}

function StatusCard({ title, children, loading = false }) {
  return <section className="status-card card border-0 text-center" aria-live="polite">{loading && <span className="spinner-border" aria-hidden="true" />}<h2>{title}</h2>{children}</section>
}

function EmptyState({ text }) { return <div className="empty-state" role="status">{text}</div> }
function Insight({ number, title, text }) {
  return <div className="col-md-4"><article className="insight-card card border-0 h-100"><div className="insight-card-heading"><span>{number}</span><h3>{title}</h3></div><p>{text}</p></article></div>
}

function ChangeUnitToggle({ copy, unitLabel, value, onChange }) {
  // One shared control keeps monthly and yearly change cards in the same unit.
  const nextValue = value === 'value' ? 'percentage' : 'value'
  return <button type="button" className="change-unit-control" aria-label={copy.changeDisplay} onClick={() => onChange(nextValue)}>
    <span>{copy.changeDisplayLabel}</span><span className="unit-switch" aria-hidden="true">
      <span className={value === 'value' ? 'active' : ''}>{unitLabel}</span><span className={value === 'percentage' ? 'active' : ''}>%</span>
    </span>
  </button>
}

function changeInsight(summary, copy, format) {
  if (!summary || !Number.isFinite(summary.change)) return copy.noData
  if (summary.change === 0) return copy.insightChangeFlat
  return fill(summary.change > 0 ? copy.insightChangeUp : copy.insightChangeDown, { change: format(Math.abs(summary.change)) })
}

function buildMeasureExplainer(metric, summary, copy, language) {
  if (!['inflation', 'house'].includes(metric) || !summary) return null

  // Statistics Canada embeds the index base period in labels such as 2002=100 or 201612=100.
  const baseMatch = String(summary.unit ?? '').match(/(\d{4})(\d{2})?=100/)
  if (!baseMatch) return null
  const baseline = baseMatch[2]
    ? new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(Date.UTC(Number(baseMatch[1]), Number(baseMatch[2]) - 1, 1)))
    : baseMatch[1]
  const difference = new Intl.NumberFormat(language === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 1 }).format(summary.value - 100)
  return {
    title: copy.howReadIndex,
    text: fill(copy.indexExplanation, { baseline, value: summary.value, difference }),
  }
}

function fill(template, values) {
  return Object.entries(values).reduce((text, [key, value]) => text.replace(`{${key}}`, value), template)
}
