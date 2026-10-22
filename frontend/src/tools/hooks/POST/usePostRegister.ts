import { useState } from 'react'
import { api } from '../../lib/api'

export type RegisterBody = {
  name: string
  email: string
  password: string
}

export function usePostRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function register(body: RegisterBody) {
    setLoading(true)
    setError(null)

    try {
      return await api.post('/register', body)
    } catch (err) {
      setError((err as Error).message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, error }
}
