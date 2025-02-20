'use client'

import { useState } from 'react'

type SystemSettings = {
  general: {
    siteName: string
    maintenance: boolean
    defaultLanguage: string
    timezone: string
  }
  security: {
    passwordPolicy: {
      minLength: number
      requireSpecialChars: boolean
      requireNumbers: boolean
      expiryDays: number
    }
    sessionTimeout: number
    maxLoginAttempts: number
  }
  notifications: {
    lowStockThreshold: number
    priceChangeThreshold: number
    enableEmailNotifications: boolean
    enablePushNotifications: boolean
  }
  automation: {
    priceUpdateFrequency: 'daily' | 'weekly' | 'monthly'
    stockCheckFrequency: 'hourly' | 'daily' | 'weekly'
    autoReorderEnabled: boolean
    reorderThreshold: number
  }
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: '',
      maintenance: false,
      defaultLanguage: 'de',
      timezone: 'Europe/Berlin'
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        expiryDays: 90
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5
    },
    notifications: {
      lowStockThreshold: 10,
      priceChangeThreshold: 20,
      enableEmailNotifications: true,
      enablePushNotifications: false
    },
    automation: {
      priceUpdateFrequency: 'daily',
      stockCheckFrequency: 'hourly',
      autoReorderEnabled: false,
      reorderThreshold: 5
    }
  })

  const handleSettingChange = async (
    category: keyof SystemSettings,
    setting: string,
    value: any
  ) => {
    try {
      setSettings((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value
        }
      }))
      // API-Aufruf zum Speichern der Einstellungen
    } catch (error) {
      console.error('Fehler beim Speichern der Einstellungen:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Allgemeine Einstellungen */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Allgemeine Einstellungen</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Seitenname
            </label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => 
                handleSettingChange('general', 'siteName', e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wartungsmodus
            </label>
            <input
              type="checkbox"
              checked={settings.general.maintenance}
              onChange={(e) => 
                handleSettingChange('general', 'maintenance', e.target.checked)
              }
              className="mt-1 rounded border-gray-300 text-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Sicherheitseinstellungen */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Sicherheitseinstellungen</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimale Passwortlänge
            </label>
            <input
              type="number"
              value={settings.security.passwordPolicy.minLength}
              onChange={(e) => 
                handleSettingChange('security', 'passwordPolicy', {
                  ...settings.security.passwordPolicy,
                  minLength: parseInt(e.target.value)
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Benachrichtigungseinstellungen */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Benachrichtigungen</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mindestbestand-Warnung
            </label>
            <input
              type="number"
              value={settings.notifications.lowStockThreshold}
              onChange={(e) => 
                handleSettingChange(
                  'notifications',
                  'lowStockThreshold',
                  parseInt(e.target.value)
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Automatisierungseinstellungen */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Automatisierung</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preisaktualisierung
            </label>
            <select
              value={settings.automation.priceUpdateFrequency}
              onChange={(e) => 
                handleSettingChange(
                  'automation',
                  'priceUpdateFrequency',
                  e.target.value
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="daily">Täglich</option>
              <option value="weekly">Wöchentlich</option>
              <option value="monthly">Monatlich</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
} 