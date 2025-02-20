import { useCart } from '@/contexts/CartContext'
import { TrashIcon } from '@heroicons/react/24/outline'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Ihr Warenkorb ist leer
        </h2>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Warenkorb
        </h1>

        <div className="mt-12">
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6">
                  {item.attributes.images?.data?.[0] && (
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={`http://localhost:1337${item.attributes.images.data[0].attributes.url}`}
                        alt={item.attributes.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  )}

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.attributes.title}</h3>
                        <p className="ml-4">{item.attributes.price}€</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.id}`} className="mr-2">
                          Menge
                        </label>
                        <select
                          id={`quantity-${item.id}`}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="rounded-md border-gray-300"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Zwischensumme</p>
            <p>{total.toFixed(2)}€</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Versand und Steuern werden an der Kasse berechnet.
          </p>
        </div>
      </div>
    </div>
  )
} 