import { listQuestions } from '../../api/questionnaire';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './AdminQuestionnaire.module.css';

export function AdminQuestionnaire() {
  useDocumentTitle('Questionnaire');

  const questions = useAsync(
    () => listQuestions({ pageSize: 100, includeInactive: true }),
    [],
  );

  return (
    <section>
      <h1>Questionnaire de certification</h1>
      <p>
        Le contenu du questionnaire est défini dans le fichier versionné{' '}
        <code>back/certification/questions.v1.json</code> et chargé au
        démarrage du serveur. Il n'est plus modifiable depuis cette page :
        pour changer une question, publiez un nouveau commit sur ce fichier.
      </p>
      <p>
        {questions.data
          ? `${questions.data.data.filter((q) => q.active).length} question(s) active(s) sur ${questions.data.total} au total.`
          : null}
      </p>

      {questions.loading && <LoadingState label="Chargement..." />}
      {questions.error && <ErrorState onRetry={questions.refetch} />}
      {questions.data && questions.data.data.length === 0 && (
        <EmptyState>Aucune question pour le moment.</EmptyState>
      )}

      {questions.data && questions.data.data.length > 0 && (
        <ul className={styles.list}>
          {questions.data.data.map((question) => (
            <li key={question.id} className={styles.item}>
              <span className={styles.label}>
                {question.label}
                {!question.active && <Badge variant="neutral">Désactivée</Badge>}
              </span>
              <span className={styles.weight}>Poids : {question.weight}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
