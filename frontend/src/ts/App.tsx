import { BrowserRouter, Route, Routes } from 'react-router'
import '../tools/css/reset.css'
import '../tools/css/page.css'
import Layout from '../tools/components/Layout'
import Home from '../tools/pages/Home'
import Users from '../tools/pages/Users'
import Analytics from '../tools/pages/Analytics'
import Reports from '../tools/pages/Reports'
import Database from '../tools/pages/Database'
import Security from '../tools/pages/Security'
import Settings from '../tools/pages/Settings'
import Help from '../tools/pages/Help'
import NotFound from '../tools/pages/NotFound'

// add a page: create it in tools/pages, add a <Route> here and an item in Menu.tsx
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
          <Route path="help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
