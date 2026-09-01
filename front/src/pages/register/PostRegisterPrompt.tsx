import { Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import { Button } from '../../components/ui/Button';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import styles from './RegisterWizardLayout.module.css';

export function PostRegisterPrompt() {
  useDocumentTitle('Inscription terminée');
  const { session } = useSession();
  const navigate = useNavigate();

  if (!session?.seekerId) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      <h1>Votre compte a été créé</h1>
      <p>
        Souhaitez-vous remplir dès maintenant le questionnaire de certification
        professionnelle&nbsp;?
      </p>
      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={() => navigate(`/profils/${session.seekerId}`)}
        >
          Passer
        </Button>
        <Button onClick={() => navigate('/questionnaire')}>Continuer</Button>
      </div>
    </section>
  );
}
