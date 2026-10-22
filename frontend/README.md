# Frontend (React 19 + TypeScript + Vite)

No UI kit, no state library. Add only what the project needs.

```
src/
├── ts/                    entry: main.tsx, App.tsx (routes), env.d.ts
└── tools/
    ├── pages/             one file per route
    ├── components/        Layout, Header, ErrorBoundary
    ├── shared/            Menu (sidebar / mobile bar)
    ├── hooks/
    │   ├── GET/           data fetching hooks
    │   ├── POST/          data sending hooks
    │   └── LOCAL/         browser-only hooks (theme, shortcuts)
    ├── lib/api.ts         fetch wrapper (base URL, JSON, errors)
    └── css/               reset, page, menu, home
```

## Run

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:1212
```

Needs Node 20.19+ or 22.12+.

| Command | Does |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` | typecheck + production build |
| `npm run typecheck` | `tsc -b` |
| `npm run lint` | oxlint |

## Connect to Django

`.env`

```
VITE_API_URL=http://localhost:8000/api
```

- Backend must be running (`python manage.py runserver`).
- Backend `.env` needs `CORS_ALLOWED_ORIGINS=http://localhost:1212`.
- Paths end with a slash: `api.get('/users/')`, not `'/users'`.
- Restart `npm run dev` after editing `.env`.

## Add a page

1. Create `src/tools/pages/Posts.tsx`

```tsx
import { useGetPosts } from "../hooks/GET/useGetPosts";

export default function Posts() {
  const { posts, loading, error } = useGetPosts();

  if (loading) return <p className="page-text">Loading…</p>;
  if (error) return <p className="page-text">{error}</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">Posts</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

2. Add the route in `src/ts/App.tsx`

```tsx
import Posts from '../tools/pages/Posts'
...
<Route path="posts" element={<Posts />} />
```

3. Add the menu item in `src/tools/shared/Menu.tsx` (pick an icon from [react-icons/fi](https://react-icons.github.io/react-icons/icons/fi/))

```tsx
{ label: "Posts", icon: <FiFileText />, href: "/posts", mobile: true },
```

Pages `Users`, `Analytics`, `Reports`, `Database`, `Security`, `Settings`, `Help` are empty stubs. Replace them the same way. Delete the ones you don't need (file, route, menu item).

## Fetch data (GET hook)

Copy `hooks/GET/useGetUsers.ts`, change the type and the path.

`src/tools/hooks/GET/useGetPosts.ts`

```ts
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export type Post = {
  id: number
  title: string
  body: string
  created: string
}

export function useGetPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    api
      .get<Post[]>('/posts/', { signal: controller.signal })
      .then(setPosts)
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { posts, loading, error }
}
```

## Send data (POST hook)

`src/tools/hooks/POST/usePostPost.ts`

```ts
import { useState } from 'react'
import { api } from '../../lib/api'
import type { Post } from '../GET/useGetPosts'

export type PostBody = Pick<Post, 'title' | 'body'>

export function usePostPost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createPost(body: PostBody) {
    setLoading(true)
    setError(null)

    try {
      return await api.post<Post>('/posts/', body)
    } catch (err) {
      setError((err as Error).message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createPost, loading, error }
}
```

Use it in a page:

```tsx
const { createPost, loading, error } = usePostPost()

<button onClick={() => createPost({ title: "Hello", body: "" })} disabled={loading}>
  Add
</button>
```

PUT, PATCH, DELETE: `api.put`, `api.patch`, `api.delete` work the same way (see `lib/api.ts`).

## Add an env variable

1. `.env` and `.env.example`: `VITE_MY_VAR=value` (must start with `VITE_`)
2. `src/ts/env.d.ts`: add `readonly VITE_MY_VAR: string`
3. Use it: `import.meta.env.VITE_MY_VAR`

## Next steps

- **Login:** `lib/api.ts` already sends `Authorization: Bearer <token>` from `localStorage.getItem('token')`. The Django backend does not check tokens yet. Add auth there first (e.g. DRF token or JWT), then save the token after login.
- **Protected pages:** wrap routes in a component that redirects to `/login` when there is no token.
- **Forms:** plain `useState` is enough until forms get big.
- **Shared server state / caching:** add TanStack Query only when hooks start repeating loading and refetch logic.
- **Production:** `npm run build` outputs `dist/`. Set `VITE_API_URL` to the real API URL before building, and add the frontend origin to the backend `CORS_ALLOWED_ORIGINS`.

## Built-in helpers

- Theme toggle: `Ctrl+J` or the menu button (`hooks/LOCAL/useTheme.ts`)
- Shortcuts: `useShortcuts({ "ctrl+k": () => ... })` (`hooks/LOCAL/useShortcuts.ts`)
- Error handling: `ErrorBoundary` wraps every page, so one broken page doesn't blank the app

## Reference links

- React: https://react.dev/learn
- React Router: https://reactrouter.com/start/declarative/routing
- Vite env variables: https://vite.dev/guide/env-and-mode
- Vite build: https://vite.dev/guide/build
- react-icons: https://react-icons.github.io/react-icons/
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API