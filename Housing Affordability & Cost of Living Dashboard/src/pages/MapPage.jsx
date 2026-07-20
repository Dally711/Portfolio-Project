import { useOutletContext } from 'react-router-dom'
import CanadaMapSection from '../components/map/CanadaMapSection'

export default function MapPage() {
  const { copy, language, datasetConfigs, selectedGeography, setSelectedGeography } = useOutletContext()
  return (
    <CanadaMapSection
      copy={copy}
      language={language}
      datasetConfigs={datasetConfigs}
      selectedGeography={selectedGeography}
      onGeographyChange={setSelectedGeography}
    />
  )
}

