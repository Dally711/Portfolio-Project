import Papa from 'papaparse'

const datasetCache = new Map()

export async function loadCsv(path) {
  // Cache the in-flight promise as well as the result so rapid repeated requests
  // cannot start two downloads of the same large CSV file.
  if (datasetCache.has(path)) {
    return datasetCache.get(path)
  }

  const request = (async () => {
    let response

    try {
      response = await fetch(path)
    } catch (error) {
      throw new Error(`Unable to request ${path}: ${error.message}`, { cause: error })
    }

    if (!response.ok) {
      throw new Error(`Unable to load ${path} (${response.status} ${response.statusText})`)
    }

    let csvText

    try {
      csvText = await response.text()
    } catch (error) {
      throw new Error(`Unable to read ${path}: ${error.message}`, { cause: error })
    }

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    })

    // Papa Parse may report an undetectable delimiter for empty input. Empty or
    // malformed datasets are handled explicitly below, while real row errors fail.
    const seriousErrors = parsed.errors.filter(
      (error) => error.code !== 'UndetectableDelimiter',
    )

    if (seriousErrors.length > 0) {
      const firstError = seriousErrors[0]
      throw new Error(
        `Unable to parse ${path}: ${firstError.message} (row ${firstError.row ?? 'unknown'})`,
      )
    }

    if (!parsed.meta.fields?.length) {
      throw new Error(`Unable to parse ${path}: no CSV headers were detected`)
    }

    if (import.meta.env.DEV) {
      console.info(`[CSV] ${path} headers:`, parsed.meta.fields)
    }

    return parsed.data
  })()

  datasetCache.set(path, request)

  try {
    return await request
  } catch (error) {
    // Failed requests are removed so the interface's retry action can try again.
    datasetCache.delete(path)
    throw error
  }
}

export const loadGroceryData = () => loadCsv('/data/grocery-prices.csv')
export const loadInflationData = () => loadCsv('/data/inflation.csv')
export const loadHousingData = () => loadCsv('/data/housing.csv')
export const loadGasData = () => loadCsv('/data/gas.csv')
export const loadRentData = () => loadCsv('/data/rent-data.csv')
