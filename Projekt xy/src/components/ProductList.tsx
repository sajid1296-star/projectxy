import { useState, useEffect } from 'react'
import Link from 'next/link'
import { productAPI } from '@/services/api'

type Product = {
  id: number
  attributes: {
    title: string
    price: number
    condition: string
    images: {
      data: Array<{
        attributes: {
          url: string
        }
      }>
    }
  }
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts({
          populate: ['images'],
        })
        setProducts(response.data)
      } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div>Laden...</div>
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {products.map((product) => (
        <Link key={product.id} href={`/produkt/${product.id}`}>
          <div className="group relative">
            {product.attributes.images.data?.[0] && (
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={`http://localhost:1337${product.attributes.images.data[0].attributes.url}`}
                  alt={product.attributes.title}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
            )}
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  {product.attributes.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {product.attributes.condition}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {product.attributes.price}€
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 