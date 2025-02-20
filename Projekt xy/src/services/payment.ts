import axios from './api'

export const paymentAPI = {
  createStripeSession: async (cartItems: any[]) => {
    const response = await axios.post('/stripe/create-checkout-session', {
      items: cartItems
    })
    return response.data
  },

  createPayPalOrder: async (cartItems: any[]) => {
    const response = await axios.post('/paypal/create-order', {
      items: cartItems
    })
    return response.data
  }
} 