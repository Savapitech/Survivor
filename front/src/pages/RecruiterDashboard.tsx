import { Link, Navigate, useSearchParams } from 'react-router-dom';
import type { InteractionType } from '../api/models';
import { listSent, removeFavorite } from '../api/interactions';
import { useSession } from '../context/SessionContext';
import { useAnnounce } from '../context/AnnounceContext';
import { useAsync } from '../hooks/useAsync';
import { usePagination } from '../hooks/usePagination';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate } from '../utils/format';
import styles from './RecruiterDashboard.module.css';

const TABS: { value: InteractionType | undefined; label: string }[] = [
  { value: undefined, label: 'Tous' },
  { value: 'contact', label: 'Contactés' },
  { value: 'favorite', label: 'Favoris' },
  { value: 'view', label: 'Vus' },
  { value: 'like', label: 'Aimés' },
];

export function RecruiterDashboard() {
  useDocumentTitle('Mes candidats');
  const { session, isRecruiter } = useSession();
  const { announce } = useAnnounce();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pageSize, goToPage, resetPage } = usePagination();

  const type =
    (searchParams.get('type') as InteractionType | null) ?? undefined;
  const recruiterId = session?.recruiterId;

  const { data, loading, error, refetch } = useAsync(
    () =>
      recruiterId
        ? listSent(recruiterId, { type, page, pageSize })
        : Promise.reject(new Error('no recruiter')),
    [recruiterId, type, page, pageSize],
  );

  if (!isRecruiter || !recruiterId) {
    return <Navigate to="/" replace />;
  }

  function handleTabChange(nextType: InteractionType | undefined) {
    setSearchParams(nextType ? { type: nextType } : {});
    resetPage();
  }

  async function handleRemoveFavorite(seekerId: number) {
    await removeFavorite(recruiterId!, seekerId);
    announce('Profil retiré des favoris.');
    refetch();
  }

  return (
    <section>
      <h1>Mes candidats</h1>

      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Filtrer par type d'interaction"
      >
        {TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={type === tab.value}
            className={`${styles.tab} ${type === tab.value ? styles.tabActive : ''}`}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <LoadingState label="Chargement..." />}
      {error && <ErrorState onRetry={refetch} />}
      {data && data.data.length === 0 && (
        <EmptyState>Aucun candidat dans cette liste.</EmptyState>
      )}
      {data && data.data.length > 0 && (
        <>
          <ul className={styles.list}>
            {data.data.map((item) => (
              <li key={item.id} className={styles.item}>
                <span>
                  <Link to={`/profils/${item.seeker.id}`}>
                    {item.seeker.name} {item.seeker.lastname}
                  </Link>{' '}
                  - {formatDate(item.createdAt)}
                </span>
                {item.type === 'favorite' && (
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveFavorite(item.seeker.id)}
                  >
                    Retirer des favoris
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={goToPage}
          />
        </>
      )}
    </section>
  );
}
