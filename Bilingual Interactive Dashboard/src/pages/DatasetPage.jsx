import { useCallback } from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import DatasetSection from '../components/DatasetSection'
import HousingHub from '../components/HousingHub'

export default function DatasetPage({ datasetId }) {
  const {
    copy, language, datasetConfigs, updateSummary, selectedGeography,
    setSelectedGeography, datasetFilters, updateDatasetFilters, rentConfig,
  } = useOutletContext()
  const config = datasetConfigs.find((item) => item.id === datasetId)
  const saveFilters = useCallback(
    (filters) => updateDatasetFilters(datasetId, filters),
    [datasetId, updateDatasetFilters],
  )

  if (!config) return <Navigate to="/" replace />

  return (
    <div className={`route-dataset-page dataset-story dataset-story-${config.id}`}>
      <div className="page-section">
        {config.id === 'housing' ? (
          <HousingHub
            housingConfig={config}
            rentConfig={rentConfig}
            language={language}
            copy={copy}
            onSummary={updateSummary}
            sharedGeography={selectedGeography}
            onGeographyChange={setSelectedGeography}
            datasetFilters={datasetFilters}
            updateDatasetFilters={updateDatasetFilters}
          />
        ) : (
          <DatasetSection
            config={config}
            language={language}
            copy={copy}
            onSummary={updateSummary}
            sharedGeography={selectedGeography}
            onGeographyChange={setSelectedGeography}
            savedFilters={datasetFilters[config.id]}
            onFiltersChange={saveFilters}
          />
        )}
      </div>
    </div>
  )
}
