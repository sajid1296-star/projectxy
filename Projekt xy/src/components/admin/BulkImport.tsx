'use client'

import { useState, useRef } from 'react'
import axios from '@/services/api'
import * as XLSX from 'xlsx'
import { AdvancedPricingService } from '@/services/AdvancedPricingService'

type ImportItem = {
  sku: string
  name: string
  brand: string
  category: string
  condition: string
  supplierPrice: number
  quantity: number
  marketPosition: 'premium' | 'standard' | 'budget'
}

export default function BulkImport() {
  const [items, setItems] = useState<ImportItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet) as ImportItem[]
        
        // Datenvalidierung
        const validatedData = data.filter(item => {
          return item.sku && 
                 item.name && 
                 item.supplierPrice > 0 && 
                 item.quantity > 0
        })

        setItems(validatedData)
      } catch (error) {
        console.error('Fehler beim Parsen der Excel-Datei:', error)
        alert('Fehler beim Dateiupload. Bitte überprüfen Sie das Dateiformat.')
      }
    }
    reader.readAsBinaryString(file)
  }

  const processItems = async () => {
    setUploading(true)
    setProgress(0)

    try {
      const total = items.length
      let processed = 0

      // Batch-Verarbeitung
      const batchSize = 50
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize)
        
        const processedItems = batch.map(item => ({
          ...item,
          calculatedPrice: AdvancedPricingService.calculateAdvancedPrice({
            basePrice: item.supplierPrice,
            brand: item.brand,
            category: item.category,
            condition: item.condition,
            quantity: item.quantity,
            marketPosition: item.marketPosition,
            seasonality: 0,
            trendFactor: 0,
            shippingCost: 0,
            returnRate: 0,
            promotionalPeriod: false,
            age: 0
          })
        }))

        await axios.post('/inventory/bulk-import', processedItems)
        
        processed += batch.length
        setProgress((processed / total) * 100)
      }

      alert('Import erfolgreich abgeschlossen!')
      setItems([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Fehler beim Import:', error)
      alert('Fehler beim Import. Bitte versuchen Sie es erneut.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-6">Massenimport</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excel-Datei hochladen
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {items.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {items.length} Artikel gefunden
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marke
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menge
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.supplierPrice.toFixed(2)}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length > 5 && (
                <p className="text-sm text-gray-500 mt-2">
                  und {items.length - 5} weitere...
                </p>
              )}
            </div>

            {uploading ? (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Import läuft... {progress.toFixed(0)}%
                </p>
              </div>
            ) : (
              <button
                onClick={processItems}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Import starten
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 