import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.columnTitle}>ProfilsActifs</p>
          <p>
            La plateforme publique de valorisation des compétences par la vidéo
            et la certification d'État, éditée par le Ministère du Job et du
            Bonheur.
          </p>
        </div>
        <div>
          <p className={styles.columnTitle}>Institutionnel</p>
          <ul className={styles.links}>
            <li>Ministère du Job et du Bonheur</li>
            <li>La certification JEB</li>
          </ul>
        </div>
        <div>
          <p className={styles.columnTitle}>Légal</p>
          <ul className={styles.links}>
            <li>
              <Link to="/accessibilite">Accessibilité : conforme RGAA AA</Link>
            </li>
            <li>Mentions légales</li>
            <li>Données personnelles</li>
          </ul>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>© 2026 ProfilsActifs - Service public gratuit pour l'emploi.</p>
      </div>
    </footer>
  );
}
