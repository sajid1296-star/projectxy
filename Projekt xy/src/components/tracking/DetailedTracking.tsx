'use client'

import { useState, useEffect } from 'react'
import { Map } from '@/components/ui/Map'
import QRCode from 'qrcode.react'

type DetailedStatus = {
  mainStatus: string
  subStatus: string
  estimatedCompletion?: Date
  location?: {
    name: string
    coordinates: [number, number]
    type: 'warehouse' | 'transit' | 'delivery'
  }
  qualityCheck?: {
    performed: boolean
    result: 'passed' | 'failed' | 'pending'
    notes: string[]
  }
  shipping?: {
    carrier: string
    trackingNumber: string
    service: string
    estimatedDelivery: Date
  }
  payment?: {
    status: 'pending' | 'processing' | 'completed'
    method: string
    amount: number
    reference: string
  }
}

export default function DetailedTracking() {
  const [detailedStatus, setDetailedStatus] = useState<DetailedStatus | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [selectedView, setSelectedView] = useState<'timeline' | 'map' | 'details'>('timeline')

  // ... bestehender Status-Code ...

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Detailliertes Tracking</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedView('timeline')}
            className={`px-4 py-2 rounded ${
              selectedView === 'timeline' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setSelectedView('map')}
            className={`px-4 py-2 rounded ${
              selectedView === 'map' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
            }`}
          >
            Karte
          </button>
          <button
            onClick={() => setSelectedView('details')}
            className={`px-4 py-2 rounded ${
              selectedView === 'details' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
            }`}
          >
            Details
          </button>
        </div>
      </div>

      {detailedStatus && (
        <>
          {/* Hauptstatus */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{detailedStatus.mainStatus}</h3>
                <p className="text-gray-500">{detailedStatus.subStatus}</p>
              </div>
              {detailedStatus.estimatedCompletion && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Geschätzte Fertigstellung</p>
                  <p className="font-medium">
                    {detailedStatus.estimatedCompletion.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ausgewählte Ansicht */}
          {selectedView === 'map' && detailedStatus.location && (
            <div className="h-96 mb-6">
              <Map
                center={detailedStatus.location.coordinates}
                markers={[
                  {
                    position: detailedStatus.location.coordinates,
                    type: detailedStatus.location.type,
                    label: detailedStatus.location.name
                  }
                ]}
              />
            </div>
          )}

          {selectedView === 'details' && (
            <div className="space-y-6">
              {/* Qualitätsprüfung */}
              {detailedStatus.qualityCheck && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Qualitätsprüfung</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">
                        {detailedStatus.qualityCheck.result === 'passed' && 'Bestanden'}
                        {detailedStatus.qualityCheck.result === 'failed' && 'Nicht bestanden'}
                        {detailedStatus.qualityCheck.result === 'pending' && 'Ausstehend'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Anmerkungen</p>
                      <ul className="list-disc list-inside">
                        {detailedStatus.qualityCheck.notes.map((note, index) => (
                          <li key={index} className="text-sm">{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Versandinformationen */}
              {detailedStatus.shipping && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Versandinformationen</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Versanddienstleister</p>
                      <p className="font-medium">{detailedStatus.shipping.carrier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tracking-Nummer</p>
                      <p className="font-medium">{detailedStatus.shipping.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-medium">{detailedStatus.shipping.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Geschätzte Lieferung</p>
                      <p className="font-medium">
                        {detailedStatus.shipping.estimatedDelivery.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Zahlungsinformationen */}
              {detailedStatus.payment && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Zahlungsinformationen</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">
                        {detailedStatus.payment.status === 'completed' && 'Abgeschlossen'}
                        {detailedStatus.payment.status === 'processing' && 'In Bearbeitung'}
                        {detailedStatus.payment.status === 'pending' && 'Ausstehend'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Methode</p>
                      <p className="font-medium">{detailedStatus.payment.method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Betrag</p>
                      <p className="font-medium">{detailedStatus.payment.amount.toFixed(2)}€</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Referenz</p>
                      <p className="font-medium">{detailedStatus.payment.reference}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QR-Code für mobiles Tracking */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowQR(!showQR)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showQR ? 'QR-Code ausblenden' : 'QR-Code für mobiles Tracking anzeigen'}
            </button>
            {showQR && (
              <div className="mt-4">
                <QRCode
                  value={`https://ihre-domain.de/tracking/${detailedStatus.orderId}`}
                  size={128}
                  level="H"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
} 