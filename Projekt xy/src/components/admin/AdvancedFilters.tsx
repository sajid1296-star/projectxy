'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'

type AdvancedFiltersProps = {
  onFilterChange: (filters: any) => void
}

export default function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    categories: [],
    inStock: true,
    hasReviews: false,
    minRating: 0,
    sortDirection: 'desc',
    timeFrame: '30d',
    paymentMethods: [],
    shippingMethods: [],
    customerSegments: [],
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <div className="space-y-6">
        {/* Preisbereich */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Preisbereich (€)
          </label>
          <div className="mt-2 flex space-x-4">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handleFilterChange('priceRange', [
                parseInt(e.target.value),
                filters.priceRange[1]
              ])}
              className="block w-24 rounded-md border-gray-300 shadow-sm"
            />
            <span className="text-gray-500">bis</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [
                filters.priceRange[0],
                parseInt(e.target.value)
              ])}
              className="block w-24 rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {/* Zeitraum */}
        <div>
          <label className="text-sm font-medium text-gray-700">Zeitraum</label>
          <select
            value={filters.timeFrame}
            onChange={(e) => handleFilterChange('timeFrame', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="7d">Letzte 7 Tage</option>
            <option value="30d">Letzte 30 Tage</option>
            <option value="90d">Letzte 90 Tage</option>
            <option value="1y">Letztes Jahr</option>
          </select>
        </div>

        {/* Kundensegmente */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Kundensegmente
          </label>
          <div className="mt-2 space-y-2">
            {['Neukunden', 'Stammkunden', 'VIP', 'Inaktiv'].map((segment) => (
              <label key={segment} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={filters.customerSegments.includes(segment)}
                  onChange={(e) => {
                    const newSegments = e.target.checked
                      ? [...filters.customerSegments, segment]
                      : filters.customerSegments.filter((s) => s !== segment)
                    handleFilterChange('customerSegments', newSegments)
                  }}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-600">{segment}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Weitere Filter */}
        <div className="space-y-4">
          <Switch.Group>
            <div className="flex items-center">
              <Switch
                checked={filters.inStock}
                onChange={(checked) => handleFilterChange('inStock', checked)}
                className={`${
                  filters.inStock ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span className={`${
                  filters.inStock ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
              </Switch>
              <Switch.Label className="ml-2 text-sm text-gray-600">
                Nur verfügbare Artikel
              </Switch.Label>
            </div>
          </Switch.Group>

          <Switch.Group>
            <div className="flex items-center">
              <Switch
                checked={filters.hasReviews}
                onChange={(checked) => handleFilterChange('hasReviews', checked)}
                className={`${
                  filters.hasReviews ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span className={`${
                  filters.hasReviews ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
              </Switch>
              <Switch.Label className="ml-2 text-sm text-gray-600">
                Nur mit Bewertungen
              </Switch.Label>
            </div>
          </Switch.Group>
        </div>
      </div>
    </div>
  )
} 