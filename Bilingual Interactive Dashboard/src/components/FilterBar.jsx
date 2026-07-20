import { useMemo, useState } from 'react'
import { metricOrder } from '../data/datasetConfig'

export default function FilterBar({ copy, metric, setMetric, housingView, setHousingView, geography, setGeography, category, setCategory, structure, setStructure, startDate, setStartDate, endDate, setEndDate, geographyOptions, categoryOptions, structureOptions, dateOptions, formatDateOption, onReset }) {
  const [productSearch, setProductSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  // Searches narrow the existing CSV-derived options without creating new values.
  const searchedCategories = useMemo(() => filterOptions(categoryOptions, productSearch, category), [categoryOptions, productSearch, category])
  const searchedGeographies = useMemo(() => filterOptions(geographyOptions, locationSearch, geography), [geographyOptions, locationSearch, geography])
  const productMatchCount = useMemo(() => countMatches(categoryOptions, productSearch), [categoryOptions, productSearch])
  const locationMatchCount = useMemo(() => countMatches(geographyOptions, locationSearch), [geographyOptions, locationSearch])

  const clearSearches = () => {
    setProductSearch('')
    setLocationSearch('')
  }

  const handleMetricSelection = (nextMetric) => {
    clearSearches()
    setMetric(nextMetric)
  }

  const handleHousingSelection = (nextView) => {
    clearSearches()
    setHousingView(nextView)
  }

  const handleReset = () => {
    clearSearches()
    onReset()
  }

  return (
    <form className="filter-card card border-0" aria-label={copy.controls} onSubmit={(event) => event.preventDefault()}>
      <div className="row g-3 align-items-end">
        <SelectControl id="metric" label={copy.metric} value={metric} onChange={handleMetricSelection} options={metricOrder} getLabel={(option) => copy[option]} />
        {metric === 'housing' && housingView === 'rent' && <SearchControl id="location-search" label={copy.searchLocation} placeholder={copy.searchLocationPlaceholder} value={locationSearch} onChange={setLocationSearch} count={locationMatchCount} copy={copy} />}
        <SelectControl id="geography" label={copy.geography} value={geography} onChange={setGeography} options={metric === 'housing' && housingView === 'rent' ? searchedGeographies : geographyOptions} wide />
        {metric === 'grocery' && <SearchControl id="product-search" label={copy.searchProduct} placeholder={copy.searchProductPlaceholder} value={productSearch} onChange={setProductSearch} count={productMatchCount} copy={copy} />}
        <SelectControl id="category" label={copy.category} value={category} onChange={setCategory} options={metric === 'grocery' ? searchedCategories : categoryOptions} wide />
        {metric === 'housing' && housingView === 'rent' && <SelectControl id="structure" label={copy.structure} value={structure} onChange={setStructure} options={structureOptions} wide />}
        <SelectControl id="from" label={copy.from} value={startDate} onChange={setStartDate} options={dateOptions.filter((date) => !endDate || date <= endDate)} getLabel={formatDateOption} />
        <SelectControl id="to" label={copy.to} value={endDate} onChange={setEndDate} options={dateOptions.filter((date) => !startDate || date >= startDate)} getLabel={formatDateOption} />
        <div className="col-12 col-sm-auto ms-sm-auto">
          <button type="button" className="btn reset-button w-100" onClick={handleReset}>{copy.reset}</button>
        </div>
      </div>
      {metric === 'housing' && <fieldset className="housing-subsection">
        <legend className="visually-hidden">{copy.housingSection}</legend>
        <button type="button" className={housingView === 'house' ? 'active' : ''} aria-pressed={housingView === 'house'} onClick={() => handleHousingSelection('house')}>{copy.housePrices}</button>
        <button type="button" className={housingView === 'rent' ? 'active' : ''} aria-pressed={housingView === 'rent'} onClick={() => handleHousingSelection('rent')}>{copy.rent}</button>
      </fieldset>}
    </form>
  )
}

function SearchControl({ id, label, placeholder, value, onChange, count, copy }) {
  return <div className="col-12 col-sm-6 col-xl">
    <label className="form-label" htmlFor={id}>{label}</label>
    <input className="form-control filter-search" id={id} type="search" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    <small className="filter-match-count" aria-live="polite">{count} {copy.matches}</small>
  </div>
}

function filterOptions(options, search, selected) {
  const query = search.trim().toLocaleLowerCase()
  if (!query) return options
  const matches = options.filter((option) => option.toLocaleLowerCase().includes(query))
  return selected && !matches.includes(selected) ? [selected, ...matches] : matches
}

function countMatches(options, search) {
  const query = search.trim().toLocaleLowerCase()
  return query ? options.filter((option) => option.toLocaleLowerCase().includes(query)).length : options.length
}

function SelectControl({ id, label, value, onChange, options, getLabel = (option) => option, wide = false }) {
  return (
    <div className={`col-12 col-sm-6 ${wide ? 'col-xl' : 'col-xl-auto'}`}>
      <label className="form-label" htmlFor={id}>{label}</label>
      <select className="form-select" id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option value={option} key={option}>{getLabel(option)}</option>)}
      </select>
    </div>
  )
}
