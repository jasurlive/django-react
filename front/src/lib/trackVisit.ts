import { api } from './api'

// tells Django someone opened the site; bot/visitor.py then sends it to the admin on Telegram
// once per browser session (a new tab or a restarted browser counts again)
export function trackVisit() {
  try {
    if (sessionStorage.getItem('visit-sent')) return
    sessionStorage.setItem('visit-sent', '1')
  } catch {
    return // storage blocked (private mode etc.): skip rather than send on every load
  }

  api
    .post('/visits/', {
      path: location.pathname,
      referrer: document.referrer.slice(0, 300),
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}`,
    })
    .catch(() => {}) // backend down or VITE_API_URL unset: the site must still work
}
