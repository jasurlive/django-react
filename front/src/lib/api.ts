// tiny fetch wrapper: base URL from .env, JSON in/out, errors thrown as ApiError
// token: saved by your login flow -> localStorage.setItem('token', '...')

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

type Options = Omit<RequestInit, 'body'> & { body?: unknown }

export async function api<T = unknown>(path: string, { body, headers, ...options }: Options = {}): Promise<T> {
  const token = localStorage.getItem('token')

  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // some endpoints return nothing (204) or plain text
  const text = await res.text()
  let data: unknown = text
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    // not JSON, keep as text
  }

  if (!res.ok) {
    const message = (data as { message?: string })?.message ?? `HTTP ${res.status}`
    throw new ApiError(res.status, message, data)
  }

  return data as T
}

// shortcuts
api.get = <T>(path: string, options?: Options) => api<T>(path, { ...options, method: 'GET' })
api.post = <T>(path: string, body?: unknown, options?: Options) => api<T>(path, { ...options, method: 'POST', body })
api.put = <T>(path: string, body?: unknown, options?: Options) => api<T>(path, { ...options, method: 'PUT', body })
api.patch = <T>(path: string, body?: unknown, options?: Options) => api<T>(path, { ...options, method: 'PATCH', body })
api.delete = <T>(path: string, options?: Options) => api<T>(path, { ...options, method: 'DELETE' })
