import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './Messaging.module.css';

export function Messaging() {
  useDocumentTitle('Messagerie');

  return (
    <section>
      <h1>Messagerie</h1>
      <div className={styles.layout}>
        <nav aria-label="Conversations" className={styles.conversations}>
          <h2 className="visually-hidden">Liste des conversations</h2>
          <p>Aucune conversation disponible pour le moment.</p>
        </nav>
        <div className={styles.thread}>
          <p>Sélectionnez une conversation pour l'afficher ici.</p>
        </div>
      </div>
    </section>
  );
}
