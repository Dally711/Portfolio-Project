import {
  CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

export default function LineChart({ labels, values, label, color, locale, formatValue, xTitle, yTitle, ariaLabel }) {
  const options = {
    responsive: true, maintainAspectRatio: false, animation: { duration: 350 },
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false, backgroundColor: '#153f30', padding: 12, cornerRadius: 10,
        callbacks: { label: (context) => `${label}: ${formatValue(context.parsed.y)}` },
      },
    },
    scales: {
      x: { title: { display: true, text: xTitle }, grid: { display: false }, ticks: { maxTicksLimit: 9, maxRotation: 0, color: '#65736b' } },
      y: { title: { display: true, text: yTitle }, grid: { color: 'rgba(21,63,48,.1)' }, ticks: { color: '#65736b', callback: (value) => new Intl.NumberFormat(locale, { notation: 'compact' }).format(value) } },
    },
  }
  const data = { labels, datasets: [{ label, data: values, borderColor: color, backgroundColor: `${color}18`, borderWidth: 2.5, pointRadius: labels.length > 60 ? 0 : 2, pointHoverRadius: 5, fill: true, tension: 0.2 }] }
  return <Line data={data} options={options} role="img" aria-label={ariaLabel} />
}
