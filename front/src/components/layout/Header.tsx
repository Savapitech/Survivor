import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import styles from './Header.module.css';

export function Header() {
  const { session, isSeeker, isRecruiter, logout } = useSession();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link to="/" className={styles.brand}>
          <img src="/logo.png" alt="" className={styles.logo} />
          <span className={styles.brandText}>
            <span className={styles.product}>Ministère du Job et Bonheur</span>
            <span className={styles.ministry}>
              Travailler mieux, sourire plus
            </span>
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
              </Link>
              <Link className={styles.navLink} to="/messagerie">
                Messagerie
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
              </Link>
            </>
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
