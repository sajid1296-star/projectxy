'use client'

import { useState, useEffect } from 'react'
import axios from '@/services/api'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    dailyRevenue: [],
    topProducts: [],
  })

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/orders/statistics')
      setStats(response.data)
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error)
    }
  }

  const revenueData = {
    labels: stats.dailyRevenue.map((day: any) => day.date),
    datasets: [
      {
        label: 'Tagesumsatz',
        data: stats.dailyRevenue.map((day: any) => day.revenue),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  const topProductsData = {
    labels: stats.topProducts.map((product: any) => product.name),
    datasets: [
      {
        label: 'Verkaufte Einheiten',
        data: stats.topProducts.map((product: any) => product.quantity),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Übersichtskarten */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gesamtumsatz
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalSales.toFixed(2)}€
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bestellungen
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Durchschnittlicher Bestellwert
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.averageOrderValue.toFixed(2)}€
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grafiken */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Umsatzentwicklung</h3>
          <div className="h-80">
            <Line data={revenueData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Produkte</h3>
          <div className="h-80">
            <Bar data={topProductsData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  )
} 