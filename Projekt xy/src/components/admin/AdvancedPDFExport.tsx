'use client'

import { useState } from 'react'
import axios from '@/services/api'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { saveAs } from 'file-saver'

export default function AdvancedPDFExport() {
  const [generating, setGenerating] = useState(false)

  const generateHeader = async (pdfDoc: PDFDocument, page: any, title: string) => {
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const { width, height } = page.getSize()
    
    page.drawText(title, {
      x: 50,
      y: height - 50,
      size: 20,
      font: helveticaFont
    })

    page.drawText(new Date().toLocaleDateString(), {
      x: width - 150,
      y: height - 50,
      size: 12,
      font: helveticaFont
    })
  }

  const exportReports = async (type: string) => {
    try {
      setGenerating(true)
      const response = await axios.get(`/reports/${type}`)
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage()

      switch (type) {
        case 'sales':
          await generateSalesReport(pdfDoc, page, response.data)
          break
        case 'inventory':
          await generateInventoryReport(pdfDoc, page, response.data)
          break
        case 'customer':
          await generateCustomerReport(pdfDoc, page, response.data)
          break
        case 'performance':
          await generatePerformanceReport(pdfDoc, page, response.data)
          break
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, `${type}-bericht-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error('Fehler beim PDF-Export:', error)
    } finally {
      setGenerating(false)
    }
  }

  const generateSalesReport = async (pdfDoc: PDFDocument, page: any, data: any) => {
    await generateHeader(pdfDoc, page, 'Verkaufsbericht')
    // Implementiere Verkaufsberichtsdetails...
  }

  const generateInventoryReport = async (pdfDoc: PDFDocument, page: any, data: any) => {
    await generateHeader(pdfDoc, page, 'Lagerbestandsbericht')
    // Implementiere Lagerbestandsberichtsdetails...
  }

  const generateCustomerReport = async (pdfDoc: PDFDocument, page: any, data: any) => {
    await generateHeader(pdfDoc, page, 'Kundenbericht')
    // Implementiere Kundenberichtsdetails...
  }

  const generatePerformanceReport = async (pdfDoc: PDFDocument, page: any, data: any) => {
    await generateHeader(pdfDoc, page, 'Leistungsbericht')
    // Implementiere Leistungsberichtsdetails...
  }

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">PDF Berichte</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => exportReports('sales')}
          disabled={generating}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Verkaufsbericht
        </button>

        <button
          onClick={() => exportReports('inventory')}
          disabled={generating}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Lagerbestandsbericht
        </button>

        <button
          onClick={() => exportReports('customer')}
          disabled={generating}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Kundenbericht
        </button>

        <button
          onClick={() => exportReports('performance')}
          disabled={generating}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Leistungsbericht
        </button>
      </div>
    </div>
  )
} 