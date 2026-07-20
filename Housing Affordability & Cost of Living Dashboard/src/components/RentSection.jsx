import { useEffect, useMemo, useState } from 'react'
import ErrorState from './ErrorState'
import LoadingState from './LoadingState'
import StatCard from './StatCard'
import LineChart from './charts/LineChart'
import {
  averageRowsByDate,
  filterByCategory,
  filterByDateRange,
  filterByGeography,
  formatNumber,
  formatRefDate,
  getUniqueValues,
  removeInvalidRows,
  sortChronologically,
  toSafeNumber,
} from '../utils/dataUtils'

export default function RentSection({
  config, language, copy, onSummary, sharedGeography, onGeographyChange,
  savedFilters = {}, onFiltersChange, headingControl = null,
}) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadVersion, setLoadVersion] = useState(0)
  const [geography, setGeography] = useState(savedFilters.geography ?? '')
  const [geographySearch, setGeographySearch] = useState('')
  const [category, setCategory] = useState(savedFilters.category ?? '')
  const [structure, setStructure] = useState(savedFilters.structure ?? '')
  const [startDate, setStartDate] = useState(savedFilters.startDate ?? '')
  const [endDate, setEndDate] = useState(savedFilters.endDate ?? '')

  useEffect(() => {
    let cancelled = false
    async function loadRent() {
      setLoading(true)
      setError('')
      try {
        const loadedRows = await config.loader()
        if (!cancelled) setRows(loadedRows)
      } catch (loadError) {
        if (!cancelled) setError(loadError.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadRent()
    return () => { cancelled = true }
  }, [config, loadVersion])

  const geographies = useMemo(
    () => getUniqueValues(rows, config.columns.geography),
    [rows, config.columns.geography],
  )
  const selectedGeography = geography === 'Canada' || geographies.includes(geography)
    ? geography
    : (sharedGeography === 'Canada' || geographies.includes(sharedGeography)
      ? sharedGeography
      : 'Canada')
  const normalizedGeographySearch = geographySearch.trim().toLocaleLowerCase()
  const visibleGeographies = useMemo(() => {
    const displayedGeographies = ['Canada', ...geographies.filter((option) => option !== 'Canada')]
    if (!normalizedGeographySearch) return displayedGeographies
    const matches = displayedGeographies.filter((option) => (
      option === 'Canada' || option.toLocaleLowerCase().includes(normalizedGeographySearch)
    ))
    return selectedGeography && !matches.includes(selectedGeography)
      ? [selectedGeography, ...matches]
      : matches
  }, [geographies, normalizedGeographySearch, selectedGeography])
  const geographyMatchCount = normalizedGeographySearch
    ? geographies.filter((option) => option.toLocaleLowerCase().includes(normalizedGeographySearch)).length
    : geographies.length
  const categories = useMemo(
    () => getUniqueValues(rows, config.columns.category),
    [rows, config.columns.category],
  )
  const structures = useMemo(
    () => getUniqueValues(rows, config.columns.structure),
    [rows, config.columns.structure],
  )
  const selectedCategory = categories.includes(category)
    ? category
    : (categories.includes(config.preferredCategory) ? config.preferredCategory : categories[0] ?? '')
  const selectedStructure = structures.includes(structure)
    ? structure
    : (structures.includes(config.preferredStructure) ? config.preferredStructure : structures[0] ?? '')
  const orderedCategories = pinFirst(categories, config.preferredCategory)
  const orderedStructures = pinFirst(structures, config.preferredStructure)

  const completeSeries = useMemo(() => {
    const categoryRows = filterByCategory(rows, selectedCategory, config.columns.category)
    const structureRows = filterByCategory(categoryRows, selectedStructure, config.columns.structure)
    const positiveRentRows = removeInvalidRows(structureRows, config.columns).filter(
      (row) => toSafeNumber(row[config.columns.value]) > 0,
    )
    const geographyRows = selectedGeography === 'Canada'
      ? averageRowsByDate(positiveRentRows, config.columns).map((row) => ({
          ...row,
          [config.columns.geography]: 'Canada',
          [config.columns.category]: selectedCategory,
        }))
      : filterByGeography(positiveRentRows, selectedGeography, config.columns.geography)
    return sortChronologically(geographyRows, config.columns.date)
  }, [rows, selectedGeography, selectedCategory, selectedStructure, config.columns])

  const availableDates = useMemo(
    () => getUniqueValues(completeSeries, config.columns.date).sort(),
    [completeSeries, config.columns.date],
  )
  const selectedStartDate = availableDates.includes(startDate) ? startDate : (availableDates[0] ?? '')
  const selectedEndDate = availableDates.includes(endDate) ? endDate : (availableDates.at(-1) ?? '')
  const filteredRows = useMemo(
    () => filterByDateRange(completeSeries, selectedStartDate, selectedEndDate, config.columns.date),
    [completeSeries, selectedStartDate, selectedEndDate, config.columns.date],
  )
  const latestRow = filteredRows.at(-1)
  const previousRow = filteredRows.at(-2)
  const latestValue = latestRow ? toSafeNumber(latestRow[config.columns.value]) : null
  const previousValue = previousRow ? toSafeNumber(previousRow[config.columns.value]) : null
  const consecutiveYears = latestRow && previousRow
    ? Number(latestRow[config.columns.date]) - Number(previousRow[config.columns.date]) === 1
    : false
  const dollarChange = consecutiveYears && latestValue !== null && previousValue !== null
    ? latestValue - previousValue
    : null
  const percentChange = dollarChange !== null && previousValue !== 0
    ? (dollarChange / previousValue) * 100
    : null

  useEffect(() => {
    onFiltersChange?.({
      geography: selectedGeography,
      category: selectedCategory,
      structure: selectedStructure,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    })
  }, [selectedGeography, selectedCategory, selectedStructure, selectedStartDate, selectedEndDate, onFiltersChange])

  useEffect(() => {
    if (loading || error) return
    onSummary(config.id, latestValue !== null ? {
      value: latestValue,
      unit: latestRow[config.columns.unit],
      date: latestRow[config.columns.date],
      geography: selectedGeography,
      category: selectedCategory,
      change: dollarChange,
      changeIsPercentage: false,
      trend: completeSeries.map((row) => toSafeNumber(row[config.columns.value])),
    } : { unavailable: true })
  }, [
    loading, error, config, latestRow, latestValue, dollarChange, completeSeries,
    selectedGeography, selectedCategory, onSummary,
  ])

  const currency = (value, signed = false) => {
    if (!Number.isFinite(value)) return '—'
    const sign = signed && value > 0 ? '+' : ''
    const formatted = formatNumber(value, language, { maximumFractionDigits: 0 })
    return language === 'fr' ? `${sign}${formatted} $` : `${sign}$${formatted}`
  }
  const percentage = (value) => Number.isFinite(value)
    ? `${value > 0 ? '+' : ''}${formatNumber(value, language)}%`
    : '—'

  return (
    <section className="dataset-section dataset-section-reverse rent-section" aria-labelledby="rent-title">
      <div className="section-heading">
        <div className="dataset-heading-copy">
          <p className="eyebrow"><span>{config.number}</span>{copy.housingSubsection}</p>
          <h2 id="rent-title">{copy.rentalMarket}</h2>
          <p>{copy.rentDescription}</p>
        </div>
        <span className="source-badge">{copy.source}</span>
      </div>

      {headingControl}

      {loading ? <LoadingState message={copy.loadingRent} /> : error ? (
        <ErrorState title={copy.errorTitle} message={error} retryLabel={copy.retry} onRetry={() => setLoadVersion((value) => value + 1)} />
      ) : (
        <>
          <form className="filter-panel rent-filter-panel" onSubmit={(event) => event.preventDefault()}>
            <div className="filter-control filter-control-wide">
              <label htmlFor="rent-geography-search">{copy.searchLocations}</label>
              <input
                id="rent-geography-search"
                type="search"
                value={geographySearch}
                placeholder={copy.searchLocationsPlaceholder}
                onChange={(event) => setGeographySearch(event.target.value)}
              />
              {geographySearch.trim() && (
                <span className="filter-result-count" aria-live="polite">
                  {geographyMatchCount} {copy.locationMatches}
                </span>
              )}
            </div>
            <RentSelect
              id="rent-geography"
              label={copy.geography}
              value={selectedGeography}
              options={visibleGeographies}
              onChange={(value) => {
                setGeography(value)
                onGeographyChange(value)
              }}
            />
            <RentSelect id="rent-structure" label={copy.structureType} value={selectedStructure} options={orderedStructures} onChange={setStructure} wide />
            <RentSelect id="rent-category" label={copy.bedroomType} value={selectedCategory} options={orderedCategories} onChange={setCategory} />
            <RentSelect id="rent-from" label={copy.fromYear} value={selectedStartDate} options={availableDates} onChange={(value) => {
              setStartDate(value)
              if (value > selectedEndDate) setEndDate(value)
            }} />
            <RentSelect id="rent-to" label={copy.toYear} value={selectedEndDate} options={availableDates} onChange={(value) => {
              setEndDate(value)
              if (value < selectedStartDate) setStartDate(value)
            }} />
          </form>

          <div className="dataset-results">
            <div className="chart-card">
              <div className="chart-heading">
                <div><h3>{copy.rentTrend}</h3><p>{selectedCategory} · {selectedGeography}</p></div>
                <span>{filteredRows.length} {copy.observations}</span>
              </div>
              {filteredRows.length >= 2 ? (
                <div className="chart-container">
                  <LineChart
                    labels={filteredRows.map((row) => formatRefDate(row[config.columns.date], language))}
                    values={filteredRows.map((row) => toSafeNumber(row[config.columns.value]))}
                    datasetLabel={copy.averageMonthlyRent}
                    ariaLabel={`${copy.rentalMarket}: ${copy.rentTrend}`}
                    color={config.color}
                  />
                </div>
              ) : <p className="empty-chart" role="status">{copy.rentChartUnavailable}</p>}
            </div>

            <div className="dataset-insights">
              <div className="rent-scope-note"><span aria-hidden="true">i</span><p><strong>{copy.rentScopeTitle}</strong>{copy.rentScopeText}</p></div>
              <div className="stat-grid rent-stat-grid">
                <StatCard label={copy.averageMonthlyRent} value={currency(latestValue)} detail={latestRow ? formatRefDate(latestRow[config.columns.date], language) : copy.noData} />
                <StatCard label={copy.annualDollarChange} value={currency(dollarChange, true)} detail={copy.comparedWithPreviousYear} tone={getTone(dollarChange)} />
                <StatCard label={copy.annualPercentageChange} value={percentage(percentChange)} detail={copy.comparedWithPreviousYear} tone={getTone(percentChange)} />
                <StatCard label={copy.latestObservation} value={latestRow ? String(latestRow[config.columns.date]) : '—'} detail={selectedCategory} />
              </div>
              <div className="insight-summary rent-insight-summary"><span aria-hidden="true">↗</span><p>{copy.rentChangeNote}</p></div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function RentSelect({ id, label, value, options, onChange, wide = false, disabledOptions = [] }) {
  return (
    <div className={`filter-control${wide ? ' filter-control-wide' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} disabled={disabledOptions.includes(option)}>{option}</option>)}
      </select>
    </div>
  )
}

function pinFirst(options, preferred) {
  return options.includes(preferred) ? [preferred, ...options.filter((option) => option !== preferred)] : options
}

function getTone(value) {
  if (!Number.isFinite(value) || value === 0) return 'neutral'
  return value > 0 ? 'increase' : 'decrease'
}
