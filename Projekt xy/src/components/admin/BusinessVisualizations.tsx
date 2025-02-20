'use client'

import { useState, useEffect } from 'react'
import axios from '@/services/api'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Radar, Doughnut, Bubble } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
)

export default function BusinessVisualizations() {
  const [data, setData] = useState<any>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [timeRange])

  const fetchData = async () => {
    try {
      const response = await axios.get(`/analytics/business?timeRange=${timeRange}`)
      setData(response.data)
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !data) return <div>Laden...</div>

  const customerSegmentationData = {
    labels: data.customerSegments.map((segment: any) => segment.name),
    datasets: [{
      data: data.customerSegments.map((segment: any) => segment.value),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
      ]
    }]
  }

  const productPerformanceData = {
    labels: data.productPerformance.map((product: any) => product.name),
    datasets: [
      {
        label: 'Verkäufe',
        data: data.productPerformance.map((product: any) => ({
          x: product.price,
          y: product.revenue,
          r: product.quantity * 3
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Zeitraumauswahl */}
      <div className="flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm"
        >
          <option value="7d">7 Tage</option>
          <option value="30d">30 Tage</option>
          <option value="90d">90 Tage</option>
          <option value="1y">1 Jahr</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kundensegmentierung */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Kundensegmentierung
          </h3>
          <div className="h-80">
            <Doughnut 
              data={customerSegmentationData}
              options={{ maintainAspectRatio: false }} 
            />
          </div>
        </div>

        {/* Produktperformance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Produktperformance
          </h3>
          <div className="h-80">
            <Bubble 
              data={productPerformanceData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  x: { title: { display: true, text: 'Preis (€)' } },
                  y: { title: { display: true, text: 'Umsatz (€)' } }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  )
} 