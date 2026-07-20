export const datasetConfigs = {
  grocery: {
    id: 'grocery', date: 'REF_DATE', geography: 'GEO', category: 'Products',
    value: 'VALUE', unit: 'UOM', preferredGeography: 'Canada', preferredCategory: 'Milk, 2 litres',
    color: '#c93232', valueKind: 'currency', decimals: 2, frequency: 'monthly',
  },
  inflation: {
    id: 'inflation', date: 'REF_DATE', geography: 'GEO', category: 'Products and product groups',
    value: 'VALUE', unit: 'UOM', preferredGeography: 'Canada', preferredCategory: 'All-items',
    color: '#e36f3d', valueKind: 'index', decimals: 1, frequency: 'monthly',
  },
  house: {
    id: 'house', date: 'REF_DATE', geography: 'GEO', category: 'New housing price indexes',
    value: 'VALUE', unit: 'UOM', preferredGeography: 'Canada', preferredCategory: 'Total (house and land)',
    color: '#527d68', valueKind: 'index', decimals: 1, frequency: 'monthly',
  },
  rent: {
    id: 'rent', date: 'REF_DATE', geography: 'GEO', category: 'Type of unit', structure: 'Type of structure',
    value: 'VALUE', unit: 'UOM', preferredGeography: 'Canada', preferredCategory: 'Two bedroom units',
    preferredStructure: 'Row and apartment structures of three units and over',
    color: '#527d68', valueKind: 'currency', decimals: 0, frequency: 'annual',
  },
  gas: {
    id: 'gas', date: 'REF_DATE', geography: 'GEO', category: 'Type of fuel',
    value: 'VALUE', unit: 'UOM', preferredGeography: 'Canada',
    preferredCategory: 'Regular unleaded gasoline at self service filling stations',
    color: '#d49a25', valueKind: 'gas', decimals: 1, frequency: 'monthly',
  },
}

// Housing is the public category; its filter reveals the house-price and rent datasets.
export const metricOrder = ['grocery', 'inflation', 'housing', 'gas']
