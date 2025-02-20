'use client'

import { useState } from 'react'
import axios from '@/services/api'

type PurchaseItem = {
  id: string
  name: string
  sku: string
  suggestedPrice: number
  calculatedPrice: number
  condition: 'new' | 'like-new' | 'very-good' | 'good' | 'acceptable'
  quantity: number
  supplierPrice: number
  margin: number
}

export default function PurchaseManager() {
  const [items, setItems] = useState<PurchaseItem[]>([])
  const [loading, setLoading] = useState(false)

  const calculatePrice = (item: PurchaseItem) => {
    const basePrice = item.supplierPrice
    const conditionMultiplier = {
      'new': 2.0,
      'like-new': 1.8,
      'very-good': 1.6,
      'good': 1.4,
      'acceptable': 1.2
    }
    
    // Grundmarge basierend auf Zustand
    let calculatedPrice = basePrice * conditionMultiplier[item.condition]
    
    // Mengenrabatt
    if (item.quantity > 10) {
      calculatedPrice *= 0.95 // 5% Mengenrabatt
    }
    
    // Mindestmarge sicherstellen
    const minMargin = basePrice * 0.2 // 20% Mindestmarge
    if (calculatedPrice - basePrice < minMargin) {
      calculatedPrice = basePrice + minMargin
    }
    
    return Number(calculatedPrice.toFixed(2))
  }

  const handleAddItem = async (newItem: Partial<PurchaseItem>) => {
    try {
      setLoading(true)
      const response = await axios.post('/purchase/calculate-price', newItem)
      const calculatedItem = {
        ...response.data,
        calculatedPrice: calculatePrice(response.data)
      }
      setItems([...items, calculatedItem])
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Artikels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateItem = (id: string, updates: Partial<PurchaseItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates }
        updatedItem.calculatedPrice = calculatePrice(updatedItem)
        return updatedItem
      }
      return item
    }))
  }

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-6">Ankaufsmanager</h2>

      {/* Artikel hinzufügen */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Neuer Artikel</h3>
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          handleAddItem({
            name: formData.get('name') as string,
            sku: formData.get('sku') as string,
            condition: formData.get('condition') as PurchaseItem['condition'],
            quantity: Number(formData.get('quantity')),
            supplierPrice: Number(formData.get('supplierPrice'))
          })
        }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <input
            name="name"
            placeholder="Artikelname"
            className="rounded-md border-gray-300 shadow-sm"
            required
          />
          <input
            name="sku"
            placeholder="SKU"
            className="rounded-md border-gray-300 shadow-sm"
            required
          />
          <select
            name="condition"
            className="rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="new">Neu</option>
            <option value="like-new">Wie neu</option>
            <option value="very-good">Sehr gut</option>
            <option value="good">Gut</option>
            <option value="acceptable">Akzeptabel</option>
          </select>
          <input
            name="quantity"
            type="number"
            placeholder="Menge"
            min="1"
            className="rounded-md border-gray-300 shadow-sm"
            required
          />
          <input
            name="supplierPrice"
            type="number"
            step="0.01"
            placeholder="Lieferantenpreis"
            className="rounded-md border-gray-300 shadow-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {loading ? 'Wird hinzugefügt...' : 'Hinzufügen'}
          </button>
        </form>
      </div>

      {/* Artikelliste */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artikel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zustand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Menge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                EK-Preis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VK-Preis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marge
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.condition}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.supplierPrice.toFixed(2)}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.calculatedPrice.toFixed(2)}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {((item.calculatedPrice - item.supplierPrice) / item.supplierPrice * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 