import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { paymentAPI } from '@/services/payment'
import { PayPalButtons } from "@paypal/react-paypal-js"
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe('your_publishable_key')

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStripeCheckout = async () => {
    try {
      setLoading(true)
      setError('')
      const session = await paymentAPI.createStripeSession(items)
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({
        sessionId: session.id
      })
    } catch (err) {
      setError('Fehler bei der Zahlungsabwicklung')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePayPalCreateOrder = async () => {
    try {
      const order = await paymentAPI.createPayPalOrder(items)
      return order.id
    } catch (err) {
      setError('Fehler bei der PayPal-Bestellung')
      console.error(err)
      throw err
    }
  }

  const handlePayPalApprove = async (data: any) => {
    // Hier können Sie die Bestellung abschließen
    clearCart()
    // Weiterleitung zur Erfolgsseite
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Zahlung</h2>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleStripeCheckout}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Wird verarbeitet...' : 'Mit Kreditkarte zahlen'}
        </button>

        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-gray-500">oder</span>
          </div>
        </div>

        <PayPalButtons
          createOrder={handlePayPalCreateOrder}
          onApprove={handlePayPalApprove}
          style={{ layout: "horizontal" }}
        />
      </div>
    </div>
  )
} 