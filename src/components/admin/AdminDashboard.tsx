'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'
import PurchaseManager from './PurchaseManager'
import BulkImport from './BulkImport'
import AdvancedAnalytics from './AdvancedAnalytics'
import MarginAnalysis from './MarginAnalysis'
import PriceManagement from './PriceManagement'
import InventoryControl from './InventoryControl'

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Ankauf', icon: '🛍️' },
    { name: 'Preise', icon: '💰' },
    { name: 'Lager', icon: '📦' },
    { name: 'Analysen', icon: '📈' },
    { name: 'Import', icon: '📥' },
    { name: 'Einstellungen', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin-Bereich
          </h1>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                   ${selected 
                     ? 'bg-indigo-600 text-white shadow'
                     : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                   }`
                }
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </span>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-4">
            {/* Dashboard */}
            <Tab.Panel>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <QuickStats />
                <RecentActivity />
                <AlertsNotifications />
              </div>
            </Tab.Panel>

            {/* Ankauf */}
            <Tab.Panel>
              <PurchaseManager />
            </Tab.Panel>

            {/* Preise */}
            <Tab.Panel>
              <PriceManagement />
            </Tab.Panel>

            {/* Lager */}
            <Tab.Panel>
              <InventoryControl />
            </Tab.Panel>

            {/* Analysen */}
            <Tab.Panel>
              <div className="space-y-6">
                <AdvancedAnalytics />
                <MarginAnalysis />
              </div>
            </Tab.Panel>

            {/* Import */}
            <Tab.Panel>
              <BulkImport />
            </Tab.Panel>

            {/* Einstellungen */}
            <Tab.Panel>
              <AdminSettings />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

function QuickStats() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Schnellübersicht</h3>
      {/* Implementierung der Schnellübersicht */}
    </div>
  )
}

function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Letzte Aktivitäten</h3>
      {/* Implementierung der Aktivitätsübersicht */}
    </div>
  )
}

function AlertsNotifications() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Benachrichtigungen</h3>
      {/* Implementierung der Benachrichtigungen */}
    </div>
  )
}

function AdminSettings() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Einstellungen</h3>
      {/* Implementierung der Einstellungen */}
    </div>
  )
} 