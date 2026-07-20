import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { getMapRegionName } from '../../utils/geographyUtils'

// Version the local asset after compatibility processing so an older malformed
// GeoJSON response cannot remain stuck in the browser cache during development.
const MAP_FILE = '/maps/canada-provinces.json?v=2'

export default function CanadaMap({ regionalData, selectedRegion, colorScale, metricLabel, formatValue, onSelect, onPreview, onClearPreview }) {
  const byRegion = new Map(regionalData.map((item) => [item.region, item]))

  return (
    <ComposableMap
      className="canada-map-svg"
      projection="geoAzimuthalEqualArea"
      projectionConfig={{ rotate: [100, 0, 0], center: [0, 60], scale: 750 }}
      width={900}
      height={650}
      role="img"
      aria-label={metricLabel}
    >
      <Geographies geography={MAP_FILE}>
        {({ geographies }) => geographies.map((geography) => {
          const region = getMapRegionName(geography.properties)
          const datum = byRegion.get(region)
          const hasValue = Number.isFinite(datum?.value)
          const selected = selectedRegion === region
          const valueLabel = hasValue ? formatValue(datum.value) : 'unavailable'

          return (
            <Geography
              key={geography.rsmKey}
              geography={geography}
              className={`map-region${selected ? ' is-selected' : ''}`}
              tabIndex={0}
              role="button"
              aria-pressed={selected}
              aria-label={`${region}. ${metricLabel}: ${valueLabel}`}
              onMouseEnter={(event) => onPreview(datum, event)}
              onMouseMove={(event) => onPreview(datum, event)}
              onMouseLeave={onClearPreview}
              onFocus={(event) => onPreview(datum, event)}
              onBlur={onClearPreview}
              onClick={() => onSelect(region)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(region)
                }
              }}
              style={{
                default: {
                  fill: hasValue ? colorScale(datum.value) : '#d9ddd8',
                  stroke: selected ? '#ee7d43' : '#f8f5ee',
                  strokeWidth: selected ? 3 : 1.2,
                  outline: 'none',
                },
                hover: {
                  fill: hasValue ? colorScale(datum.value) : '#c8ceca',
                  stroke: '#173f30',
                  strokeWidth: 2,
                  outline: 'none',
                  cursor: 'pointer',
                },
                pressed: {
                  fill: hasValue ? colorScale(datum.value) : '#c8ceca',
                  stroke: '#ee7d43',
                  strokeWidth: 3,
                  outline: 'none',
                },
              }}
            />
          )
        })}
      </Geographies>
    </ComposableMap>
  )
}
