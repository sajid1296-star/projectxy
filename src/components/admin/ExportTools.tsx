'use client'

import { useState } from 'react'
import axios from '@/services/api'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export default function ExportTools() {
  const [exporting, setExporting] = useState(false)

  const exportToExcel = async (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(dataBlob, filename)
  }

  const exportOrders = async () => {
    try {
      setExporting(true)
      const response = await axios.get('/orders/export')
      await exportToExcel(response.data, 'bestellungen.xlsx')
    } catch (error) {
      console.error('Fehler beim Exportieren der Bestellungen:', error)
    } finally {
      setExporting(false)
    }
  }

  const exportCustomers = async () => {
    try {
      setExporting(true)
      const response = await axios.get('/users/export')
      await exportToExcel(response.data, 'kunden.xlsx')
    } catch (error) {
      console.error('Fehler beim Exportieren der Kundendaten:', error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Daten exportieren</h3>
      <div className="space-x-4">
        <button
          onClick={exportOrders}
          disabled={exporting}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {exporting ? 'Exportiere...' : 'Bestellungen exportieren'}
        </button>
        <button
          onClick={exportCustomers}
          disabled={exporting}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {exporting ? 'Exportiere...' : 'Kundendaten exportieren'}
        </button>
      </div>
    </div>
  )
} 