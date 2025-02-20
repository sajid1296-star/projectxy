'use client'

import { useState } from 'react'
import axios from '@/services/api'
import { PDFDocument, rgb } from 'pdf-lib'
import { saveAs } from 'file-saver'

export default function PDFExport() {
  const [generating, setGenerating] = useState(false)

  const generateOrderPDF = async (order: any) => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    
    page.drawText(`Bestellung #${order.orderNumber}`, {
      x: 50,
      y: height - 50,
      size: 20
    })

    // Weitere PDF-Formatierung hier...
    
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  }

  const exportOrderPDF = async (orderId: string) => {
    try {
      setGenerating(true)
      const response = await axios.get(`/orders/${orderId}`)
      const pdfBytes = await generateOrderPDF(response.data)
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, `bestellung-${response.data.orderNumber}.pdf`)
    } catch (error) {
      console.error('Fehler beim PDF-Export:', error)
    } finally {
      setGenerating(false)
    }
  }

  const exportMonthlyReport = async () => {
    try {
      setGenerating(true)
      const response = await axios.get('/reports/monthly')
      const pdfDoc = await PDFDocument.create()
      // Monatsbericht PDF-Generierung...
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, `monatsbericht-${new Date().toISOString().slice(0, 7)}.pdf`)
    } catch (error) {
      console.error('Fehler beim Generieren des Monatsberichts:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">PDF Export</h3>
      <div className="space-y-4">
        <button
          onClick={() => exportMonthlyReport()}
          disabled={generating}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {generating ? 'Generiere PDF...' : 'Monatsbericht exportieren'}
        </button>
      </div>
    </div>
  )
} 