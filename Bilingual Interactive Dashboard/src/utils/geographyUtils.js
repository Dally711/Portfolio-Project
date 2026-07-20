export const CANADIAN_REGIONS = [
  'Newfoundland and Labrador',
  'Prince Edward Island',
  'Nova Scotia',
  'New Brunswick',
  'Quebec',
  'Ontario',
  'Manitoba',
  'Saskatchewan',
  'Alberta',
  'British Columbia',
  'Yukon',
  'Northwest Territories',
  'Nunavut',
]

const aliases = {
  'Newfoundland and Labrador': ['newfoundland and labrador', 'terre neuve et labrador', 'nl'],
  'Prince Edward Island': ['prince edward island', 'ile du prince edouard', 'pei', 'pe'],
  'Nova Scotia': ['nova scotia', 'nouvelle ecosse', 'ns'],
  'New Brunswick': ['new brunswick', 'nouveau brunswick', 'nb'],
  Quebec: ['quebec', 'qc', 'pq'],
  Ontario: ['ontario', 'on'],
  Manitoba: ['manitoba', 'mb'],
  Saskatchewan: ['saskatchewan', 'sk'],
  Alberta: ['alberta', 'ab'],
  'British Columbia': ['british columbia', 'colombie britannique', 'bc'],
  Yukon: ['yukon', 'yt'],
  'Northwest Territories': ['northwest territories', 'north west territories', 'territoires du nord ouest', 'nwt', 'nt'],
  Nunavut: ['nunavut', 'nu'],
}

// CMHC Table 1.0 groups these named centres beneath province aggregates. Keeping
// only workbook-present centres makes city dropdowns synchronize with the map.
const cmhcCentreRegions = {
  'st john s cma': 'Newfoundland and Labrador',
  'charlottetown ca': 'Prince Edward Island',
  'halifax cma': 'Nova Scotia',
  'fredericton cma': 'New Brunswick', 'moncton cma': 'New Brunswick', 'saint john cma': 'New Brunswick',
  'saguenay cma': 'Quebec', 'drummondville cma': 'Quebec', 'montreal cma': 'Quebec',
  'ottawa gatineau cma que part': 'Quebec', 'quebec cma': 'Quebec', 'sherbrooke cma': 'Quebec', 'trois rivieres cma': 'Quebec',
  'barrie cma': 'Ontario', 'belleville quinte west cma': 'Ontario', 'brantford cma': 'Ontario',
  'guelph cma': 'Ontario', 'hamilton cma': 'Ontario', 'kingston cma': 'Ontario',
  'kitchener cambridge waterloo cma': 'Ontario', 'london cma': 'Ontario', 'st catharines niagara cma': 'Ontario',
  'oshawa cma': 'Ontario', 'ottawa gatineau cma ont part': 'Ontario', 'peterborough cma': 'Ontario',
  'greater sudbury grand sudbury cma': 'Ontario', 'thunder bay cma': 'Ontario', 'toronto cma': 'Ontario', 'windsor cma': 'Ontario',
  'winnipeg cma': 'Manitoba', 'regina cma': 'Saskatchewan', 'saskatoon cma': 'Saskatchewan',
  'calgary cma': 'Alberta', 'edmonton cma': 'Alberta', 'lethbridge cma': 'Alberta', 'red deer cma': 'Alberta',
  'abbotsford mission cma': 'British Columbia', 'chilliwack cma': 'British Columbia', 'kamloops cma': 'British Columbia',
  'kelowna cma': 'British Columbia', 'nanaimo cma': 'British Columbia', 'vancouver cma': 'British Columbia', 'victoria cma': 'British Columbia',
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function getMapRegionName(properties = {}) {
  const bilingualName = properties.PRNAME ?? properties.name ?? properties.NAME ?? ''
  return normalizeGeographyName(String(bilingualName).split(' / ')[0])
}

export function normalizeGeographyName(value) {
  const normalized = normalizeText(value)
  if (!normalized) return ''
  if (normalized === 'canada' || normalized.startsWith('canada ')) return 'Canada'
  if (cmhcCentreRegions[normalized]) return cmhcCentreRegions[normalized]

  // Ottawa-Gatineau rows explicitly identify which provincial portion they use.
  if (normalized.includes('ontario part')) return 'Ontario'
  if (normalized.includes('quebec part')) return 'Quebec'

  return CANADIAN_REGIONS.find((region) => aliases[region].some((alias) => {
    const normalizedAlias = normalizeText(alias)
    return normalized === normalizedAlias
      || normalized.startsWith(`${normalizedAlias} `)
      || normalized.endsWith(` ${normalizedAlias}`)
      || normalized.includes(` ${normalizedAlias} `)
  })) ?? ''
}

export function isProvinceLevelGeography(value, region) {
  return normalizeText(value) === normalizeText(region)
}

export function resolveDatasetGeography(options, sharedGeography, preferredGeography) {
  if (options.includes(sharedGeography)) return sharedGeography

  const targetRegion = normalizeGeographyName(sharedGeography)
  if (targetRegion && targetRegion !== 'Canada') {
    const matchingOptions = options.filter((option) => normalizeGeographyName(option) === targetRegion)
    if (matchingOptions.includes(preferredGeography)) return preferredGeography
    const exactProvince = matchingOptions.find((option) => isProvinceLevelGeography(option, targetRegion))
    const officialRegionalAggregate = matchingOptions.find((option) => /10,000\+$/.test(option))
    return exactProvince ?? officialRegionalAggregate ?? matchingOptions[0] ?? ''
  }

  if (sharedGeography === 'Canada') {
    return options.find((option) => normalizeGeographyName(option) === 'Canada') ?? ''
  }
  return options.includes(preferredGeography) ? preferredGeography : (options[0] ?? '')
}
