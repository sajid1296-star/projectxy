import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:1337/api'
})

// Füge Token zu Requests hinzu, falls vorhanden
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const productAPI = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },

  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  }
}

export default api 