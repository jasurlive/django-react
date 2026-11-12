import { useState } from 'react'
import { api } from '../../lib/api'
import type { User } from '../GET/useGetUsers'

export type RegisterBody = Omit<User, 'id' | 'is_manager'> & { password: string }

export function usePostRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function register(body: RegisterBody) {
    setLoading(true)
    setError(null)

    try {
      return await api.post<User>('/users/', body)
    } catch (err) {
      setError((err as Error).message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, error }
}
