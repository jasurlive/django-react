import { useCallback, useEffect, useState } from 'react'

// DEMO ONLY: fetches fake data from jsonplaceholder so template pages look filled in.
// when a page gets a real endpoint, switch it to a hook built on lib/api.ts (see useGetUsers)
// and delete this file + the types below once nothing imports them.
const DEMO_URL = 'https://jsonplaceholder.typicode.com'

export type DemoUser = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: { city: string }
  company: { name: string }
}
export type DemoPost = { id: number; userId: number; title: string; body: string }
export type DemoComment = { id: number; postId: number; name: string; email: string; body: string }
export type DemoTodo = { id: number; userId: number; title: string; completed: boolean }

export function useGetDemo<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${DEMO_URL}${path}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<T>
      })
      .then(setData)
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [path, attempt])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  return { data, loading, error, retry }
}
