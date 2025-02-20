'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

type ShippingAddress = {
  name: string
  street: string
  city: string
  postalCode: string
  country: string
}

type ReturnLabel = {
  id: string
  trackingNumber: string
  carrier: string
  labelUrl: string
  createdAt: Date
  validUntil: Date
}

export default function ReturnLabelGenerator() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [labelGenerated, setLabelGenerated] = useState(false)
  const [returnLabel, setReturnLabel] = useState<ReturnLabel | null>(null)

  const generateLabel = async (orderId: string, customerAddress: ShippingAddress) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/shipping/return-label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          customerAddress,
        }),
      })

      if (!response.ok) {
        throw new Error('Fehler beim Generieren des Rücksendelabels')
      }

      const data = await response.json()
      setReturnLabel(data)
      setLabelGenerated(true)
      
      // Automatischer E-Mail-Versand
      await sendLabelByEmail(data, customerAddress.email)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const sendLabelByEmail = async (label: ReturnLabel, email: string) => {
    try {
      await fetch('/api/shipping/send-label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          labelId: label.id,
          email,
        }),
      })
    } catch (err) {
      console.error('Fehler beim E-Mail-Versand:', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Rücksendelabel</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {labelGenerated && returnLabel ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 text-green-700 rounded-md">
            Rücksendelabel wurde erfolgreich generiert und per E-Mail versendet!
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Label Details</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Tracking-Nummer</dt>
                <dd className="font-medium">{returnLabel.trackingNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Versanddienstleister</dt>
                <dd className="font-medium">{returnLabel.carrier}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Erstellt am</dt>
                <dd className="font-medium">
                  {returnLabel.createdAt.toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Gültig bis</dt>
                <dd className="font-medium">
                  {returnLabel.validUntil.toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => window.open(returnLabel.labelUrl, '_blank')}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md 
                       hover:bg-indigo-700"
            >
              Label herunterladen
            </button>
            <button
              onClick={() => sendLabelByEmail(returnLabel, 'customer@email.com')}
              className="flex-1 border border-indigo-600 text-indigo-600 px-4 py-2 
                       rounded-md hover:bg-indigo-50"
            >
              Erneut per E-Mail senden
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => generateLabel('123', {
            name: 'Max Mustermann',
            street: 'Musterstraße 1',
            city: 'Musterstadt',
            postalCode: '12345',
            country: 'Deutschland'
          })}
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md 
                   hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? 'Label wird generiert...' : 'Rücksendelabel generieren'}
        </button>
      )}
    </div>
  )
} 