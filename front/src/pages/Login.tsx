import { Link, Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { Button } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function Login() {
  useDocumentTitle('Connexion');
  const { session, isRecruiter } = useSession();

  if (session) {
    return (
      <Navigate
        to={isRecruiter ? '/flux' : `/profils/${session.seekerId}`}
        replace
      />
    );
  }

  return (
    <section>
      <h1>Connexion</h1>
      <p>Aucune session locale trouvée sur cet appareil.</p>
      <Link to="/inscription/compte">
        <Button variant="primary">Créer un compte</Button>
      </Link>
    </section>
  );
}
