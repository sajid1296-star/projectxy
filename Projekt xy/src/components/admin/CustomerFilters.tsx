'use client'

import { useState } from 'react'
import { DateRangePicker } from 'react-date-range'

type CustomerFiltersProps = {
  onFilterChange: (filters: any) => void
}

export default function CustomerFilters({ onFilterChange }: CustomerFiltersProps) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  })

  const [filters, setFilters] = useState({
    searchTerm: '',
    orderCount: '',
    minSpent: '',
    maxSpent: '',
    sortBy: 'recent'
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDateRangeChange = (ranges: any) => {
    setDateRange(ranges.selection)
    onFilterChange({
      ...filters,
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate
    })
  }

  return (
    <div className="bg-white p-4 shadow rounded-lg mb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Suche
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Name oder E-Mail"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mindestbestellungen
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={filters.orderCount}
            onChange={(e) => handleFilterChange('orderCount', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mindestumsatz (€)
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={filters.minSpent}
            onChange={(e) => handleFilterChange('minSpent', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sortierung
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="recent">Neueste zuerst</option>
            <option value="orders">Nach Bestellungen</option>
            <option value="spent">Nach Umsatz</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Registrierungszeitraum
        </button>

        {showDatePicker && (
          <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg">
            <DateRangePicker
              ranges={[dateRange]}
              onChange={handleDateRangeChange}
            />
          </div>
        )}
      </div>
    </div>
  )
} 