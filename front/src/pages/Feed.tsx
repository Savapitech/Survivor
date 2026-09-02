import { useEffect, useId, useState } from 'react';
import { listSeekers } from '../api/seekers';
import { listCompetences } from '../api/competences';
import { listActivitySectors } from '../api/activitySectors';
import { listLocalisations } from '../api/localisations';
import {
  createInteraction,
  listSent,
  removeFavorite,
} from '../api/interactions';
import { useSession } from '../context/SessionContext';
import { useAnnounce } from '../context/AnnounceContext';
import { useAsync } from '../hooks/useAsync';
import { usePagination } from '../hooks/usePagination';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ChipSelector } from '../components/ui/ChipSelector';
import { Pagination } from '../components/ui/Pagination';
import { ProfileCard } from '../components/profile/ProfileCard';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import styles from './Feed.module.css';

export function Feed() {
  useDocumentTitle('Feed candidats');
  const { session, isRecruiter } = useSession();
  const { announce } = useAnnounce();
  const searchId = useId();
  const { page, pageSize, goToPage, resetPage } = usePagination();

  const [search, setSearch] = useState('');
  const [competenceIds, setCompetenceIds] = useState<number[]>([]);
  const [localisationIds, setLocalisationIds] = useState<number[]>([]);
  const [activitySectorIds, setActivitySectorIds] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [contactedIds, setContactedIds] = useState<Set<number>>(new Set());

  const competences = useAsync(() => listCompetences({ pageSize: 100 }), []);
  const sectors = useAsync(() => listActivitySectors({ pageSize: 100 }), []);
  const localisations = useAsync(
    () => listLocalisations({ pageSize: 100 }),
    [],
  );

  const feed = useAsync(
    () =>
      listSeekers({
        page,
        pageSize,
        search: search || undefined,
        competenceIds,
        localisationIds,
        activitySectorIds,
      }),
    [page, pageSize, search, competenceIds, localisationIds, activitySectorIds],
  );

  useEffect(() => {
    if (!session?.recruiterId) return;
    listSent(session.recruiterId, { type: 'favorite', pageSize: 100 })
      .then((res) => setFavoriteIds(new Set(res.data.map((i) => i.seeker.id))))
      .catch(() => setFavoriteIds(new Set()));
    listSent(session.recruiterId, { type: 'contact', pageSize: 100 })
      .then((res) => setContactedIds(new Set(res.data.map((i) => i.seeker.id))))
      .catch(() => setContactedIds(new Set()));
  }, [session?.recruiterId]);

  const recruiterId = isRecruiter ? session?.recruiterId : undefined;

  async function handleContact(seekerId: number) {
    if (!recruiterId) return;
    await createInteraction({ type: 'contact', recruiterId, seekerId });
    setContactedIds((prev) => new Set(prev).add(seekerId));
    announce('Le candidat a été contacté.');
  }

  async function handleToggleFavorite(seekerId: number) {
    if (!recruiterId) return;
    if (favoriteIds.has(seekerId)) {
      await removeFavorite(recruiterId, seekerId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(seekerId);
        return next;
      });
      announce('Profil retiré des favoris.');
    } else {
      await createInteraction({ type: 'favorite', recruiterId, seekerId });
      setFavoriteIds((prev) => new Set(prev).add(seekerId));
      announce('Profil ajouté aux favoris.');
    }
  }

  return (
    <div className={styles.layout}>
      <aside aria-label="Filtres de recherche">
        <h2>Filtres</h2>
        <label htmlFor={searchId} className="visually-hidden">
          Mots-clés
        </label>
        <input
          id={searchId}
          type="search"
          placeholder="ex: Chef de projet"
          className={styles.searchField}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
        />
        {competences.data && (
          <ChipSelector
            legend="Compétences clés"
            items={competences.data.data.map((c) => ({
              id: c.id,
              label: c.competence,
            }))}
            selectedIds={competenceIds}
            onChange={(ids) => {
              setCompetenceIds(ids);
              resetPage();
            }}
          />
        )}
        {sectors.data && (
          <ChipSelector
            legend="Secteur d'activité"
            items={sectors.data.data.map((s) => ({
              id: s.id,
              label: s.activitySector,
            }))}
            selectedIds={activitySectorIds}
            onChange={(ids) => {
              setActivitySectorIds(ids);
              resetPage();
            }}
          />
        )}
        {localisations.data && (
          <ChipSelector
            legend="Localisation"
            items={localisations.data.data.map((l) => ({
              id: l.id,
              label: l.localisation,
            }))}
            selectedIds={localisationIds}
            onChange={(ids) => {
              setLocalisationIds(ids);
              resetPage();
            }}
          />
        )}
      </aside>

      <section>
        <h1>Candidats certifiés JEB</h1>
        {feed.loading && <LoadingState label="Chargement des profils..." />}
        {feed.error && <ErrorState onRetry={feed.refetch} />}
        {feed.data && (
          <>
            <p className={styles.resultCount}>
              {feed.data.total} profil(s) trouvé(s)
            </p>
            {feed.data.data.length === 0 ? (
              <EmptyState>
                Aucun profil ne correspond à ces critères.
              </EmptyState>
            ) : (
              <ul className={styles.grid}>
                {feed.data.data.map((seeker) => (
                  <ProfileCard
                    key={seeker.id}
                    seeker={seeker}
                    actions={
                      recruiterId ? (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => handleContact(seeker.id)}
                            disabled={contactedIds.has(seeker.id)}
                          >
                            {contactedIds.has(seeker.id)
                              ? 'Contacté '
                              : 'Contacter'}
                          </Button>
                          <Button
                            variant={
                              favoriteIds.has(seeker.id) ? 'primary' : 'ghost'
                            }
                            onClick={() => handleToggleFavorite(seeker.id)}
                          >
                            {favoriteIds.has(seeker.id)
                              ? 'Favori '
                              : 'Favoris'}
                          </Button>
                        </>
                      ) : undefined
                    }
                  />
                ))}
              </ul>
            )}
            <Pagination
              page={feed.data.page}
              totalPages={feed.data.totalPages}
              onChange={goToPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
