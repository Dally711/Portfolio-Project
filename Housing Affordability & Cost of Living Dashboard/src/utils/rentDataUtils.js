// Mapping confirmed from rent-data.csv. The table is city/market based and does
// not contain Canada or province aggregates.
export const rentColumns = {
  date: 'REF_DATE',
  geography: 'GEO',
  category: 'Type of unit',
  structure: 'Type of structure',
  value: 'VALUE',
  unit: 'UOM',
}

export const RENT_BEDROOM_TYPE = 'Two bedroom units'
export const RENT_STRUCTURE_TYPE = 'Row and apartment structures of three units and over'
