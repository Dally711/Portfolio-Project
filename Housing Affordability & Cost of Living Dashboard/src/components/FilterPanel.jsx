import { useId, useMemo, useState } from 'react'

export default function FilterPanel({
  copy,
  geographies,
  geography,
  onGeographyChange,
  categories,
  category,
  onCategoryChange,
  categoryLabel,
  allOptionValue,
  geographySearchable = false,
  categorySearchable = false,
  searchLabel,
  searchPlaceholder,
  startDate,
  endDate,
  minDate,
  maxDate,
  onStartDateChange,
  onEndDateChange,
}) {
  const idPrefix = useId()
  const [geographySearch, setGeographySearch] = useState('')
  const [categorySearch, setCategorySearch] = useState('')
  const normalizedGeographySearch = geographySearch.trim().toLocaleLowerCase()
  const normalizedSearch = categorySearch.trim().toLocaleLowerCase()

  const visibleGeographies = useMemo(() => {
    if (!geographySearchable || !normalizedGeographySearch) return geographies
    const matches = geographies.filter((option) => option.toLocaleLowerCase().includes(normalizedGeographySearch))
    return geography && !matches.includes(geography) ? [geography, ...matches] : matches
  }, [geographies, geography, geographySearchable, normalizedGeographySearch])

  const matchingGeographyCount = normalizedGeographySearch
    ? geographies.filter((option) => option.toLocaleLowerCase().includes(normalizedGeographySearch)).length
    : geographies.length

  const visibleCategories = useMemo(() => {
    if (!categorySearchable || !normalizedSearch) return categories

    const matches = categories.filter((option) => (
      option === allOptionValue || option.toLocaleLowerCase().includes(normalizedSearch)
    ))

    // Keep the active product in the select even when it does not match the
    // current query, preventing the browser from displaying an empty selection.
    return category && !matches.includes(category) ? [category, ...matches] : matches
  }, [categories, category, normalizedSearch, categorySearchable, allOptionValue])

  const matchingCategoryCount = normalizedSearch
    ? categories.filter((option) => option !== allOptionValue && option.toLocaleLowerCase().includes(normalizedSearch)).length
    : categories.filter((option) => option !== allOptionValue).length

  return (
    <form
      className={`filter-panel${categorySearchable ? ' filter-panel-searchable' : ''}${geographySearchable ? ' filter-panel-geography-searchable' : ''}`}
      onSubmit={(event) => event.preventDefault()}
    >
      {geographySearchable && geographies.length > 0 && (
        <div className="filter-control filter-control-wide">
          <label htmlFor={`${idPrefix}-geography-search`}>{copy.searchLocations}</label>
          <input
            id={`${idPrefix}-geography-search`}
            type="search"
            value={geographySearch}
            placeholder={copy.searchLocationsPlaceholder}
            onChange={(event) => setGeographySearch(event.target.value)}
          />
          {geographySearch.trim() && (
            <span className="filter-result-count" aria-live="polite">
              {matchingGeographyCount} {copy.locationMatches}
            </span>
          )}
        </div>
      )}

      <div className="filter-control">
        <label htmlFor={`${idPrefix}-geography`}>{copy.geography}</label>
        <select
          id={`${idPrefix}-geography`}
          value={geography}
          onChange={(event) => onGeographyChange(event.target.value)}
        >
          {visibleGeographies.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      {categorySearchable && categories.length > 0 && (
        <div className="filter-control filter-control-wide">
          <label htmlFor={`${idPrefix}-search`}>{searchLabel}</label>
          <input
            id={`${idPrefix}-search`}
            type="search"
            value={categorySearch}
            placeholder={searchPlaceholder}
            onChange={(event) => setCategorySearch(event.target.value)}
          />
        </div>
      )}

      {categories.length > 0 && (
        <div className="filter-control filter-control-wide">
          <label htmlFor={`${idPrefix}-category`}>{categoryLabel}</label>
          <select
            id={`${idPrefix}-category`}
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            {visibleCategories.map((option) => (
              <option key={option} value={option}>
                {option === allOptionValue ? copy.allCategories : option}
              </option>
            ))}
          </select>
          {categorySearchable && categorySearch.trim() && (
            <span className="filter-result-count" aria-live="polite">
              {matchingCategoryCount} {copy.matches}
            </span>
          )}
        </div>
      )}

      <div className="filter-control">
        <label htmlFor={`${idPrefix}-start`}>{copy.from}</label>
        <input
          id={`${idPrefix}-start`}
          type="month"
          min={minDate}
          max={endDate || maxDate}
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
      </div>

      <div className="filter-control">
        <label htmlFor={`${idPrefix}-end`}>{copy.to}</label>
        <input
          id={`${idPrefix}-end`}
          type="month"
          min={startDate || minDate}
          max={maxDate}
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
        />
      </div>
    </form>
  )
}
