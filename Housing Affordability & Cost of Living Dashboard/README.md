# Housing Affordability & Cost of Living Dashboard

A bilingual React dashboard for exploring local Statistics Canada CSV datasets covering grocery prices, inflation, house prices, rental markets, and gas prices.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```bash
npm run build
```

## Data

The application reads these files from `public/data/` in the browser:

- `grocery-prices.csv`
- `inflation.csv`
- `housing.csv`
- `rent-data.csv`
- `gas.csv`

The Housing page contains separate House Prices and Rental Market views. Each CSV is fetched only when its corresponding page or subsection is first opened, and parsed data is cached in memory for the rest of the browser session. Rent remains part of Housing rather than becoming a fifth main dashboard category.

## Main libraries

- React and Vite
- Papa Parse
- Chart.js and react-chartjs-2

No backend or Statistics Canada API is used.
