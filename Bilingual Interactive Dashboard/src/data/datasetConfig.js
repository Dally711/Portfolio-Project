export const datasetConfigs = {
  grocery: {
    id: 'grocery', date: 'REF_DATE', geography: 'GEO', category: 'Products',
    value: 'VALUE', unit: 'UOM', preferredGeography: 'Canada', preferredCategory: 'Milk, 2 litres',
    color: '#c93232', valueKind: 'currency', frequency: 'monthly',
  },
  inflation: {
    id: 'inflation', date: 'REF_DATE', geography: 'GEO', category: 'Products and product groups',
    value: 'VALUE', unit: 'UOM', preferredGeography: 'Canada', preferredCategory: 'All-items',
    color: '#e36f3d', valueKind: 'index', frequency: 'monthly',
  },
  rent: {
    id: 'rent', date: 'REF_DATE', geography: 'GEO', category: 'Type of unit', structure: 'Type of structure',
    value: 'VALUE', unit: 'UOM', preferredGeography: 'Canada', preferredCategory: 'Two bedroom units',
    preferredStructure: 'Row and apartment structures of three units and over',
    color: '#527d68', valueKind: 'currency', frequency: 'annual',
  },
  gas: {
    id: 'gas', date: 'REF_DATE', geography: 'GEO', category: 'Type of fuel',
    value: 'VALUE', unit: 'UOM', preferredGeography: 'Canada',
    preferredCategory: 'Regular unleaded gasoline at self service filling stations',
    color: '#d49a25', valueKind: 'gas', frequency: 'monthly',
  },
}

export const metricOrder = ['grocery', 'inflation', 'rent', 'gas']
