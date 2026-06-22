import { NavLink, Outlet } from 'react-router-dom'

import { useApiConnection } from '../../api/hooks'
import { StatusBadge } from '../common/StatusBadge'
import styles from './AppShell.module.css'

const NAV_ITEMS = [
  { to: '/chat', label: 'Chat', short: 'Chat' },
  { to: '/', label: 'Dashboard', short: 'Inicio', end: true },
  { to: '/agents', label: 'Agentes', short: 'Agentes' },
  { to: '/workspaces', label: 'Workspaces', short: 'WS' },
  { to: '/meetings', label: 'Reuniones', short: 'Meet' },
  { to: '/tasks', label: 'Tareas', short: 'Tasks' },
  { to: '/tools', label: 'Herramientas', short: 'Tools' },
  { to: '/system', label: 'Sistema', short: 'Sys' },
] as const

export function AppShell() {
  const { connected, error } = useApiConnection()

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Saltar al contenido
      </a>

      <aside className={styles.sidebar} aria-label="Navegación principal">
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            AE
          </span>
          <div>
            <p className={styles.brandTitle}>AgenteIA Expert</p>
            <p className={styles.brandSubtitle}>Control plane</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.apiStatus}>
          <StatusBadge
            label={connected ? 'API conectada' : 'API offline'}
            variant={connected ? 'success' : 'warning'}
          />
          {error ? <p className={styles.apiError}>{error}</p> : null}
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <main id="main-content" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      <nav className={styles.mobileNav} aria-label="Navegación móvil">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={'end' in item ? item.end : false}
            className={({ isActive }) =>
              isActive ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink
            }
          >
            <span>{item.short}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
