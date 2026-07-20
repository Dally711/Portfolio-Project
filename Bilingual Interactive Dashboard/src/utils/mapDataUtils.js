import { CANADIAN_REGIONS, isProvinceLevelGeography, normalizeGeographyName } from './geographyUtils.js'
import { filterByCategory, removeInvalidRows, sortChronologically, toSafeNumber } from './dataUtils.js'

export function buildRegionalMetricData(rows, config) {
  const categoryRows = filterByCategory(rows, config.preferredCategory, config.columns.category)
  const validRows = removeInvalidRows(categoryRows, config.columns)

  return CANADIAN_REGIONS.map((region) => {
    const regionRows = validRows.filter(
      (row) => normalizeGeographyName(row[config.columns.geography]) === region,
    )
    // Official province rows are more comparable than a mix of province and city
    // rows. City observations are averaged only when no province row exists.
    const provinceRows = regionRows.filter(
      (row) => isProvinceLevelGeography(row[config.columns.geography], region)
        || Boolean(config.columns.isRegionalAggregate && row[config.columns.isRegionalAggregate]),
    )
    const sourceRows = provinceRows.length ? provinceRows : regionRows
    const series = averageRegionalRowsByDate(sourceRows, config.columns)
    const latest = series.at(-1)
    const previous = series.at(-2)
    const change = latest && previous && previous.value !== 0
      ? ((latest.value - previous.value) / previous.value) * 100
      : null

    return {
      region,
      value: latest?.value ?? null,
      date: latest?.date ?? '',
      unit: latest?.unit ?? '',
      change,
      difference: latest && previous ? latest.value - previous.value : null,
      observationCount: latest?.count ?? 0,
      isRegionalAverage: !provinceRows.length && sourceRows.length > 0,
    }
  })
}

function averageRegionalRowsByDate(rows, columns) {
  const grouped = new Map()

  rows.forEach((row) => {
    const date = String(row[columns.date] ?? '')
    const value = toSafeNumber(row[columns.value])
    if (!date || value === null) return

    const current = grouped.get(date) ?? { total: 0, count: 0, unit: row[columns.unit] ?? '' }
    current.total += value
    current.count += 1
    grouped.set(date, current)
  })

  return sortChronologically(
    [...grouped].map(([date, group]) => ({
      [columns.date]: date,
      date,
      value: group.total / group.count,
      unit: group.unit,
      count: group.count,
    })),
    columns.date,
  )
}

export function getMetricDomain(regionalData) {
  const values = regionalData.map((item) => item.value).filter(Number.isFinite)
  if (!values.length) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  return min === max ? [min - 1, max + 1] : [min, max]
}
