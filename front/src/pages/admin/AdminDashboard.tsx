import { listUsers } from '../../api/users';
import { listSeekers, listSeekersAdmin } from '../../api/seekers';
import { listRecruiters } from '../../api/recruiters';
import { listQuestions } from '../../api/questionnaire';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import styles from './AdminDashboard.module.css';

export function AdminDashboard() {
  useDocumentTitle('Tableau de bord');

  const stats = useAsync(async () => {
    const [users, seekers, recruiters, pendingVideos, questions] =
      await Promise.all([
        listUsers({ pageSize: 1 }),
        listSeekers({ pageSize: 1 }),
        listRecruiters({ pageSize: 1 }),
        listSeekersAdmin({ videoStatus: 'pending', pageSize: 1 }),
        listQuestions({ pageSize: 1, includeInactive: true }),
      ]);
    return {
      users: users.total,
      certifiedSeekers: seekers.total,
      recruiters: recruiters.total,
      pendingVideos: pendingVideos.total,
      questions: questions.total,
    };
  }, []);

  return (
    <section>
      <h1>Tableau de bord</h1>

      {stats.loading && <LoadingState label="Chargement des statistiques..." />}
      {stats.error && <ErrorState onRetry={stats.refetch} />}
      {stats.data && (
        <dl className={styles.grid}>
          <div className={styles.tile}>
            <dt>Comptes utilisateurs</dt>
            <dd>{stats.data.users}</dd>
          </div>
          <div className={styles.tile}>
            <dt>Candidats certifiés visibles publiquement</dt>
            <dd>{stats.data.certifiedSeekers}</dd>
          </div>
          <div className={styles.tile}>
            <dt>Recruteurs</dt>
            <dd>{stats.data.recruiters}</dd>
          </div>
          <div className={styles.tile}>
            <dt>Vidéos en attente de modération</dt>
            <dd>{stats.data.pendingVideos}</dd>
          </div>
          <div className={styles.tile}>
            <dt>Questions du questionnaire</dt>
            <dd>{stats.data.questions}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
