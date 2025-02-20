import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'

type LoginFormData = {
  email: string
  password: string
}

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      router.push('/') // Redirect nach erfolgreichem Login
    } catch (err) {
      setError('Ungültige Anmeldedaten')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          E-Mail
        </label>
        <input
          type="email"
          {...register('email', { 
            required: 'E-Mail ist erforderlich',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Ungültige E-Mail-Adresse'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Passwort
        </label>
        <input
          type="password"
          {...register('password', { 
            required: 'Passwort ist erforderlich',
            minLength: {
              value: 6,
              message: 'Passwort muss mindestens 6 Zeichen lang sein'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Anmelden
      </button>
    </form>
  )
} 