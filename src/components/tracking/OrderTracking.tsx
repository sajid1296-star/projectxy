'use client'

import { useState, useEffect } from 'react'
import { Timeline } from '@/components/ui/Timeline'

type TrackingStatus = {
  purchaseOrder: {
    received: boolean
    inspected: boolean
    evaluated: boolean
    offerSent: boolean
    accepted: boolean
    paymentSent: boolean
    completed: boolean
  }
  salesOrder: {
    received: boolean
    processed: boolean
    packed: boolean
    shipped: boolean
    delivered: boolean
    returnRequested?: boolean
    returnReceived?: boolean
    refunded?: boolean
  }
}

type TrackingEvent = {
  id: string
  timestamp: Date
  status: string
  description: string
  location?: string
  note?: string
}

export default function OrderTracking() {
  const [orderType, setOrderType] = useState<'purchase' | 'sales'>('sales')
  const [orderId, setOrderId] = useState('')
  const [status, setStatus] = useState<TrackingStatus | null>(null)
  const [events, setEvents] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTrackingInfo = async () => {
    if (!orderId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/tracking/${orderType}/${orderId}`)
      const data = await response.json()
      setStatus(data.status)
      setEvents(data.events)
    } catch (error) {
      console.error('Fehler beim Laden der Tracking-Informationen:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Auftrags-Tracking</h1>

      {/* Auftragstyp-Auswahl */}
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setOrderType('purchase')}
            className={`px-4 py-2 rounded-lg ${
              orderType === 'purchase'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Ankaufsauftrag
          </button>
          <button
            onClick={() => setOrderType('sales')}
            className={`px-4 py-2 rounded-lg ${
              orderType === 'sales'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Verkaufsauftrag
          </button>
        </div>

        {/* Auftragsnummer-Eingabe */}
        <div className="flex space-x-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Auftragsnummer eingeben"
            className="flex-1 rounded-lg border-gray-300"
          />
          <button
            onClick={fetchTrackingInfo}
            disabled={!orderId || loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
                     hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Lädt...' : 'Tracking abrufen'}
          </button>
        </div>
      </div>

      {/* Status-Anzeige */}
      {status && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Auftragsstatus</h2>
          {orderType === 'purchase' ? (
            <div className="grid grid-cols-2 gap-4">
              <StatusItem
                label="Auftrag erhalten"
                completed={status.purchaseOrder.received}
              />
              <StatusItem
                label="Ware inspiziert"
                completed={status.purchaseOrder.inspected}
              />
              <StatusItem
                label="Bewertung abgeschlossen"
                completed={status.purchaseOrder.evaluated}
              />
              <StatusItem
                label="Angebot gesendet"
                completed={status.purchaseOrder.offerSent}
              />
              <StatusItem
                label="Angebot akzeptiert"
                completed={status.purchaseOrder.accepted}
              />
              <StatusItem
                label="Zahlung gesendet"
                completed={status.purchaseOrder.paymentSent}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <StatusItem
                label="Bestellung eingegangen"
                completed={status.salesOrder.received}
              />
              <StatusItem
                label="In Bearbeitung"
                completed={status.salesOrder.processed}
              />
              <StatusItem
                label="Verpackt"
                completed={status.salesOrder.packed}
              />
              <StatusItem
                label="Versendet"
                completed={status.salesOrder.shipped}
              />
              <StatusItem
                label="Zugestellt"
                completed={status.salesOrder.delivered}
              />
            </div>
          )}
        </div>
      )}

      {/* Timeline der Ereignisse */}
      {events.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tracking-Verlauf</h2>
          <Timeline events={events} />
        </div>
      )}
    </div>
  )
}

function StatusItem({ label, completed }: { label: string; completed: boolean }) {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={`w-4 h-4 rounded-full ${
          completed ? 'bg-green-500' : 'bg-gray-300'
        }`}
      />
      <span className={completed ? 'text-gray-900' : 'text-gray-500'}>
        {label}
      </span>
    </div>
  )
} 