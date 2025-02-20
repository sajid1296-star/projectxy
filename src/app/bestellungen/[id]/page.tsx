'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from '@/services/api'

const statusSteps = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/orders/${id}`)
        setOrder(response.data.data)
      } catch (error) {
        console.error('Fehler beim Laden der Bestellung:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) return <div>Laden...</div>
  if (!order) return <div>Bestellung nicht gefunden</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Bestellung #{order.attributes.orderNumber}
            </h1>
            <p className="text-gray-500">
              Bestellt am {new Date(order.attributes.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {order.attributes.status}
          </span>
        </div>

        {/* Fortschrittsanzeige */}
        <div className="mb-8">
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${(statusSteps[order.attributes.status as keyof typeof statusSteps] / 3) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              />
            </div>
            <div className="flex justify-between">
              <div className="text-xs">Bestätigt</div>
              <div className="text-xs">In Bearbeitung</div>
              <div className="text-xs">Versendet</div>
              <div className="text-xs">Geliefert</div>
            </div>
          </div>
        </div>

        {/* Artikel */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Bestellte Artikel</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artikel
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menge
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preis
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.attributes.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.attributes.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {(item.attributes.price * item.quantity).toFixed(2)}€
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-right font-medium">
                    Gesamtbetrag
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {order.attributes.total.toFixed(2)}€
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Tracking Informationen */}
        {order.attributes.trackingNumber && (
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Versandinformationen</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm">
                Tracking-Nummer: {order.attributes.trackingNumber}
              </p>
              {/* Hier könntest du einen Link zum Tracking-Service einbauen */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 