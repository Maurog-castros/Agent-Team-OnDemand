import type { ReactNode } from 'react'

import styles from './StatusBadge.module.css'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  neutral: styles.neutral,
  info: styles.info,
}

interface StatusBadgeProps {
  label: string
  variant?: BadgeVariant
}

export function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${VARIANT_CLASS[variant]}`}>{label}</span>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {description ? <p className={styles.pageDescription}>{description}</p> : null}
      </div>
      {actions ? <div className={styles.pageActions}>{actions}</div> : null}
    </header>
  )
}

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className={styles.emptyState} role="status">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Cargando…' }: LoadingStateProps) {
  return (
    <p className={styles.loading} role="status" aria-live="polite">
      {label}
    </p>
  )
}

interface ErrorBannerProps {
  message: string
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className={styles.errorBanner} role="alert">
      {message}
    </div>
  )
}
