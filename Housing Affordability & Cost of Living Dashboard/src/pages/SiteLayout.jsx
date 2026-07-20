import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { loadGasData, loadGroceryData, loadHousingData, loadInflationData, loadRentData } from '../data/dataService'
import { datasetColumns } from '../utils/dataUtils'
import { RENT_BEDROOM_TYPE, RENT_STRUCTURE_TYPE, rentColumns } from '../utils/rentDataUtils'
import { siteCopy } from '../data/siteCopy'

export default function SiteLayout() {
  const [language, setLanguage] = useState('en')
  const [summaries, setSummaries] = useState({})
  const [selectedGeography, setSelectedGeography] = useState('Canada')
  const [datasetFilters, setDatasetFilters] = useState({})
  const location = useLocation()
  const copy = siteCopy[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = copy.heroTitle
  }, [language, copy.heroTitle])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  const links = useMemo(() => [
    { to: '/', label: copy.overview },
    { to: '/grocery', label: copy.grocery },
    { to: '/inflation', label: copy.inflation },
    { to: '/housing', label: copy.housing },
    { to: '/gas', label: copy.gas },
    { to: '/map', label: copy.map },
    { to: '/about', label: copy.about },
  ], [copy])

  const datasetConfigs = useMemo(() => [
    {
      id: 'grocery', number: '01', title: copy.grocery, description: copy.groceryDescription,
      cardDescription: copy.groceryCardText, categoryLabel: copy.product, loader: loadGroceryData,
      columns: datasetColumns.grocery, color: '#276749', enableCategorySearch: true, layout: 'split',
      preferredGeography: 'Canada', preferredCategory: 'Milk, 2 litres',
    },
    {
      id: 'inflation', number: '02', title: copy.inflation, description: copy.inflationDescription,
      cardDescription: copy.inflationCardText, categoryLabel: copy.cpiCategory, loader: loadInflationData,
      columns: datasetColumns.inflation, color: '#df7842', usePercentageChange: true,
      showYearOverYear: true, enableOverallAverage: false, layout: 'reverse',
      preferredGeography: 'Canada', preferredCategory: 'All-items',
    },
    {
      id: 'housing', number: '03', title: copy.housing, description: copy.housingDescription,
      cardDescription: copy.housingCardText, categoryLabel: copy.housingIndex, loader: loadHousingData,
      columns: datasetColumns.housing, color: '#335c46', layout: 'reverse',
      usePercentageChange: true, showYearOverYear: true, enableGeographySearch: true,
      preferredGeography: 'Canada', preferredCategory: 'Total (house and land)',
    },
    {
      id: 'gas', number: '04', title: copy.gas, description: copy.gasDescription,
      cardDescription: copy.gasCardText, categoryLabel: copy.fuelType, loader: loadGasData,
      columns: datasetColumns.gas, color: '#d99f2b', layout: 'reverse',
      preferredGeography: 'Calgary, Alberta', preferredCategory: 'Regular unleaded gasoline at self service filling stations',
    },
  ], [copy])

  const rentConfig = useMemo(() => ({
    id: 'rent', number: '03B', title: copy.rent, description: copy.rentDescription,
    cardDescription: copy.rentCardText, categoryLabel: copy.bedroomType, loader: loadRentData,
    columns: rentColumns, color: '#6f8f7d', layout: 'reverse', requireExactGeography: true,
    preferredGeography: 'Toronto, Ontario', preferredCategory: RENT_BEDROOM_TYPE,
    preferredStructure: RENT_STRUCTURE_TYPE,
  }), [copy])

  const updateSummary = useCallback((id, summary) => {
    setSummaries((current) => ({ ...current, [id]: summary }))
  }, [])

  const updateDatasetFilters = useCallback((id, filters) => {
    setDatasetFilters((current) => ({ ...current, [id]: { ...current[id], ...filters } }))
  }, [])

  return (
    <div className="website-shell">
      <Header language={language} onLanguageChange={setLanguage} links={links} copy={copy} />
      <main>
        <Outlet context={{
          copy,
          language,
          datasetConfigs,
          rentConfig,
          summaries,
          updateSummary,
          selectedGeography,
          setSelectedGeography,
          datasetFilters,
          updateDatasetFilters,
        }} />
      </main>
      <Footer links={links} copy={copy} />
    </div>
  )
}
