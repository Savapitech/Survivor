import { Link } from 'react-router-dom';
import type { AttemptView } from '../../api/models';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatScore } from '../../utils/format';

interface QuestionnaireResultProps {
  attempt: AttemptView;
  seekerId: number;
}

export function QuestionnaireResult({
  attempt,
  seekerId,
}: QuestionnaireResultProps) {
  const certified = (attempt.score ?? 0) >= 60;

  return (
    <section>
      <h1>Résultat de votre certification</h1>
      {attempt.score !== null && (
        <p>
          Score obtenu : <strong>{formatScore(attempt.score)}</strong>
        </p>
      )}
      {certified ? (
        <Badge variant="success">Permis de Travailler JEB obtenu</Badge>
      ) : (
        <Badge variant="warning">
          Certification non obtenue (seuil : 60 %)
        </Badge>
      )}
      <p style={{ marginTop: 'var(--space-5)' }}>
        <Link to={`/profils/${seekerId}`}>
          <Button>Retour à mon profil</Button>
        </Link>
      </p>
    </section>
  );
}
