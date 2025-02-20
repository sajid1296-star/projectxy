'use client'

import { useState } from 'react'
import axios from '@/services/api'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { saveAs } from 'file-saver'

export default function SpecializedReports() {
  const [generating, setGenerating] = useState(false)

  const generateReport = async (type: string) => {
    try {
      setGenerating(true)
      const response = await axios.get(`/reports/specialized/${type}`)
      const pdfDoc = await PDFDocument.create()
      
      switch (type) {
        case 'bestsellers':
          await generateBestsellersReport(pdfDoc, response.data)
          break
        case 'customer-lifetime':
          await generateCustomerLifetimeReport(pdfDoc, response.data)
          break
        case 'inventory-forecast':
          await generateInventoryForecastReport(pdfDoc, response.data)
          break
        case 'marketing-roi':
          await generateMarketingROIReport(pdfDoc, response.data)
          break
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, `${type}-bericht-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error('Fehler beim Generieren des Berichts:', error)
    } finally {
      setGenerating(false)
    }
  }

  const reportTypes = [
    {
      id: 'bestsellers',
      name: 'Bestseller-Analyse',
      description: 'Detaillierte Analyse der meistverkauften Produkte',
      icon: '📈'
    },
    {
      id: 'customer-lifetime',
      name: 'Kundenlebenswert',
      description: 'Analyse des Customer Lifetime Value',
      icon: '👥'
    },
    {
      id: 'inventory-forecast',
      name: 'Lagerbestandsprognose',
      description: 'Vorhersage für Lagerbestandsoptimierung',
      icon: '📦'
    },
    {
      id: 'marketing-roi',
      name: 'Marketing ROI',
      description: 'Return on Investment für Marketingkampagnen',
      icon: '💰'
    }
  ]

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-6">Spezialisierte Berichte</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">{report.icon}</div>
            <h3 className="font-semibold mb-2">{report.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
            <button
              onClick={() => generateReport(report.id)}
              disabled={generating}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              {generating ? 'Generiere...' : 'Bericht erstellen'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 