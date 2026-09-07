import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.columnTitle}>JibJob</p>
          <p>
            Plateforme de valorisation des compétences par la vidéo et la
            certification.
          </p>
        </div>
        <div>
          <p className={styles.columnTitle}>Légal</p>
          <ul className={styles.links}>
            <li>
              <Link to="/accessibilite">Accessibilité : non conforme</Link>
            </li>
            <li>Mentions légales</li>
            <li>Données personnelles</li>
          </ul>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>© 2026 JibJob</p>
        <p className={styles.disclaimer}>
          Démonstrateur technique, ne constitue pas un service public en
          exploitation.
        </p>
      </div>
    </footer>
  );
}
