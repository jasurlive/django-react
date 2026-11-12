import { useSyncExternalStore } from 'react'

// fullscreen for the whole page; stays in sync when the user leaves with Esc / F11
const subscribe = (listener: () => void) => {
  document.addEventListener('fullscreenchange', listener)
  return () => document.removeEventListener('fullscreenchange', listener)
}

const isFullscreen = () => document.fullscreenElement !== null

export function useFullscreen() {
  const fullscreen = useSyncExternalStore(subscribe, isFullscreen)

  const toggleFullscreen = () => {
    // can be rejected (e.g. iPhone Safari has no page fullscreen), ignore quietly
    const request = fullscreen ? document.exitFullscreen() : document.documentElement.requestFullscreen()
    request.catch(() => {})
  }

  return { fullscreen, toggleFullscreen, supported: document.fullscreenEnabled }
}
