'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'

type BusinessFiltersProps = {
  onFilterChange: (filters: any) => void
}

export default function BusinessFilters({ onFilterChange }: BusinessFiltersProps) {
  const [filters, setFilters] = useState({
    marketingChannels: [],
    supplierIds: [],
    profitMargin: [0, 100],
    stockThreshold: 10,
    returnsOnly: false,
    promotionalItems: false,
    seasonalProducts: false,
    locationIds: [],
    paymentStatus: 'all',
    fulfillmentStatus: 'all'
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const marketingChannels = [
    'Social Media', 'Email', 'SEA', 'Display', 'Affiliate'
  ]

  const locations = [
    { id: 1, name: 'Hauptlager Nord' },
    { id: 2, name: 'Hauptlager Süd' },
    { id: 3, name: 'Außenlager Ost' },
    { id: 4, name: 'Außenlager West' }
  ]

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <div className="space-y-6">
        {/* Marketing-Kanäle */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Marketing-Kanäle
          </label>
          <div className="mt-2 space-y-2">
            {marketingChannels.map((channel) => (
              <label key={channel} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={filters.marketingChannels.includes(channel)}
                  onChange={(e) => {
                    const newChannels = e.target.checked
                      ? [...filters.marketingChannels, channel]
                      : filters.marketingChannels.filter((c) => c !== channel)
                    handleFilterChange('marketingChannels', newChannels)
                  }}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-600">{channel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gewinnspanne */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Gewinnspanne (%)
          </label>
          <div className="mt-2 flex space-x-4">
            <input
              type="number"
              value={filters.profitMargin[0]}
              onChange={(e) => handleFilterChange('profitMargin', [
                parseInt(e.target.value),
                filters.profitMargin[1]
              ])}
              className="block w-24 rounded-md border-gray-300 shadow-sm"
            />
            <span className="text-gray-500">bis</span>
            <input
              type="number"
              value={filters.profitMargin[1]}
              onChange={(e) => handleFilterChange('profitMargin', [
                filters.profitMargin[0],
                parseInt(e.target.value)
              ])}
              className="block w-24 rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {/* Lagerstandorte */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Lagerstandorte
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {locations.map((location) => (
              <label key={location.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={filters.locationIds.includes(location.id)}
                  onChange={(e) => {
                    const newLocations = e.target.checked
                      ? [...filters.locationIds, location.id]
                      : filters.locationIds.filter((id) => id !== location.id)
                    handleFilterChange('locationIds', newLocations)
                  }}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-600">{location.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Weitere Filter */}
        <div className="space-y-4">
          <Switch.Group>
            <div className="flex items-center">
              <Switch
                checked={filters.returnsOnly}
                onChange={(checked) => handleFilterChange('returnsOnly', checked)}
                className={`${
                  filters.returnsOnly ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span className={`${
                  filters.returnsOnly ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
              </Switch>
              <Switch.Label className="ml-2 text-sm text-gray-600">
                Nur Retouren
              </Switch.Label>
            </div>
          </Switch.Group>

          <Switch.Group>
            <div className="flex items-center">
              <Switch
                checked={filters.seasonalProducts}
                onChange={(checked) => handleFilterChange('seasonalProducts', checked)}
                className={`${
                  filters.seasonalProducts ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span className={`${
                  filters.seasonalProducts ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
              </Switch>
              <Switch.Label className="ml-2 text-sm text-gray-600">
                Saisonale Produkte
              </Switch.Label>
            </div>
          </Switch.Group>
        </div>
      </div>
    </div>
  )
} 