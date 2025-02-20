import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

type SellFormData = {
  title: string
  description: string
  condition: string
  originalPrice: number
  categoryId: string
  images: FileList
}

export default function SellForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SellFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: SellFormData) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post('http://localhost:1337/api/products/ankauf', {
        data: {
          ...data,
          originalPrice: Number(data.originalPrice)
        }
      })
      
      if (response.data.success) {
        alert('Produkt erfolgreich zum Ankauf angeboten!')
      }
    } catch (error) {
      console.error('Fehler beim Ankauf:', error)
      alert('Es ist ein Fehler aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto mt-8">
      <div>
        <label className="block text-sm font-medium text-gray-700">Produktname</label>
        <input
          type="text"
          {...register('title', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && <span className="text-red-500">Pflichtfeld</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Zustand</label>
        <select
          {...register('condition', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Bitte wählen</option>
          <option value="neu">Neu</option>
          <option value="sehr_gut">Sehr gut</option>
          <option value="gut">Gut</option>
          <option value="akzeptabel">Akzeptabel</option>
        </select>
        {errors.condition && <span className="text-red-500">Pflichtfeld</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Original Preis (€)</label>
        <input
          type="number"
          step="0.01"
          {...register('originalPrice', { required: true, min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.originalPrice && <span className="text-red-500">Gültiger Preis erforderlich</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {isSubmitting ? 'Wird gesendet...' : 'Zum Verkauf anbieten'}
      </button>
    </form>
  )
} 