import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFound() {
  useDocumentTitle('Page introuvable');
  return (
    <section>
      <h1>Page introuvable</h1>
      <p>Cette page n'existe pas ou plus.</p>
      <Link to="/">Retour à l'accueil</Link>
    </section>
  );
}
