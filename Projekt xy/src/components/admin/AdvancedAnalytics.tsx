'use client'

import { useState, useEffect } from 'react'
import axios from '@/services/api'
import { Pie, Line, Bar, Radar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, TimeScale } from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(ArcElement, TimeScale)

type AdvancedMetrics = {
  profitability: {
    grossMargin: number
    netMargin: number
    operatingMargin: number
    returnOnInvestment: number
  }
  inventory: {
    turnoverRate: number
    averageDaysInStock: number
    stockoutRate: number
    overstockRate: number
  }
  pricing: {
    priceElasticity: number
    optimalPricePoint: number
    competitivePriceIndex: number
    marginTrend: number[]
  }
  performance: {
    sellThroughRate: number
    averageTicketSize: number
    marginPerCategory: Record<string, number>
    topPerformers: Array<{
      sku: string
      margin: number
      revenue: number
    }>
  }
}

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState({
    customerRetention: {
      returning: 0,
      oneTime: 0
    },
    categoryPerformance: [],
    monthlyGrowth: [],
    averageProcessingTime: 0,
    conversionRate: 0
  })
  const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    fetchMetrics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/analytics/advanced')
      setAnalytics(response.data)
    } catch (error) {
      console.error('Fehler beim Laden der Analysen:', error)
    }
  }

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/analytics/advanced?timeRange=${timeRange}`)
      setMetrics(response.data)
    } catch (error) {
      console.error('Fehler beim Laden der Metriken:', error)
    } finally {
      setLoading(false)
    }
  }

  const retentionData = {
    labels: ['Wiederkehrende Kunden', 'Einmalkäufer'],
    datasets: [{
      data: [analytics.customerRetention.returning, analytics.customerRetention.oneTime],
      backgroundColor: ['#4F46E5', '#E5E7EB']
    }]
  }

  const growthData = {
    labels: analytics.monthlyGrowth.map((item: any) => item.month),
    datasets: [{
      label: 'Monatliches Wachstum',
      data: analytics.monthlyGrowth.map((item: any) => item.growth),
      borderColor: '#4F46E5',
      tension: 0.4
    }]
  }

  if (loading || !metrics) return <div>Laden...</div>

  const performanceRadarData = {
    labels: [
      'Bruttomarge',
      'Lagerumschlag',
      'Verkaufsrate',
      'Preisoptimierung',
      'Wettbewerbsfähigkeit'
    ],
    datasets: [{
      label: 'Performance Index',
      data: [
        metrics.profitability.grossMargin * 100,
        metrics.inventory.turnoverRate * 10,
        metrics.performance.sellThroughRate * 100,
        metrics.pricing.priceElasticity * 50,
        metrics.pricing.competitivePriceIndex * 100
      ],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgb(99, 102, 241)',
      pointBackgroundColor: 'rgb(99, 102, 241)'
    }]
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kundenretention */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Kundenretention
          </h3>
          <div className="h-64">
            <Pie data={retentionData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Monatliches Wachstum */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Monatliches Wachstum
          </h3>
          <div className="h-64">
            <Line data={growthData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">
            Durchschnittliche Bearbeitungszeit
          </h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {analytics.averageProcessingTime} Tage
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">
            Konversionsrate
          </h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {(analytics.conversionRate * 100).toFixed(1)}%
          </p>
        </div>

        {/* Kategorie-Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">
            Top Kategorien
          </h4>
          <div className="mt-2">
            {analytics.categoryPerformance.slice(0, 3).map((category: any) => (
              <div key={category.name} className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">{category.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {category.sales}€
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Profitabilitätsmetriken */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Profitabilität</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Bruttomarge</p>
              <p className="text-2xl font-semibold">
                {(metrics.profitability.grossMargin * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ROI</p>
              <p className="text-2xl font-semibold">
                {(metrics.profitability.returnOnInvestment * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Lagermetriken */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Lagerbestand</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Umschlagrate</p>
              <p className="text-2xl font-semibold">
                {metrics.inventory.turnoverRate.toFixed(2)}x
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Durchschnittliche Lagerdauer</p>
              <p className="text-2xl font-semibold">
                {metrics.inventory.averageDaysInStock.toFixed(0)} Tage
              </p>
            </div>
          </div>
        </div>

        {/* Preismetriken */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Preisgestaltung</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Preiselastizität</p>
              <p className="text-2xl font-semibold">
                {metrics.pricing.priceElasticity.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Wettbewerbsindex</p>
              <p className="text-2xl font-semibold">
                {metrics.pricing.competitivePriceIndex.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Performance-Metriken */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Performance</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Verkaufsrate</p>
              <p className="text-2xl font-semibold">
                {(metrics.performance.sellThroughRate * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ø Bestellwert</p>
              <p className="text-2xl font-semibold">
                {metrics.performance.averageTicketSize.toFixed(2)}€
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Radar Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Performance Übersicht</h3>
        <div className="h-96">
          <Radar 
            data={performanceRadarData}
            options={{
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        </div>
      </div>

      {/* Top Performer */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Top Performer</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Umsatz
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.performance.topPerformers.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(item.margin * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.revenue.toFixed(2)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 