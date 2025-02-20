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
import { Line, Bar, Radar, Doughnut, Bubble, Scatter } from 'react-chartjs-2'
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

export default function AdvancedCharts() {
  const [data, setData] = useState<any>(null)
  const [chartType, setChartType] = useState('line')
  const [loading, setLoading] = useState(true)
  const [chartOptions, setChartOptions] = useState({
    showLegend: true,
    enableAnimation: true,
    stacked: false,
    fillArea: false
  })

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    try {
      const response = await axios.get('/analytics/chart-data')
      setData(response.data)
    } catch (error) {
      console.error('Fehler beim Laden der Chartdaten:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderChart = () => {
    if (!data) return null

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartOptions.showLegend
        }
      },
      animation: chartOptions.enableAnimation
    }

    switch (chartType) {
      case 'line':
        return (
          <Line
            data={data.lineData}
            options={{
              ...commonOptions,
              elements: {
                line: {
                  tension: 0.4,
                  fill: chartOptions.fillArea
                }
              }
            }}
          />
        )
      case 'bar':
        return (
          <Bar
            data={data.barData}
            options={{
              ...commonOptions,
              scales: {
                x: { stacked: chartOptions.stacked },
                y: { stacked: chartOptions.stacked }
              }
            }}
          />
        )
      case 'radar':
        return <Radar data={data.radarData} options={commonOptions} />
      case 'doughnut':
        return <Doughnut data={data.doughnutData} options={commonOptions} />
      case 'bubble':
        return <Bubble data={data.bubbleData} options={commonOptions} />
      case 'scatter':
        return <Scatter data={data.scatterData} options={commonOptions} />
      default:
        return null
    }
  }

  if (loading) return <div>Laden...</div>

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm"
        >
          <option value="line">Liniendiagramm</option>
          <option value="bar">Balkendiagramm</option>
          <option value="radar">Radardiagramm</option>
          <option value="doughnut">Donutdiagramm</option>
          <option value="bubble">Blasendiagramm</option>
          <option value="scatter">Streudiagramm</option>
        </select>

        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={chartOptions.showLegend}
            onChange={(e) => setChartOptions({
              ...chartOptions,
              showLegend: e.target.checked
            })}
            className="rounded border-gray-300 text-indigo-600"
          />
          <span className="ml-2">Legende anzeigen</span>
        </label>

        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={chartOptions.enableAnimation}
            onChange={(e) => setChartOptions({
              ...chartOptions,
              enableAnimation: e.target.checked
            })}
            className="rounded border-gray-300 text-indigo-600"
          />
          <span className="ml-2">Animation</span>
        </label>

        {(chartType === 'bar') && (
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={chartOptions.stacked}
              onChange={(e) => setChartOptions({
                ...chartOptions,
                stacked: e.target.checked
              })}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span className="ml-2">Gestapelt</span>
          </label>
        )}

        {(chartType === 'line') && (
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={chartOptions.fillArea}
              onChange={(e) => setChartOptions({
                ...chartOptions,
                fillArea: e.target.checked
              })}
              className="rounded border-gray-300 text-indigo-600"
            />
            <span className="ml-2">Fläche füllen</span>
          </label>
        )}
      </div>

      <div className="h-[600px]">
        {renderChart()}
      </div>
    </div>
  )
} 