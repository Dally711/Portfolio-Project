const frenchGasCategories = {
  'Diesel fuel at full service filling stations': 'Carburant diesel aux stations-service avec service complet',
  'Diesel fuel at self service filling stations': 'Carburant diesel aux stations-service libre-service',
  'Household heating fuel': 'Mazout de chauffage domestique',
  'Premium unleaded gasoline at full service filling stations': 'Essence super sans plomb aux stations-service avec service complet',
  'Premium unleaded gasoline at self service filling stations': 'Essence super sans plomb aux stations-service libre-service',
  'Regular unleaded gasoline at full service filling stations': 'Essence ordinaire sans plomb aux stations-service avec service complet',
  'Regular unleaded gasoline at self service filling stations': 'Essence ordinaire sans plomb aux stations-service libre-service',
}

const frenchRegions = {
  Canada: 'Canada',
  Alberta: 'Alberta',
  'British Columbia': 'Colombie-Britannique',
  Manitoba: 'Manitoba',
  'New Brunswick': 'Nouveau-Brunswick',
  'Newfoundland and Labrador': 'Terre-Neuve-et-Labrador',
  'Northwest Territories': 'Territoires du Nord-Ouest',
  'Nova Scotia': 'Nouvelle-Écosse',
  Nunavut: 'Nunavut',
  Ontario: 'Ontario',
  'Prince Edward Island': 'Île-du-Prince-Édouard',
  Quebec: 'Québec',
  Saskatchewan: 'Saskatchewan',
  Yukon: 'Yukon',
  'Calgary, Alberta': 'Calgary, Alberta',
  'Charlottetown and Summerside, Prince Edward Island': 'Charlottetown et Summerside, Île-du-Prince-Édouard',
  'Edmonton, Alberta': 'Edmonton, Alberta',
  'Halifax, Nova Scotia': 'Halifax, Nouvelle-Écosse',
  'Montréal, Quebec': 'Montréal, Québec',
  'Ottawa-Gatineau, Ontario part, Ontario/Quebec': 'Ottawa-Gatineau, partie ontarienne, Ontario/Québec',
  'Québec, Quebec': 'Québec, Québec',
  'Regina, Saskatchewan': 'Regina, Saskatchewan',
  'Saint John, New Brunswick': 'Saint John, Nouveau-Brunswick',
  'Saskatoon, Saskatchewan': 'Saskatoon, Saskatchewan',
  "St. John's, Newfoundland and Labrador": 'St. John’s, Terre-Neuve-et-Labrador',
  'Thunder Bay, Ontario': 'Thunder Bay, Ontario',
  'Toronto, Ontario': 'Toronto, Ontario',
  'Vancouver, British Columbia': 'Vancouver, Colombie-Britannique',
  'Victoria, British Columbia': 'Victoria, Colombie-Britannique',
  'Whitehorse, Yukon': 'Whitehorse, Yukon',
  'Winnipeg, Manitoba': 'Winnipeg, Manitoba',
  'Yellowknife, Northwest Territories': 'Yellowknife, Territoires du Nord-Ouest',
}

export function translateDataValue(metric, field, value, language) {
  // Values remain unchanged in the CSV; only their visible labels are localized.
  if (language !== 'fr' || !value) return value
  if (metric === 'gas' && field === 'category') return frenchGasCategories[value] ?? value
  if (metric === 'gas' && field === 'geography') return frenchRegions[value] ?? value
  return value
}
