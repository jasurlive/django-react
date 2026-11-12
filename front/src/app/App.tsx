import { BrowserRouter, Route, Routes } from 'react-router'
import '../css/reset.css'
import '../css/theme.css'
import '../css/page.css'
import '../css/ui.css'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Users from '../pages/Users'
import Analytics from '../pages/Analytics'
import Reports from '../pages/Reports'
import Database from '../pages/Database'
import Security from '../pages/Security'
import Settings from '../pages/Settings'
import Info from '../pages/Info'
import NotFound from '../pages/NotFound'

// add a page: create it in pages, add a <Route> here and an item in Menu.tsx
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="database" element={<Database />} />
          <Route path="security" element={<Security />} />
          <Route path="settings" element={<Settings />} />
          <Route path="info" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
