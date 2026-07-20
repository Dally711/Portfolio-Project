export const CANADIAN_REGIONS = [
  'Newfoundland and Labrador', 'Prince Edward Island', 'Nova Scotia', 'New Brunswick',
  'Quebec', 'Ontario', 'Manitoba', 'Saskatchewan', 'Alberta', 'British Columbia',
  'Yukon', 'Northwest Territories', 'Nunavut',
]

const aliases = {
  'Newfoundland and Labrador': ['newfoundland and labrador', 'terre neuve et labrador', 'nl'],
  'Prince Edward Island': ['prince edward island', 'ile du prince edouard', 'pei'],
  'Nova Scotia': ['nova scotia', 'nouvelle ecosse', 'ns'],
  'New Brunswick': ['new brunswick', 'nouveau brunswick', 'nb'],
  Quebec: ['quebec', 'qc'], Ontario: ['ontario', 'on'], Manitoba: ['manitoba', 'mb'],
  Saskatchewan: ['saskatchewan', 'sk'], Alberta: ['alberta', 'ab'],
  'British Columbia': ['british columbia', 'colombie britannique', 'bc'],
  Yukon: ['yukon', 'yt'],
  'Northwest Territories': ['northwest territories', 'territoires du nord ouest', 'nwt'],
  Nunavut: ['nunavut', 'nu'],
}

function normalize(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export function normalizeRegion(value) {
  const text = normalize(value)
  if (!text) return ''
  if (text === 'canada' || text.startsWith('canada ')) return 'Canada'
  if (text.includes('ontario part')) return 'Ontario'
  if (text.includes('quebec part')) return 'Quebec'

  return CANADIAN_REGIONS.find((region) => aliases[region].some((alias) => {
    const item = normalize(alias)
    return text === item || text.startsWith(`${item} `) || text.endsWith(` ${item}`) || text.includes(` ${item} `)
  })) ?? ''
}
