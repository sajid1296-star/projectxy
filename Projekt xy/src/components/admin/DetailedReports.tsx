'use client'

import { useState } from 'react'
import axios from '@/services/api'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { saveAs } from 'file-saver'

export default function DetailedReports() {
  const [generating, setGenerating] = useState(false)
  const [selectedReport, setSelectedReport] = useState('')
  const [reportOptions, setReportOptions] = useState({
    timeFrame: '30d',
    compareWithPrevious: false,
    includeGraphics: true,
    detailLevel: 'summary'
  })

  const reports = [
    {
      id: 'supplier-performance',
      name: 'Lieferantenanalyse',
      description: 'Detaillierte Analyse der Lieferantenleistung',
      icon: '🏭'
    },
    {
      id: 'seasonal-trends',
      name: 'Saisonale Trends',
      description: 'Analyse saisonaler Verkaufsmuster',
      icon: '📅'
    },
    {
      id: 'customer-cohort',
      name: 'Kundenkohortenanalyse',
      description: 'Analyse von Kundengruppen über Zeit',
      icon: '👥'
    },
    {
      id: 'product-margins',
      name: 'Produktmargenanalyse',
      description: 'Detaillierte Margenanalyse pro Produkt',
      icon: '💰'
    }
  ]

  const generateReport = async () => {
    try {
      setGenerating(true)
      const response = await axios.get(`/reports/detailed/${selectedReport}`, {
        params: reportOptions
      })
      
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
      // Report-spezifische Generierung
      switch (selectedReport) {
        case 'supplier-performance':
          await generateSupplierReport(pdfDoc, response.data, font)
          break
        case 'seasonal-trends':
          await generateSeasonalReport(pdfDoc, response.data, font)
          break
        case 'customer-cohort':
          await generateCohortReport(pdfDoc, response.data, font)
          break
        case 'product-margins':
          await generateMarginsReport(pdfDoc, response.data, font)
          break
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, `${selectedReport}-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error('Fehler beim Generieren des Berichts:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-6">Detaillierte Analyseberichte</h2>
      
      {/* Berichtsauswahl */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedReport === report.id 
                ? 'border-indigo-600 shadow-md' 
                : 'hover:border-gray-400'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="text-3xl mb-2">{report.icon}</div>
            <h3 className="font-semibold mb-2">{report.name}</h3>
            <p className="text-sm text-gray-600">{report.description}</p>
          </div>
        ))}
      </div>

      {/* Berichtsoptionen */}
      {selectedReport && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zeitraum
              </label>
              <select
                value={reportOptions.timeFrame}
                onChange={(e) => setReportOptions({
                  ...reportOptions,
                  timeFrame: e.target.value
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="7d">7 Tage</option>
                <option value="30d">30 Tage</option>
                <option value="90d">90 Tage</option>
                <option value="1y">1 Jahr</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Detailgrad
              </label>
              <select
                value={reportOptions.detailLevel}
                onChange={(e) => setReportOptions({
                  ...reportOptions,
                  detailLevel: e.target.value
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="summary">Zusammenfassung</option>
                <option value="detailed">Detailliert</option>
                <option value="full">Vollständig</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={reportOptions.compareWithPrevious}
                onChange={(e) => setReportOptions({
                  ...reportOptions,
                  compareWithPrevious: e.target.checked
                })}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-600">
                Mit Vorperiode vergleichen
              </span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={reportOptions.includeGraphics}
                onChange={(e) => setReportOptions({
                  ...reportOptions,
                  includeGraphics: e.target.checked
                })}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-600">
                Grafiken einschließen
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Generierungsbutton */}
      {selectedReport && (
        <button
          onClick={generateReport}
          disabled={generating}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          {generating ? 'Generiere Bericht...' : 'Bericht generieren'}
        </button>
      )}
    </div>
  )
} 