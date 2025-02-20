'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import axios from '@/services/api'

type Order = {
  id: number
  attributes: {
    orderNumber: string
    status: string
    paymentStatus: string
    total: number
    createdAt: string
    items: any[]
    trackingNumber?: string
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders', {
          params: {
            'filters[user][id][$eq]': user?.id,
            sort: 'createdAt:desc',
          },
        })
        setOrders(response.data.data)
      } catch (error) {
        console.error('Fehler beim Laden der Bestellungen:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  if (loading) return <div>Laden...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Meine Bestellungen</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">
                  Bestellung #{order.attributes.orderNumber}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.attributes.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {order.attributes.status}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Artikel</h3>
              <ul className="mt-2 divide-y divide-gray-200">
                {order.attributes.items.map((item: any, index: number) => (
                  <li key={index} className="py-2 flex justify-between">
                    <div>
                      <span className="text-sm">{item.attributes.title}</span>
                      <span className="text-gray-500"> × {item.quantity}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {(item.attributes.price * item.quantity).toFixed(2)}€
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Gesamtbetrag: {order.attributes.total.toFixed(2)}€
                </p>
                {order.attributes.trackingNumber && (
                  <p className="text-sm text-gray-500">
                    Tracking: {order.attributes.trackingNumber}
                  </p>
                )}
              </div>
              <button
                onClick={() => window.location.href = `/bestellungen/${order.id}`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Details ansehen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 