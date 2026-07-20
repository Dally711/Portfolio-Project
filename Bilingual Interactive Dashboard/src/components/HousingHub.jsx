import { useCallback, useState } from 'react'
import DatasetSection from './DatasetSection'
import RentSection from './RentSection'

export default function HousingHub({
  housingConfig, rentConfig, language, copy, onSummary, sharedGeography,
  onGeographyChange, datasetFilters, updateDatasetFilters,
}) {
  const [activeView, setActiveView] = useState('prices')
  const saveHousingFilters = useCallback(
    (filters) => updateDatasetFilters(housingConfig.id, filters),
    [housingConfig.id, updateDatasetFilters],
  )
  const saveRentFilters = useCallback(
    (filters) => updateDatasetFilters(rentConfig.id, filters),
    [rentConfig.id, updateDatasetFilters],
  )

  return (
    <>
      <div
        id={activeView === 'prices' ? 'house-prices-panel' : 'rental-market-panel'}
        role="tabpanel"
        aria-labelledby={activeView === 'prices' ? 'house-prices-tab' : 'rental-market-tab'}
      >
        {activeView === 'prices' ? (
          <DatasetSection
            config={housingConfig}
            language={language}
            copy={copy}
            onSummary={onSummary}
            sharedGeography={sharedGeography}
            onGeographyChange={onGeographyChange}
            savedFilters={datasetFilters[housingConfig.id]}
            onFiltersChange={saveHousingFilters}
            headingControl={<HousingViewTabs activeView={activeView} setActiveView={setActiveView} copy={copy} />}
          />
        ) : (
          <RentSection
            config={rentConfig}
            language={language}
            copy={copy}
            onSummary={onSummary}
            sharedGeography={sharedGeography}
            onGeographyChange={onGeographyChange}
            savedFilters={datasetFilters[rentConfig.id]}
            onFiltersChange={saveRentFilters}
            headingControl={<HousingViewTabs activeView={activeView} setActiveView={setActiveView} copy={copy} />}
          />
        )}
      </div>
    </>
  )
}

function HousingViewTabs({ activeView, setActiveView, copy }) {
  return (
    <nav className="housing-subnav" aria-label={copy.housingViews}>
      <div role="tablist" aria-label={copy.housingViews}>
        <button
          type="button"
          role="tab"
          id="house-prices-tab"
          aria-selected={activeView === 'prices'}
          aria-controls="house-prices-panel"
          className={activeView === 'prices' ? 'is-active' : ''}
          onClick={() => setActiveView('prices')}
        >
          {copy.housePrices}
        </button>
        <button
          type="button"
          role="tab"
          id="rental-market-tab"
          aria-selected={activeView === 'rent'}
          aria-controls="rental-market-panel"
          className={activeView === 'rent' ? 'is-active' : ''}
          onClick={() => setActiveView('rent')}
        >
          {copy.rentalMarket}
        </button>
      </div>
    </nav>
  )
}
