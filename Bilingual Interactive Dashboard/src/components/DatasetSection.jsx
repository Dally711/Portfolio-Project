import { useEffect, useMemo, useState } from 'react'
import ErrorState from './ErrorState'
import FilterPanel from './FilterPanel'
import LoadingState from './LoadingState'
import StatCard from './StatCard'
import LineChart from './charts/LineChart'
import {
  ALL_CATEGORIES,
  averageRowsByDate,
  calculateAverageMonthOverMonthPercentageChange,
  calculateAverageYearOverYearPercentageChange,
  calculateMonthlyDifference,
  filterByCategory,
  filterByDateRange,
  filterByGeography,
  formatNumber,
  formatRefDate,
  getLatestValue,
  getUniqueValues,
  removeInvalidRows,
  sortChronologically,
  toSafeNumber,
  validateColumns,
} from '../utils/dataUtils'
import { resolveDatasetGeography } from '../utils/geographyUtils'

export default function DatasetSection({
  config, language, copy, onSummary, sharedGeography = 'Canada',
  onGeographyChange, savedFilters = {}, onFiltersChange, headingControl = null,
}) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadVersion, setLoadVersion] = useState(0)
  const [category, setCategory] = useState(savedFilters.category ?? '')
  const [startDate, setStartDate] = useState(savedFilters.startDate ?? '')
  const [endDate, setEndDate] = useState(savedFilters.endDate ?? '')

  useEffect(() => {
    let cancelled = false

    // Mounting this section triggers its dataset's first load. The service cache
    // returns parsed rows immediately if the user revisits the section.
    async function loadData() {
      setLoading(true)
      setError('')

      try {
        const loadedRows = await config.loader()
        validateColumns(loadedRows, config.columns)
        if (!cancelled) setRows(loadedRows)
      } catch (loadError) {
        if (!cancelled) setError(loadError.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()
    return () => { cancelled = true }
  }, [config, loadVersion])

  const geographies = useMemo(
    () => getUniqueValues(rows, config.columns.geography),
    [rows, config.columns.geography],
  )

  // Canada is pinned first when the source table provides a national series.
  // Tables without a Canada row keep their real dataset-derived geographies.
  const orderedGeographies = geographies.includes('Canada')
    ? ['Canada', ...geographies.filter((option) => option !== 'Canada')]
    : geographies

  // Preferred defaults are used only after confirming they exist in the loaded
  // CSV; otherwise the first real option remains the safe fallback.
  const resolvedGeography = resolveDatasetGeography(
    geographies,
    sharedGeography,
    config.preferredGeography,
  )
  const selectedGeography = resolvedGeography || sharedGeography
  const displayedGeographies = orderedGeographies.includes(selectedGeography)
    ? orderedGeographies
    : [selectedGeography, ...orderedGeographies]

  const geographyRows = useMemo(
    () => filterByGeography(rows, selectedGeography, config.columns.geography),
    [rows, selectedGeography, config.columns.geography],
  )

  const categories = useMemo(
    () => getUniqueValues(geographyRows, config.columns.category),
    [geographyRows, config.columns.category],
  )

  const defaultCategory = categories.includes(config.preferredCategory)
    ? config.preferredCategory
    : (categories[0] ?? '')
  const orderedCategories = categories.includes(config.preferredCategory)
    ? [config.preferredCategory, ...categories.filter((option) => option !== config.preferredCategory)]
    : categories
  const categoryOptions = config.enableOverallAverage === false
    ? orderedCategories
    : [ALL_CATEGORIES, ...orderedCategories]
  const selectedCategory = categoryOptions.includes(category) ? category : defaultCategory

  // Large datasets are reduced once per filter change and before any values are
  // passed to Chart.js.
  const validSelectionRows = useMemo(() => {
    const selected = selectedCategory === ALL_CATEGORIES
      ? averageRowsByDate(geographyRows, config.columns)
      : filterByCategory(geographyRows, selectedCategory, config.columns.category)
    return sortChronologically(removeInvalidRows(selected, config.columns), config.columns.date)
  }, [geographyRows, selectedCategory, config.columns])

  const dateBounds = useMemo(() => {
    const dates = getUniqueValues(validSelectionRows, config.columns.date).sort()
    return { min: dates[0] ?? '', max: dates.at(-1) ?? '' }
  }, [validSelectionRows, config.columns.date])

  // Changing geography/category can change the available range. Invalid saved
  // dates fall back to the real bounds of the newly selected series.
  const selectedStartDate = startDate && startDate >= dateBounds.min && startDate <= dateBounds.max
    ? startDate
    : dateBounds.min
  const selectedEndDate = endDate && endDate >= dateBounds.min && endDate <= dateBounds.max
    ? endDate
    : dateBounds.max

  useEffect(() => {
    onFiltersChange?.({ category: selectedCategory, startDate: selectedStartDate, endDate: selectedEndDate })
  }, [selectedCategory, selectedStartDate, selectedEndDate, onFiltersChange])

  const filteredRows = useMemo(
    () => filterByDateRange(validSelectionRows, selectedStartDate, selectedEndDate, config.columns.date),
    [validSelectionRows, selectedStartDate, selectedEndDate, config.columns.date],
  )

  const latest = useMemo(
    () => getLatestValue(filteredRows, config.columns),
    [filteredRows, config.columns],
  )
  const monthlyDifference = useMemo(
    () => calculateMonthlyDifference(filteredRows, config.columns),
    [filteredRows, config.columns],
  )
  const averageMonthOverMonth = useMemo(
    () => calculateAverageMonthOverMonthPercentageChange(filteredRows, config.columns),
    [filteredRows, config.columns],
  )
  const averageYearOverYear = useMemo(
    () => calculateAverageYearOverYearPercentageChange(
      validSelectionRows,
      config.columns,
      selectedStartDate,
      selectedEndDate,
    ),
    [validSelectionRows, config.columns, selectedStartDate, selectedEndDate],
  )

  useEffect(() => {
    if (loading || error) return

    const recentChange = config.usePercentageChange ? averageMonthOverMonth : monthlyDifference

    // The overview receives only a compact real-data summary, never the full CSV.
    onSummary(config.id, latest ? {
      value: latest.value,
      unit: latest.unit,
      date: latest.date,
      geography: selectedGeography,
      category: selectedCategory === ALL_CATEGORIES ? copy.overallAverage : selectedCategory,
      change: recentChange,
      changeIsPercentage: Boolean(config.usePercentageChange),
      trend: filteredRows.slice(-18).map((row) => toSafeNumber(row[config.columns.value])),
    } : { unavailable: true })
  }, [
    loading, error, latest, selectedGeography, selectedCategory, config,
    averageMonthOverMonth, monthlyDifference, filteredRows, onSummary, copy.overallAverage,
  ])

  const chartLabels = filteredRows.map((row) => formatRefDate(row[config.columns.date], language))
  const chartValues = filteredRows.map((row) => toSafeNumber(row[config.columns.value]))
  const latestDisplay = latest ? formatDatasetValue(latest.value, config.id, language) : copy.unavailable
  const recentChange = config.usePercentageChange ? averageMonthOverMonth : monthlyDifference
  const indexExplanation = latest
    ? createIndexExplanation(latest.unit, latest.value, language, copy)
    : null

  const metrics = [
    {
      label: copy.latest,
      value: latestDisplay,
      detail: latest
        ? `${formatRefDate(latest.date, language)}${latest.unit ? ` · ${latest.unit}` : ''}`
        : copy.noData,
      tone: 'neutral',
    },
    {
      label: config.usePercentageChange ? copy.averageMonthlyChange : copy.monthlyDifference,
      value: formatChange(recentChange, language, config.usePercentageChange, config.id),
      detail: config.usePercentageChange ? copy.acrossSelectedPeriod : copy.comparedWithPrevious,
      tone: getChangeTone(recentChange),
    },
  ]

  if (config.showYearOverYear) {
    metrics.push({
      label: copy.averageYearlyChange,
      value: formatChange(averageYearOverYear, language, true),
      detail: copy.acrossSelectedYearlyPeriod,
      tone: getChangeTone(averageYearOverYear),
    })
  }

  return (
    <section className={`dataset-section dataset-section-${config.layout}`} aria-labelledby={`${config.id}-title`}>
      <div className="section-heading">
        <div className="dataset-heading-copy">
          <p className="eyebrow"><span>{config.number}</span>{copy.dataExplorer}</p>
          <h2 id={`${config.id}-title`}>{config.title}</h2>
          <p>{config.description}</p>
        </div>
        <span className="source-badge">{copy.source}</span>
      </div>

      {headingControl}

      {loading ? <LoadingState message={copy.loading} /> : error ? (
        <ErrorState
          title={copy.errorTitle}
          message={error}
          retryLabel={copy.retry}
          onRetry={() => setLoadVersion((version) => version + 1)}
        />
      ) : (
        <>
          <FilterPanel
            copy={copy}
            geographies={displayedGeographies}
            geography={selectedGeography}
            onGeographyChange={onGeographyChange}
            categories={categoryOptions}
            category={selectedCategory}
            onCategoryChange={setCategory}
            categoryLabel={config.categoryLabel}
            allOptionValue={ALL_CATEGORIES}
            geographySearchable={config.enableGeographySearch}
            categorySearchable={config.enableCategorySearch}
            searchLabel={copy.searchProducts}
            searchPlaceholder={copy.searchProductsPlaceholder}
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            minDate={dateBounds.min}
            maxDate={dateBounds.max}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          <div className="dataset-results">
            <div className="dataset-insights">
              {indexExplanation && (
                <aside className="index-explainer">
                  <span aria-hidden="true">i</span>
                  <div><strong>{copy.howToReadIndex}</strong><p>{indexExplanation}</p></div>
                </aside>
              )}
              <div className="stat-grid">
                {metrics.map((metric) => <StatCard key={metric.label} {...metric} />)}
              </div>
              <div className="insight-summary">
                <span aria-hidden="true">↗</span>
                <p>
                  {selectedCategory === ALL_CATEGORIES && <strong>{copy.averageNote} </strong>}
                  {getTrendSummary(recentChange, copy, config.usePercentageChange)}
                </p>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-heading">
                <div>
                  <h3>{copy.history}</h3>
                  <p>{selectedCategory === ALL_CATEGORIES ? copy.overallAverage : selectedCategory}{selectedGeography ? ` · ${selectedGeography}` : ''}</p>
                </div>
                <span>{filteredRows.length} {copy.observations}</span>
              </div>

              {filteredRows.length ? (
                <div className="chart-container">
                  <LineChart
                    labels={chartLabels}
                    values={chartValues}
                    datasetLabel={selectedCategory === ALL_CATEGORIES ? copy.overallAverage : (selectedCategory || config.title)}
                    ariaLabel={`${config.title}: ${copy.history}`}
                    color={config.color}
                  />
                </div>
              ) : (
                <p className="empty-chart" role="status">{copy.noData}</p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function formatChange(value, language, percentage, datasetId) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  const sign = value > 0 ? '+' : ''
  const formatted = formatNumber(value, language)
  if (percentage) return `${sign}${formatted}%`
  if (datasetId === 'grocery') return language === 'fr' ? `${sign}${formatted} $` : `${sign}$${formatted}`
  if (datasetId === 'gas') return `${sign}${formatted} ¢/L`
  return `${sign}${formatted}`
}

function formatDatasetValue(value, datasetId, language) {
  const formatted = formatNumber(value, language)
  if (datasetId === 'grocery') return language === 'fr' ? `${formatted} $` : `$${formatted}`
  if (datasetId === 'gas') return `${formatted} ¢/L`
  return formatted
}

function getTrendSummary(value, copy, isPeriodAverage) {
  if (!Number.isFinite(value)) return copy.trendSummaryUnavailable
  if (isPeriodAverage && value > 0) return copy.averageTrendUp
  if (isPeriodAverage && value < 0) return copy.averageTrendDown
  if (isPeriodAverage) return copy.averageTrendFlat
  if (value > 0) return copy.trendSummaryUp
  if (value < 0) return copy.trendSummaryDown
  return copy.trendSummaryFlat
}

function getChangeTone(value) {
  if (!Number.isFinite(value) || value === 0) return 'neutral'
  return value > 0 ? 'increase' : 'decrease'
}

function createIndexExplanation(unit, value, language, copy) {
  const match = String(unit ?? '').match(/(\d{4})(\d{2})?\s*=\s*100/)
  if (!match || !Number.isFinite(value)) return null

  const year = match[1]
  const month = match[2]
  const baseline = month
    ? new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', {
        month: 'long', year: 'numeric', timeZone: 'UTC',
      }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)))
    : year
  const difference = Math.abs(value - 100)
  const direction = value >= 100 ? copy.higherThanBaseline : copy.lowerThanBaseline

  return copy.indexExplanation
    .replace('{baseline}', baseline)
    .replace('{value}', formatNumber(value, language))
    .replace('{difference}', formatNumber(difference, language))
    .replace('{direction}', direction)
}
