import type { ReactNode } from 'react'
import { FiAlertTriangle, FiInbox } from 'react-icons/fi'

// building blocks every data page needs: loading, empty and error states

// grey placeholder bars while data loads; `rows` = how many lines to fake
export function Skeleton({ rows = 3, height = '1rem' }: { rows?: number; height?: string }) {
  return (
    <div className="ui-skeleton" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className="ui-skeleton-bar" style={{ height }} />
      ))}
    </div>
  )
}

export function EmptyState({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="ui-state">
      <FiInbox className="ui-state-icon" aria-hidden />
      <p className="ui-state-title">{title}</p>
      {text && <p className="page-text">{text}</p>}
      {children}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="ui-state ui-state-error" role="alert">
      <FiAlertTriangle className="ui-state-icon" aria-hidden />
      <p className="ui-state-title">Couldn't load data</p>
      <p className="page-text">{message}</p>
      {onRetry && (
        <button type="button" className="page-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
