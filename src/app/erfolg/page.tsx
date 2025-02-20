'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      // Hole Bestelldetails von der API
      fetch(`/api/orders/verify-payment?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setOrderDetails(data)
          clearCart() // Leere den Warenkorb nach erfolgreicher Zahlung
        })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-4 text-2xl font-bold">Bestellung erfolgreich!</h2>
            <p className="mt-2 text-gray-600">
              Vielen Dank für Ihren Einkauf. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
            </p>
            {orderDetails && (
              <div className="mt-4 text-left">
                <h3 className="font-semibold">Bestellnummer: {orderDetails.id}</h3>
                <p className="text-sm text-gray-600">Status: {orderDetails.status}</p>
              </div>
            )}
            <button
              onClick={() => router.push('/')}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Zurück zur Startseite
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 