import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import { useUnreadCounts } from '../../hooks/useUnreadCounts';
import { CountBadge } from '../ui/CountBadge';
import styles from './Header.module.css';

export function Header() {
  const { session, isSeeker, isRecruiter, isAdmin, logout } = useSession();
  const navigate = useNavigate();
  const unread = useUnreadCounts();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandText}>
            <span className={styles.product}>Compétences+</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className={styles.nav}>
          {isSeeker && session?.seekerId && (
            <>
              <Link
                className={styles.navLink}
                to={`/profils/${session.seekerId}`}
              >
                Mon profil
              </Link>
              <Link className={styles.navLink} to="/notifications">
                Notifications
                <CountBadge
                  count={unread.notifications}
                  label={`${unread.notifications} notification${unread.notifications > 1 ? 's' : ''} non lue${unread.notifications > 1 ? 's' : ''}`}
                />
              </Link>
              <Link className={styles.navLink} to="/messagerie">
                Messagerie
                <CountBadge
                  count={unread.messages}
                  label={`${unread.messages} message${unread.messages > 1 ? 's' : ''} non lu${unread.messages > 1 ? 's' : ''}`}
                />
              </Link>
            </>
          )}
          {!session && (
            <Link className={styles.navLink} to="/flux">
              Profils
            </Link>
          )}
          {isRecruiter && (
            <>
              <Link className={styles.navLink} to="/flux">
                Feed
              </Link>
              <Link className={styles.navLink} to="/candidats?type=favorite">
                Favoris
              </Link>
              <Link className={styles.navLink} to="/candidats">
                Mes candidats
              </Link>
              <Link className={styles.navLink} to="/messagerie">
                Messagerie
                <CountBadge
                  count={unread.messages}
                  label={`${unread.messages} message${unread.messages > 1 ? 's' : ''} non lu${unread.messages > 1 ? 's' : ''}`}
                />
              </Link>
              <Link className={styles.navLink} to="/mon-entreprise">
                Mon entreprise
              </Link>
            </>
          )}
          {isAdmin && (
            <Link className={styles.navLink} to="/admin">
              Administration
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          {session ? (
            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Se déconnecter ({session.email})
            </button>
          ) : (
            <>
              <Link className={styles.navLink} to="/connexion">
                Se connecter
              </Link>
              <Link className={styles.navLink} to="/inscription/compte">
                Créer mon profil
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
