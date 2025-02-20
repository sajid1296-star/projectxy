'use client'

import { useState, useEffect } from 'react'
import axios from '@/services/api'

export default function OrdersOverview() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders?populate=*')
      setOrders(response.data.data)
    } catch (error) {
      console.error('Fehler beim Laden der Bestellungen:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await axios.put(`/orders/${orderId}`, {
        data: { status }
      })
      fetchOrders() // Aktualisiere die Liste
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error)
    }
  }

  const updateTrackingNumber = async (orderId: number, trackingNumber: string) => {
    try {
      await axios.put(`/orders/${orderId}`, {
        data: { trackingNumber }
      })
      fetchOrders()
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Tracking-Nummer:', error)
    }
  }

  if (loading) return <div>Laden...</div>

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bestellung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Betrag
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.attributes.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.attributes.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.attributes.user?.data?.attributes?.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.attributes.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-sm rounded-md border-gray-300"
                      >
                        <option value="pending">Ausstehend</option>
                        <option value="processing">In Bearbeitung</option>
                        <option value="shipped">Versendet</option>
                        <option value="delivered">Geliefert</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={order.attributes.trackingNumber || ''}
                        onChange={(e) => updateTrackingNumber(order.id, e.target.value)}
                        placeholder="Tracking-Nr."
                        className="text-sm rounded-md border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.attributes.total.toFixed(2)}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 