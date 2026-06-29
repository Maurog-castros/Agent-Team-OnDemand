import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { Logo } from '../brand/Logo'
import styles from './AppShell.module.css'
import { StatusBar } from './StatusBar'

const NAV_ITEMS = [
  { to: '/chat', label: 'Chat', short: 'Chat', icon: '💬' },
  { to: '/', label: 'Dashboard', short: 'Inicio', end: true, icon: '▦' },
  { to: '/agents', label: 'Agentes', short: 'Agentes', icon: '◎' },
  { to: '/workspaces', label: 'Workspaces', short: 'WS', icon: '▣' },
  { to: '/reunion', label: 'Reunión', short: 'Grupo', icon: '👥' },
  { to: '/meetings', label: 'Reuniones', short: 'Meet', icon: '📅' },
  { to: '/tasks', label: 'Tareas', short: 'Tasks', icon: '☑' },
  { to: '/tools', label: 'Herramientas', short: 'Tools', icon: '⚙' },
  { to: '/system', label: 'Sistema', short: 'Sys', icon: '◈' },
] as const

export function AppShell() {
  const location = useLocation()
  const isChat = location.pathname === '/chat' || location.pathname === '/reunion'

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Saltar al contenido
      </a>

      <aside className={styles.sidebar} aria-label="Navegación principal">
        <div className={styles.brand}>
          <Logo size={28} />
          <div>
            <p className={styles.brandTitle}>AgenteIA Expert</p>
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
                  <span className={styles.navIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.userCard}>
          <div className={styles.userAvatar} aria-hidden="true">
            MA
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Mauricio A.</p>
            <p className={styles.userEmail}>mauro@iamiko.cl</p>
            <p className={styles.userStatus}>
              <span className={styles.userStatusDot} aria-hidden="true" />
              En línea
            </p>
          </div>
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <main
          id="main-content"
          className={isChat ? styles.mainFull : styles.main}
          tabIndex={-1}
        >
          <Outlet />
        </main>
        <StatusBar />
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
