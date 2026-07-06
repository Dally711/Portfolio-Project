import { useState } from 'react'

// Sidebar controls for the faceted search experience.
export function ProductFilters({
  filterGroups,
  filters,
  onClearFilters,
  onPriceLimitChange,
  onToggleFilter,
  priceLimit,
}) {
  const filterLabels = {
    category: 'Categories',
    color: 'Colors',
    material: 'Materials',
    size: 'Sizes',
  }
  const filterOrder = ['category', 'color', 'material', 'size']
  const [openFilters, setOpenFilters] = useState({})

  // Toggle one filter section without unmounting its content, allowing smooth animation.
  function toggleDropdown(group) {
    setOpenFilters((current) => ({
      ...current,
      [group]: !current[group],
    }))
  }

  return (
    <aside className="filters" aria-label="Product filters">
      <div>
        <p className="section-kicker">Faceted search</p>
        <h2>Filter and sort</h2>
      </div>

      {filterOrder.map((group) => (
        <section className={`filter-dropdown ${openFilters[group] ? 'filter-open' : ''}`} key={group}>
          <button
            className="filter-summary"
            type="button"
            onClick={() => toggleDropdown(group)}
            aria-expanded={Boolean(openFilters[group])}
          >
            {filterLabels[group]}
          </button>
          <div className="filter-panel">
            <fieldset>
            {filterGroups[group].map((value) => (
              <label key={value} className="check-row">
                <input
                  type="checkbox"
                  checked={filters[group].includes(value)}
                  onChange={() => onToggleFilter(group, value)}
                />
                <span>{value}</span>
              </label>
            ))}
            </fieldset>
          </div>
        </section>
      ))}

      <section className={`filter-dropdown ${openFilters.price ? 'filter-open' : ''}`}>
        <button
          className="filter-summary"
          type="button"
          onClick={() => toggleDropdown('price')}
          aria-expanded={Boolean(openFilters.price)}
        >
          Price
        </button>
        <div className="filter-panel">
          <label className="range-control">
            <span>Maximum price: ${priceLimit}</span>
            <input
              type="range"
              min="28"
              max="120"
              value={priceLimit}
              onChange={(event) => onPriceLimitChange(Number(event.target.value))}
            />
          </label>
        </div>
      </section>

      <button type="button" className="quiet-button" onClick={onClearFilters}>
        Clear filters
      </button>
    </aside>
  )
}
