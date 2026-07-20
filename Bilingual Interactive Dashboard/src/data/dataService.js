import Papa from 'papaparse'

const cache = new Map()

export async function loadCsv(path) {
  // Cache the in-flight request too, preventing duplicate parsing in React Strict Mode.
  if (cache.has(path)) return cache.get(path)

  const request = (async () => {
    const response = await fetch(path)
    if (!response.ok) throw new Error(`Unable to load ${path} (${response.status})`)

    const result = Papa.parse(await response.text(), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    })
    const seriousError = result.errors.find((error) => error.code !== 'UndetectableDelimiter')
    if (seriousError) throw new Error(`Unable to parse ${path}: ${seriousError.message}`)
    if (!result.meta.fields?.length) throw new Error(`No headers were detected in ${path}`)

    if (import.meta.env.DEV) console.info(`[CSV] ${path}`, result.meta.fields)
    return result.data
  })()

  cache.set(path, request)
  try {
    return await request
  } catch (error) {
    // A failed request is removed so the visible retry action can try again.
    cache.delete(path)
    throw error
  }
}

export const loaders = {
  grocery: () => loadCsv('/data/grocery-prices.csv'),
  inflation: () => loadCsv('/data/inflation.csv'),
  rent: () => loadCsv('/data/rent-data.csv'),
  gas: () => loadCsv('/data/gas.csv'),
}
