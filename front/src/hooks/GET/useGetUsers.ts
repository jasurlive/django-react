import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export type User = {
  id: number
  username: string
  firstname: string
  surname: string
  age: number
  is_manager: boolean
}

export function useGetUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    api
      .get<User[]>('/users/', { signal: controller.signal })
      .then(setUsers)
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { users, loading, error }
}
