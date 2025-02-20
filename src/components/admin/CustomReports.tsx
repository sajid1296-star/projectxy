'use client'

import { useState } from 'react'
import { Chart } from 'react-chartjs-2'

type ReportConfig = {
  id: string
  name: string
  type: 'sales' | 'inventory' | 'financial' | 'customer'
  frequency: 'daily' | 'weekly' | 'monthly'
  metrics: string[]
  filters: Record<string, any>
  format: 'pdf' | 'excel' | 'csv'
}

export default function CustomReports() {
  const [reports, setReports] = useState<ReportConfig[]>([])
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date()
  })

  const handleGenerateReport = async (reportId: string) => {
    try {
      // Implementierung der Berichtsgenerierung
    } catch (error) {
      console.error('Fehler bei der Berichtsgenerierung:', error)
    }
  }

  const handleScheduleReport = async (reportId: string, schedule: any) => {
    try {
      // Implementierung der Berichtsplanung
    } catch (error) {
      console.error('Fehler bei der Berichtsplanung:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Berichtsauswahl */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Verfügbare Berichte</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border rounded-lg p-4 hover:border-indigo-500 cursor-pointer"
              onClick={() => setSelectedReport(report.id)}
            >
              <h4 className="font-medium">{report.name}</h4>
              <p className="text-sm text-gray-500 mt-1">
                Typ: {report.type}
              </p>
              <p className="text-sm text-gray-500">
                Format: {report.format}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Berichtskonfiguration */}
      {selectedReport && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Berichtskonfiguration</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Startdatum
              </label>
              <input
                type="date"
                value={dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => 
                  setDateRange((prev) => ({
                    ...prev,
                    start: new Date(e.target.value)
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enddatum
              </label>
              <input
                type="date"
                value={dateRange.end.toISOString().split('T')[0]}
                onChange={(e) => 
                  setDateRange((prev) => ({
                    ...prev,
                    end: new Date(e.target.value)
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => handleGenerateReport(selectedReport)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Bericht generieren
            </button>
            <button
              onClick={() => handleScheduleReport(selectedReport, {})}
              className="bg-white text-indigo-600 px-4 py-2 rounded border border-indigo-600 
                       hover:bg-indigo-50"
            >
              Bericht planen
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 