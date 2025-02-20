'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'

type ProcessFiltersProps = {
  onFilterChange: (filters: any) => void
  processType: 'inventory' | 'orders' | 'shipping' | 'returns'
}

export default function ProcessFilters({ onFilterChange, processType }: ProcessFiltersProps) {
  const [filters, setFilters] = useState({
    // Allgemeine Filter
    dateRange: { start: null, end: null },
    status: [],
    priority: [],
    
    // Lager-spezifische Filter
    stockLevel: [0, 1000],
    locationIds: [],
    supplierIds: [],
    reorderPoint: false,
    
    // Bestell-spezifische Filter
    orderValue: [0, 10000],
    paymentStatus: [],
    shippingMethod: [],
    
    // Versand-spezifische Filter
    carrier: [],
    deliveryTime: [],
    international: false,
    
    // Retouren-spezifische Filter
    returnReason: [],
    refundStatus: [],
    qualityCheck: false
  })

  const getFiltersByProcess = () => {
    switch (processType) {
      case 'inventory':
        return [
          {
            type: 'range',
            label: 'Lagerbestand',
            key: 'stockLevel',
            min: 0,
            max: 1000
          },
          {
            type: 'select',
            label: 'Standorte',
            key: 'locationIds',
            options: [
              { id: 1, name: 'Hauptlager' },
              { id: 2, name: 'Außenlager' },
              { id: 3, name: 'Distributionszentrum' }
            ]
          },
          {
            type: 'switch',
            label: 'Nachbestellpunkt erreicht',
            key: 'reorderPoint'
          }
        ]
      case 'orders':
        return [
          {
            type: 'range',
            label: 'Bestellwert',
            key: 'orderValue',
            min: 0,
            max: 10000
          },
          {
            type: 'select',
            label: 'Zahlungsstatus',
            key: 'paymentStatus',
            options: [
              { id: 'pending', name: 'Ausstehend' },
              { id: 'paid', name: 'Bezahlt' },
              { id: 'failed', name: 'Fehlgeschlagen' }
            ]
          }
        ]
      // ... weitere Prozesstypen
      default:
        return []
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const renderFilter = (filter: any) => {
    switch (filter.type) {
      case 'range':
        return (
          <div key={filter.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min={filter.min}
                max={filter.max}
                value={filters[filter.key][0]}
                onChange={(e) => handleFilterChange(filter.key, [
                  parseInt(e.target.value),
                  filters[filter.key][1]
                ])}
                className="w-24 rounded-md border-gray-300 shadow-sm"
              />
              <span>bis</span>
              <input
                type="number"
                min={filter.min}
                max={filter.max}
                value={filters[filter.key][1]}
                onChange={(e) => handleFilterChange(filter.key, [
                  filters[filter.key][0],
                  parseInt(e.target.value)
                ])}
                className="w-24 rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        )

      case 'select':
        return (
          <div key={filter.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <select
              multiple
              value={filters[filter.key]}
              onChange={(e) => handleFilterChange(
                filter.key,
                Array.from(e.target.selectedOptions, option => option.value)
              )}
              className="w-full rounded-md border-gray-300 shadow-sm"
            >
              {filter.options.map((option: any) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        )

      case 'switch':
        return (
          <Switch.Group key={filter.key}>
            <div className="flex items-center">
              <Switch
                checked={filters[filter.key]}
                onChange={(checked) => handleFilterChange(filter.key, checked)}
                className={`${
                  filters[filter.key] ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${
                    filters[filter.key] ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
              <Switch.Label className="ml-2 text-sm text-gray-600">
                {filter.label}
              </Switch.Label>
            </div>
          </Switch.Group>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Prozessfilter: {processType}
      </h3>
      <div className="space-y-6">
        {getFiltersByProcess().map(filter => renderFilter(filter))}
      </div>
    </div>
  )
} 