import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

export default function LineChart({ labels, values, datasetLabel, ariaLabel, color = '#1967d2' }) {
  const data = {
    labels,
    datasets: [{
      label: datasetLabel,
      data: values,
      borderColor: color,
      backgroundColor: `${color}1a`,
      // Hide dense point markers so long monthly series remain readable.
      pointRadius: labels.length > 90 ? 0 : 2,
      pointHoverRadius: 5,
      borderWidth: 2.5,
      fill: true,
      tension: 0.15,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 450 },
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        backgroundColor: '#193c2b',
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: true, maxTicksLimit: 10, maxRotation: 0, color: '#68736c' },
      },
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(25, 60, 43, 0.1)' },
        ticks: { color: '#68736c' },
      },
    },
  }

  return <Line data={data} options={options} role="img" aria-label={ariaLabel} />
}
