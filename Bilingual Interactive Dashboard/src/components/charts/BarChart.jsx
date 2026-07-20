import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function BarChart({ labels, values, datasetLabel, ariaLabel, color = '#1967d2' }) {
  return (
    <Bar
      role="img"
      aria-label={ariaLabel}
      data={{ labels, datasets: [{ label: datasetLabel, data: values, backgroundColor: color }] }}
      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
    />
  )
}
