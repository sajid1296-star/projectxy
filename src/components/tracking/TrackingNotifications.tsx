'use client'

import { useState } from 'react'
import { TrackingAPI } from './TrackingAPI'

export default function TrackingNotifications() {
  const [email, setEmail] = useState('')
  const [orderId, setOrderId] = useState('')
  const [orderType, setOrderType] = useState<'purchase' | 'sales'>('sales')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await TrackingAPI.subscribeToUpdates(orderType, orderId, email)
      setSubscribed(true)
    } catch (error) {
      console.error('Fehler beim Abonnieren:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        Tracking-Benachrichtigungen
      </h2>

      {subscribed ? (
        <div className="text-green-600 p-4 bg-green-50 rounded">
          Sie erhalten nun Benachrichtigungen für diesen Auftrag!
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Auftragstyp
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as 'purchase' | 'sales')}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="purchase">Ankaufsauftrag</option>
              <option value="sales">Verkaufsauftrag</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Auftragsnummer
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md 
                     hover:bg-indigo-700"
          >
            Benachrichtigungen aktivieren
          </button>
        </form>
      )}
    </div>
  )
} 