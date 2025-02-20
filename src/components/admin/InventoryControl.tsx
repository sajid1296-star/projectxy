'use client'

import { useState, useEffect } from 'react'
import { Chart } from 'react-chartjs-2'

export default function InventoryControl() {
  const [inventory, setInventory] = useState([])
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStock: 0,
    overstock: 0
  })

  const [filters, setFilters] = useState({
    category: '',
    stockLevel: 'all', // 'all', 'low', 'optimal', 'high'
    location: ''
  })

  const handleStockUpdate = async (productId: string, newQuantity: number) => {
    try {
      // Implementierung der Bestandsaktualisierung
    } catch (error) {
      console.error('Fehler bei der Bestandsaktualisierung:', error)
    }
  }

  const handleStockTransfer = async (
    productId: string,
    fromLocation: string,
    toLocation: string,
    quantity: number
  ) => {
    try {
      // Implementierung der Bestandsübertragung
    } catch (error) {
      console.error('Fehler bei der Bestandsübertragung:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Lagerstatistiken */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Gesamtartikel</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Gesamtwert</h3>
          <p className="mt-2 text-3xl font-semibold">
            {stats.totalValue.toFixed(2)}€
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Niedriger Bestand</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.lowStock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Überbestand</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.overstock}</p>
        </div>
      </div>

      {/* Filter und Suche */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="rounded-md border-gray-300"
          >
            <option value="">Alle Kategorien</option>
            {/* Kategorie-Optionen */}
          </select>

          <select
            value={filters.stockLevel}
            onChange={(e) => setFilters({ ...filters, stockLevel: e.target.value })}
            className="rounded-md border-gray-300"
          >
            <option value="all">Alle Bestände</option>
            <option value="low">Niedriger Bestand</option>
            <option value="optimal">Optimaler Bestand</option>
            <option value="high">Überbestand</option>
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="rounded-md border-gray-300"
          >
            <option value="">Alle Standorte</option>
            {/* Standort-Optionen */}
          </select>
        </div>
      </div>

      {/* Bestandsliste */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produkt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bestand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Standort
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Bestandslisten-Implementierung */}
          </tbody>
        </table>
      </div>
    </div>
  )
} 