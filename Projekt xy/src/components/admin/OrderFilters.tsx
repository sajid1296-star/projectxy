'use client'

import { useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

type FilterProps = {
  onFilterChange: (filters: any) => void
}

export default function OrderFilters({ onFilterChange }: FilterProps) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  })

  const [filters, setFilters] = useState({
    status: '',
    minAmount: '',
    maxAmount: '',
    searchTerm: ''
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
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Alle</option>
            <option value="pending">Ausstehend</option>
            <option value="processing">In Bearbeitung</option>
            <option value="shipped">Versendet</option>
            <option value="delivered">Geliefert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mindestbetrag (€)
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={filters.minAmount}
            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Höchstbetrag (€)
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Suche</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Bestellnummer oder Kunde"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Zeitraum auswählen
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