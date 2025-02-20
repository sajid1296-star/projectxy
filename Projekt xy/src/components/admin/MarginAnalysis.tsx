'use client'

import { useState, useEffect } from 'react'
import axios from '@/services/api'
import { Line, Bar } from 'react-chartjs-2'

type MarginData = {
  category: string
  averageMargin: number
  totalRevenue: number
  totalCost: number
  itemCount: number
}

type TrendData = {
  date: string
  margin: number
  revenue: number
}

export default function MarginAnalysis() {
  const [timeRange, setTimeRange] = useState('30d')
  const [categoryData, setCategoryData] = useState<MarginData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [timeRange])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoryResponse, trendResponse] = await Promise.all([
        axios.get(`/analytics/margins/category?timeRange=${timeRange}`),
        axios.get(`/analytics/margins/trend?timeRange=${timeRange}`)
      ])
      
      setCategoryData(categoryResponse.data)
      setTrendData(trendResponse.data)
    } catch (error) {
      console.error('Fehler beim Laden der Margendaten:', error)
    } finally {
      setLoading(false)
    }
  }

  const categoryChartData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        label: 'Durchschnittliche Marge (%)',
        data: categoryData.map(item => item.averageMargin * 100),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        yAxisID: 'y'
      },
      {
        label: 'Umsatz (€)',
        data: categoryData.map(item => item.totalRevenue),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        yAxisID: 'y1'
      }
    ]
  }

  const trendChartData = {
    labels: trendData.map(item => item.date),
    datasets: [
      {
        label: 'Marge (%)',
        data: trendData.map(item => item.margin * 100),
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.1,
        fill: false
      }
    ]
  }

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Margenanalyse</h2>
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

      {loading ? (
        <div>Laden...</div>
      ) : (
        <div className="space-y-8">
          {/* Zusammenfassung */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Durchschnittliche Marge
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {(categoryData.reduce((acc, curr) => 
                  acc + curr.averageMargin, 0) / categoryData.length * 100
                ).toFixed(1)}%
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Gesamtumsatz
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {categoryData.reduce((acc, curr) => 
                  acc + curr.totalRevenue, 0
                ).toFixed(2)}€
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Gesamtkosten
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {categoryData.reduce((acc, curr) => 
                  acc + curr.totalCost, 0
                ).toFixed(2)}€
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Artikel analysiert
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {categoryData.reduce((acc, curr) => 
                  acc + curr.itemCount, 0
                )}
              </p>
            </div>
          </div>

          {/* Kategorie-Chart */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Margen nach Kategorie</h3>
            <div className="h-80">
              <Bar
                data={categoryChartData}
                options={{
                  responsive: true,
                  interaction: {
                    mode: 'index' as const,
                    intersect: false,
                  },
                  scales: {
                    y: {
                      type: 'linear' as const,
                      display: true,
                      position: 'left' as const,
                      title: {
                        display: true,
                        text: 'Marge (%)'
                      }
                    },
                    y1: {
                      type: 'linear' as const,
                      display: true,
                      position: 'right' as const,
                      title: {
                        display: true,
                        text: 'Umsatz (€)'
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  }
                }}
              />
            </div>
          </div>

          {/* Trend-Chart */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Margenentwicklung</h3>
            <div className="h-80">
              <Line
                data={trendChartData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Marge (%)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 