'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { productAPI } from '@/services/api'
import { useCart } from '@/contexts/CartContext' // werden wir gleich erstellen

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProduct(id as string)
        setProduct(response.data)
      } catch (error) {
        console.error('Fehler beim Laden des Produkts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <div>Laden...</div>
  if (!product) return <div>Produkt nicht gefunden</div>

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="pt-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
          {/* Produktbilder */}
          <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
            {product.attributes.images.data?.[0] && (
              <img
                src={`http://localhost:1337${product.attributes.images.data[0].attributes.url}`}
                alt={product.attributes.title}
                className="h-full w-full object-cover object-center"
              />
            )}
          </div>

          {/* Produktinfo */}
          <div className="px-4 sm:px-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.attributes.title}
            </h1>
            <div className="mt-3">
              <h2 className="sr-only">Produktinformation</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {product.attributes.price}€
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Beschreibung</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {product.attributes.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              In den Warenkorb
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 