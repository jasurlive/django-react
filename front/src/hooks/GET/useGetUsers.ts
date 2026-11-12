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
      .then((data) => {
        // guard: a wrong URL can return HTML or an object instead of a list
        if (!Array.isArray(data)) throw new Error('expected a list of users, got something else')
        setUsers(data)
      })
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
