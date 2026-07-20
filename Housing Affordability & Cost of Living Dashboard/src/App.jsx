import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AboutPage from './pages/AboutPage'
import DatasetPage from './pages/DatasetPage'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import SiteLayout from './pages/SiteLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="grocery" element={<DatasetPage datasetId="grocery" />} />
          <Route path="inflation" element={<DatasetPage datasetId="inflation" />} />
          <Route path="housing" element={<DatasetPage datasetId="housing" />} />
          <Route path="rent" element={<Navigate to="/housing" replace />} />
          <Route path="gas" element={<DatasetPage datasetId="gas" />} />
          <Route path="map" element={<MapPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
