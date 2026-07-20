// These mappings reflect the headers inspected in the primary local StatCan files.
// Keeping them dataset-specific avoids assuming that every table has one schema.
export const datasetColumns = {
  grocery: {
    date: 'REF_DATE',
    geography: 'GEO',
    category: 'Products',
    product: 'Products',
    value: 'VALUE',
    unit: 'UOM',
  },
  inflation: {
    date: 'REF_DATE',
    geography: 'GEO',
    category: 'Products and product groups',
    value: 'VALUE',
    unit: 'UOM',
  },
  housing: {
    date: 'REF_DATE',
    geography: 'GEO',
    category: 'New housing price indexes',
    value: 'VALUE',
    unit: 'UOM',
  },
  gas: {
    date: 'REF_DATE',
    geography: 'GEO',
    category: 'Type of fuel',
    product: 'Type of fuel',
    value: 'VALUE',
    unit: 'UOM',
  },
}

export const ALL_CATEGORIES = '__ALL_CATEGORIES__'

export function getUniqueValues(rows, column) {
  if (!column) return []

  return [...new Set(
    rows
      .map((row) => row[column])
      .filter((value) => value !== null && value !== undefined && String(value).trim() !== '')
      .map(String),
  )].sort((a, b) => a.localeCompare(b))
}

export function toSafeNumber(value) {
  // Suppressed StatCan values are commonly blank/null after Papa Parse runs.
  if (value === null || value === undefined || value === '') return null

  const number = typeof value === 'number'
    ? value
    : Number(String(value).replace(/,/g, '').trim())

  return Number.isFinite(number) ? number : null
}

export function removeInvalidRows(rows, columns) {
  return rows.filter((row) => {
    const date = row[columns.date]
    const value = toSafeNumber(row[columns.value])
    return date !== null && date !== undefined && String(date).trim() !== '' && value !== null
  })
}

export function averageRowsByDate(rows, columns) {
  const validRows = removeInvalidRows(rows, columns)
  const dateGroups = new Map()

  validRows.forEach((row) => {
    const date = String(row[columns.date])
    const value = toSafeNumber(row[columns.value])
    const current = dateGroups.get(date) ?? { sum: 0, count: 0, template: row }
    current.sum += value
    current.count += 1
    dateGroups.set(date, current)
  })

  // A new lightweight series is returned; source rows are never modified.
  return [...dateGroups.entries()].map(([date, group]) => ({
    ...group.template,
    [columns.date]: date,
    [columns.value]: group.sum / group.count,
    [columns.category]: ALL_CATEGORIES,
  }))
}

export function filterByGeography(rows, geography, column = 'GEO') {
  return geography ? rows.filter((row) => String(row[column]) === geography) : rows
}

export function filterByCategory(rows, category, column) {
  return category && column
    ? rows.filter((row) => String(row[column]) === category)
    : rows
}

export function filterByProduct(rows, product, column) {
  return filterByCategory(rows, product, column)
}

export function filterByDateRange(rows, startDate, endDate, column = 'REF_DATE') {
  return rows.filter((row) => {
    const date = String(row[column] ?? '')
    return (!startDate || date >= startDate) && (!endDate || date <= endDate)
  })
}

export function sortChronologically(rows, column = 'REF_DATE') {
  return [...rows].sort((a, b) => String(a[column]).localeCompare(String(b[column])))
}

export function formatRefDate(value, language = 'en') {
  if (!value) return '—'

  const match = String(value).match(/^(\d{4})(?:-(\d{2}))?$/)
  if (!match) return String(value)

  const year = Number(match[1])
  const month = match[2] ? Number(match[2]) - 1 : null
  if (month === null) return String(year)

  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month, 1)))
}

export function getLatestValue(rows, columns) {
  const sorted = sortChronologically(removeInvalidRows(rows, columns), columns.date)
  if (sorted.length === 0) return null

  const row = sorted.at(-1)
  return {
    value: toSafeNumber(row[columns.value]),
    date: row[columns.date],
    unit: columns.unit ? row[columns.unit] : '',
    row,
  }
}

export function calculateMonthlyDifference(rows, columns) {
  const sorted = sortChronologically(removeInvalidRows(rows, columns), columns.date)
  if (sorted.length < 2) return null

  const current = toSafeNumber(sorted.at(-1)[columns.value])
  const previous = toSafeNumber(sorted.at(-2)[columns.value])
  return current === null || previous === null ? null : current - previous
}

export function calculateYearlyDifference(rows, columns) {
  const pair = getYearComparison(rows, columns)
  return pair ? pair.current - pair.previous : null
}

