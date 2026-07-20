import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function BarChart({ labels, values, label, color, locale, formatValue, xTitle, ariaLabel }) {
  return <Bar role="img" aria-label={ariaLabel} data={{ labels, datasets: [{ label, data: values, backgroundColor: values.map((_, index) => index === 0 ? color : `${color}b8`), borderRadius: 7, borderSkipped: false }] }} options={{
    indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: { duration: 350 },
    plugins: { legend: { display: false }, tooltip: { displayColors: false, backgroundColor: '#153f30', callbacks: { label: (context) => `${label}: ${formatValue(context.parsed.x)}` } } },
    scales: {
      x: { title: { display: true, text: xTitle }, beginAtZero: false, grid: { color: 'rgba(21,63,48,.1)' }, ticks: { callback: (value) => new Intl.NumberFormat(locale, { notation: 'compact' }).format(value) } },
      y: { grid: { display: false }, ticks: { color: '#33483c', font: { size: 11, weight: 600 } } },
    },
  }} />
}
