'use client'

import { XCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <XCircleIcon className="mx-auto h-12 w-12 text-red-600" />
            <h2 className="mt-4 text-2xl font-bold">Zahlung fehlgeschlagen</h2>
            <p className="mt-2 text-gray-600">
              Es gab ein Problem bei der Verarbeitung Ihrer Zahlung. Bitte versuchen Sie es erneut.
            </p>
            <button
              onClick={() => router.push('/warenkorb')}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Zurück zum Warenkorb
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 