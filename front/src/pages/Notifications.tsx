import { Navigate } from 'react-router-dom';
import { listReceived, markAllSeen, markSeen } from '../api/interactions';
import { useSession } from '../context/SessionContext';
import { useAnnounce } from '../context/AnnounceContext';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate } from '../utils/format';
import styles from './Notifications.module.css';

const TYPE_LABEL: Record<string, string> = {
  view: 'a visionné votre profil',
  contact: 'vous a contacté',
  favorite: 'vous a ajouté en favori',
};

export function Notifications() {
  useDocumentTitle('Notifications');
  const { session, isSeeker } = useSession();
  const { announce } = useAnnounce();

  const seekerId = session?.seekerId;

  const { data, loading, error, refetch } = useAsync(
    () =>
      seekerId
        ? listReceived(seekerId, { pageSize: 50 })
        : Promise.reject(new Error('no seeker')),
    [seekerId],
  );

  const {
    data: views,
    loading: viewsLoading,
    error: viewsError,
  } = useAsync(
    () =>
      seekerId
        ? listReceived(seekerId, { type: 'view', pageSize: 50 })
        : Promise.reject(new Error('no seeker')),
    [seekerId],
  );

  if (!isSeeker || !seekerId) {
    return <Navigate to="/" replace />;
  }

  async function handleMarkSeen(id: number) {
    await markSeen(id, seekerId!);
    refetch();
  }

  async function handleMarkAllSeen() {
    await markAllSeen(seekerId!);
    announce('Toutes les notifications ont été marquées comme lues.');
    refetch();
  }

  return (
    <section>
      <div className={styles.header}>
        <h1>Notifications</h1>
        <Button variant="secondary" onClick={handleMarkAllSeen}>
          Tout marquer comme lu
        </Button>
      </div>

      {loading && <LoadingState label="Chargement des notifications..." />}
      {error && <ErrorState onRetry={refetch} />}
      {data && data.data.length === 0 && (
        <EmptyState>Aucune notification pour le moment.</EmptyState>
      )}
      {data && data.data.length > 0 && (
        <ul className={styles.list}>
          {data.data.map((item) => {
            const unread = !item.seenAt;
            return (
              <li
                key={item.id}
                className={`${styles.item} ${unread ? styles.unread : ''}`}
              >
                <span>
                  {unread && <span aria-hidden="true">● </span>}
                  <strong>{item.recruiter.companyName}</strong>{' '}
                  {TYPE_LABEL[item.type]}.{' '}
                  <span className={styles.date}>
                    {formatDate(item.createdAt)}
                  </span>
                  {unread && <span className="visually-hidden"> - non lu</span>}
                </span>
                {unread && (
                  <Button
                    variant="ghost"
                    onClick={() => handleMarkSeen(item.id)}
                  >
                    Marquer comme lu
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.viewsSection}>
        <h2>Qui a consulté votre profil</h2>
        <p className={styles.viewsDisclaimer}>
          Seules les consultations effectuées par un compte recruteur
          connecté sont enregistrées ici, avec la date et l'organisation
          concernée. Les consultations anonymes (sans connexion) ne sont pas
          comptabilisées.
        </p>

        {viewsLoading && (
          <LoadingState label="Chargement des consultations..." />
        )}
        {viewsError && <ErrorState message={viewsError} />}
        {views && views.data.length === 0 && (
          <EmptyState>
            Aucune consultation de votre profil pour le moment.
          </EmptyState>
        )}
        {views && views.data.length > 0 && (
          <ul className={styles.list}>
            {views.data.map((item) => (
              <li key={item.id} className={styles.item}>
                <span>
                  <strong>{item.recruiter.companyName}</strong> a consulté
                  votre profil.{' '}
                  <span className={styles.date}>
                    {formatDate(item.createdAt)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