export function calculateMonthOverMonthPercentageChange(rows, columns) {
  const sorted = sortChronologically(removeInvalidRows(rows, columns), columns.date)
  if (sorted.length < 2) return null

  const current = toSafeNumber(sorted.at(-1)[columns.value])
  const previous = toSafeNumber(sorted.at(-2)[columns.value])
  if (current === null || previous === null || previous === 0) return null

  return ((current - previous) / previous) * 100
}

export function calculateAverageMonthOverMonthPercentageChange(rows, columns) {
  const sorted = sortChronologically(removeInvalidRows(rows, columns), columns.date)
  const monthlyChanges = []

  for (let index = 1; index < sorted.length; index += 1) {
    const previousRow = sorted[index - 1]
    const currentRow = sorted[index]
    const previousDate = String(previousRow[columns.date])
    const currentDate = String(currentRow[columns.date])
    const previous = toSafeNumber(previousRow[columns.value])
    const current = toSafeNumber(currentRow[columns.value])

    // Only adjacent calendar months count as month-over-month comparisons;
    // gaps caused by missing or suppressed observations are skipped.
    if (!areConsecutiveMonths(previousDate, currentDate) || previous === 0) continue
    monthlyChanges.push(((current - previous) / previous) * 100)
  }

  if (!monthlyChanges.length) return null
  return monthlyChanges.reduce((total, change) => total + change, 0) / monthlyChanges.length
}

export function calculateYearOverYearPercentageChange(rows, columns) {
  const pair = getYearComparison(rows, columns)
  if (!pair || pair.previous === 0) return null
  return ((pair.current - pair.previous) / pair.previous) * 100
}

export function calculateAverageYearOverYearPercentageChange(rows, columns, startDate, endDate) {
  const sorted = sortChronologically(removeInvalidRows(rows, columns), columns.date)
  const rowsByDate = new Map(sorted.map((row) => [String(row[columns.date]), row]))
  const yearlyChanges = []

  sorted.forEach((currentRow) => {
    const currentDate = String(currentRow[columns.date])
    if ((startDate && currentDate < startDate) || (endDate && currentDate > endDate)) return
    const match = currentDate.match(/^(\d{4})(-\d{2})$/)
    if (!match) return

    const previousRow = rowsByDate.get(`${Number(match[1]) - 1}${match[2]}`)
    if (!previousRow) return

    const current = toSafeNumber(currentRow[columns.value])
    const previous = toSafeNumber(previousRow[columns.value])
    if (current === null || previous === null || previous === 0) return

    yearlyChanges.push(((current - previous) / previous) * 100)
  })

  if (!yearlyChanges.length) return null
  return yearlyChanges.reduce((total, change) => total + change, 0) / yearlyChanges.length
}

function getYearComparison(rows, columns) {
  const sorted = sortChronologically(removeInvalidRows(rows, columns), columns.date)
  if (sorted.length < 2) return null

  const latestRow = sorted.at(-1)
  const latestDate = String(latestRow[columns.date])
  const match = latestDate.match(/^(\d{4})(.*)$/)
  if (!match) return null

  // An exact matching period is required; a nearby observation is not treated
  // as year-over-year data when a month is missing.
  const targetDate = `${Number(match[1]) - 1}${match[2]}`
  const previousRow = sorted.find((row) => String(row[columns.date]) === targetDate)
  if (!previousRow) return null

  const current = toSafeNumber(latestRow[columns.value])
  const previous = toSafeNumber(previousRow[columns.value])
  return current === null || previous === null ? null : { current, previous }
}

function areConsecutiveMonths(previousDate, currentDate) {
  const previousMatch = previousDate.match(/^(\d{4})-(\d{2})$/)
  const currentMatch = currentDate.match(/^(\d{4})-(\d{2})$/)
  if (!previousMatch || !currentMatch) return false

  const previousIndex = Number(previousMatch[1]) * 12 + Number(previousMatch[2]) - 1
  const currentIndex = Number(currentMatch[1]) * 12 + Number(currentMatch[2]) - 1
  return currentIndex - previousIndex === 1
}

export function formatNumber(value, language = 'en', options = {}) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'

  return new Intl.NumberFormat(language === 'fr' ? 'fr-CA' : 'en-CA', {
    maximumFractionDigits: 2,
    ...options,
  }).format(value)
}

export function validateColumns(rows, columns) {
  if (!rows.length) throw new Error('The dataset is empty.')

  const headers = Object.values(columns).filter(Boolean)
  const missing = [...new Set(headers)].filter((header) => !(header in rows[0]))
  if (missing.length) {
    throw new Error(`Required CSV columns are missing: ${missing.join(', ')}`)
  }
}
