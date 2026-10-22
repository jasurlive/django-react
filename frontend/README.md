# my-vite-template

React 19 + TypeScript + Vite 8, with React Compiler, React Router and Oxlint.
No UI kit, no state library — add only what the project needs.

## Requirements

Node **20.19+** or **22.12+**

## Start a new project

```bash
npx degit <your-username>/my-vite-template my-app
cd my-app
npm install
npm run dev
```

`degit` copies the files without the template's git history.
Using `git clone` instead? Delete the old history first:

```bash
git clone https://github.com/<your-username>/my-vite-template.git my-app
cd my-app
rm -rf .git                        # PowerShell: Remove-Item -Recurse -Force .git
git init
```

Then rename the project in two places:

- `package.json` → `"name"`
- `index.html` → `<title>`

## Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Dev server at http://localhost:1212 |
| `npm run build`     | Type-check + production build → `dist/` |
| `npm run preview`   | Serve the `dist/` build locally     |
| `npm run lint`      | Oxlint                              |
| `npm run typecheck` | TypeScript only                     |

## Structure

```
src/
├── assets/                  images, fonts
├── ts/
│   ├── main.tsx             entry
│   ├── App.tsx              routes, loads reset.css + page.css
│   └── env.d.ts             types for .env variables
└── tools/
    ├── components/          Layout (navbar + page area), ErrorBoundary, Header
    ├── pages/               one file per route, NotFound = 404
    ├── shared/              Menu (navbar)
    ├── lib/                 api.ts — fetch wrapper
    ├── css/                 reset.css (reset + theme), page.css, menu.css …
    └── hooks/
        ├── GET/             useGet<Thing>.ts   — fetch data
        ├── POST/            usePost<Thing>.ts  — send data
        └── LOCAL/           browser-only (theme, shortcuts …)
```

## Conventions

**Components** — one file per component in `tools/components`, default export.

**CSS** — one file per component, same name in lowercase.
Class names are prefixed with the component: `home-container`, `home-menu`, `home-item`.

**Hooks** — sorted by HTTP method. Each returns its data plus `loading` and `error`.

**Theme** — follows the system setting until the user picks one. Colors live as variables in `reset.css` under `:root` and `:root[data-theme='dark']`.
Always use `var(--bg)`, `var(--text)`, `var(--accent)` … never hard-coded colors.
Toggle with `useTheme()` or `Ctrl+J`. The choice is saved and applied before first paint.

**Shortcuts** — `useShortcuts({ 'ctrl+k': open, escape: close })`.
Ignored while typing in inputs. `ctrl` also matches `Cmd` on Mac.

**Memoization** — React Compiler handles it. Skip `useMemo` / `useCallback`.

**API** — use `api` from `tools/lib/api.ts` instead of raw `fetch`:

```ts
const users = await api.get<User[]>('/users')
await api.post('/register', { name, email, password })
```

Base URL comes from `VITE_API_URL`. If `localStorage.token` is set it's sent as `Authorization: Bearer …`.
Failed requests throw an `ApiError` with `status` and the server's response in `data`.

**Errors** — a crash inside a page shows "Something went wrong" and the navbar stays usable.

## Add a page

1. `src/tools/pages/About.tsx` (use `page-container` / `page-title` for a quick start)
2. `src/tools/css/about.css` → classes `about-container`, `about-…` (optional)
3. Add `<Route path="about" element={<About />} />` in `App.tsx`
4. Add `{ label: "About", icon: <FiInfo />, href: "/about" }` to the items in `Menu.tsx`

Every route renders inside `Layout`, so it gets the navbar automatically.
Put page backgrounds / centered content on the page itself — it starts right after the navbar.

## Environment

`.env` holds the API base URL used by the hooks:

```
VITE_API_URL=https://jsonplaceholder.typicode.com
```

Put personal or secret values in `.env.local` (git-ignored).
Only variables starting with `VITE_` reach the browser — never put real secrets there.
Add new variables to `src/ts/env.d.ts` to get autocomplete.

## Deploy

`npm run build`, then upload `dist/`.
Vercel / Netlify / Cloudflare Pages detect Vite automatically:
build command `npm run build`, output folder `dist`.

Routing runs in the browser, so the host must send every URL to `index.html`
(otherwise refreshing `/users` gives a 404). Netlify / Cloudflare: `public/_redirects` with
`/*  /index.html  200`. Vercel: `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.
