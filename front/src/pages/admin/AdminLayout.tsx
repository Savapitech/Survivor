import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Tableau de bord', end: true },
  { to: '/admin/moderation', label: 'Modération vidéo' },
  { to: '/admin/questionnaire', label: 'Questionnaire' },
  { to: '/admin/competences', label: 'Compétences' },
  { to: '/admin/secteurs', label: "Secteurs d'activité" },
  { to: '/admin/localisations', label: 'Localisations' },
  { to: '/admin/utilisateurs', label: 'Utilisateurs' },
];

export function AdminLayout() {
  const { isAdmin } = useSession();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.layout}>
      <nav aria-label="Administration" className={styles.nav}>
        <h2 className={styles.navTitle}>Administration</h2>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
