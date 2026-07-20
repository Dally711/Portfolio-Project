import { CANADIAN_REGIONS, normalizeRegion } from './geographyUtils'

export function safeNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const number = typeof value === 'number' ? value : Number(String(value).replace(/,/g, '').trim())
  return Number.isFinite(number) ? number : null
}

export function unique(rows, column) {
  return [...new Set(rows.map((row) => row[column]).filter((value) => value !== null && value !== undefined && String(value).trim()).map(String))]
    .sort((a, b) => a.localeCompare(b))
}

export function pinFirst(options, preferred) {
  return options.includes(preferred) ? [preferred, ...options.filter((option) => option !== preferred)] : options
}

export function averageByDate(rows, config) {
  const groups = new Map()
  rows.forEach((row) => {
    const value = safeNumber(row[config.value])
    const date = String(row[config.date] ?? '')
    // Zero-dollar rent observations are not meaningful market prices.
    if (!date || value === null || (config.id === 'rent' && value <= 0)) return
    const group = groups.get(date) ?? { total: 0, count: 0, row }
    group.total += value
    group.count += 1
    groups.set(date, group)
  })
  return [...groups.entries()].map(([date, group]) => ({
    ...group.row, [config.date]: date, [config.value]: group.total / group.count,
  })).sort((a, b) => String(a[config.date]).localeCompare(String(b[config.date])))
}

function categoryRows(rows, config, category, structure) {
  return rows.filter((row) => String(row[config.category]) === category
    && (!config.structure || String(row[config.structure]) === structure))
}

export function buildSeries(rows, config, geography, category, structure) {
  const relevant = categoryRows(rows, config, category, structure)
  const exact = relevant.filter((row) => String(row[config.geography]) === geography)
  if (exact.length) return averageByDate(exact, config)

  // Province and Canada selections fall back to transparent unweighted local averages.
  const regional = geography === 'Canada'
    ? relevant
    : relevant.filter((row) => normalizeRegion(row[config.geography]) === geography)
  return averageByDate(regional, config)
}

export function filterSeriesByDate(series, config, startDate, endDate) {
  return series.filter((row) => {
    const date = String(row[config.date])
    return (!startDate || date >= startDate) && (!endDate || date <= endDate)
  })
}

export function buildRegionalComparison(rows, config, category, structure, endDate) {
  const relevant = categoryRows(rows, config, category, structure)
  return CANADIAN_REGIONS.map((region) => {
    const exact = relevant.filter((row) => String(row[config.geography]) === region)
    const candidates = exact.length ? exact : relevant.filter((row) => normalizeRegion(row[config.geography]) === region)
    const series = averageByDate(candidates, config).filter((row) => !endDate || String(row[config.date]) <= endDate)
    const latest = series.at(-1)
    return latest ? { region, date: String(latest[config.date]), value: safeNumber(latest[config.value]) } : null
  }).filter(Boolean)
}

export function latestAndChange(series, config) {
  const valid = series.filter((row) => safeNumber(row[config.value]) !== null)
  const latest = valid.at(-1)
  const previous = valid.at(-2)
  if (!latest) return null
  const value = safeNumber(latest[config.value])
  const previousValue = previous ? safeNumber(previous[config.value]) : null
  return {
    value, date: String(latest[config.date]), unit: latest[config.unit],
    change: previousValue === null ? null : value - previousValue,
    percentChange: previousValue ? ((value - previousValue) / previousValue) * 100 : null,
  }
}

export function formatDate(value, language) {
  const match = String(value ?? '').match(/^(\d{4})(?:-(\d{2}))?$/)
  if (!match) return String(value ?? '—')
  if (!match[2]) return match[1]
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1)))
}

export function formatValue(value, config, language, signed = false) {
  if (!Number.isFinite(value)) return '—'
  const locale = language === 'fr' ? 'fr-CA' : 'en-CA'
  const sign = signed && value > 0 ? '+' : ''
  const digits = config.valueKind === 'currency' ? 0 : 1
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value)
  if (config.valueKind === 'currency') return language === 'fr' ? `${sign}${number} $` : `${sign}$${number}`
  if (config.valueKind === 'gas') return `${sign}${number} ¢/L`
  return `${sign}${number}`
}
