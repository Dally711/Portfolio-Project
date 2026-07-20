# Bilingual Interactive Dashboard

A focused single-page React dashboard for SEG 3125 Assignment 5. It explores Canadian grocery prices, inflation, housing, rent, and gas prices through two required chart types.

## Run locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Main visualizations

- Line chart: explores a selected metric over time using geography, category, and date controls.
- Horizontal bar chart: compares the selected metric across Canadian regions and supports sorting.

## Local data

The dashboard reads and caches these browser-side CSV files with Papa Parse:

- `public/data/grocery-prices.csv`
- `public/data/inflation.csv`
- `public/data/housing.csv`
- `public/data/rent-data.csv`
- `public/data/gas.csv`

No backend, live API, synthetic data, or placeholder chart values are used. Where an official Canada or province series is unavailable, the interface clearly describes its simple unweighted local average.

## Technology

- React and Vite
- Bootstrap with custom CSS
- Papa Parse
- Chart.js and react-chartjs-2
- Central English/French translation resources and `Intl` formatting
