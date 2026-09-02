import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listSeekers } from '../api/seekers';
import { listCompetences } from '../api/competences';
import { listActivitySectors } from '../api/activitySectors';
import { listLocalisations } from '../api/localisations';
import {
  createInteraction,
  listSent,
  removeFavorite,
  removeLike,
} from '../api/interactions';
import { ApiError } from '../api/http';
import type { SeekerListItem } from '../api/models';
import { useSession } from '../context/SessionContext';
import { useAnnounce } from '../context/AnnounceContext';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ChipSelector } from '../components/ui/ChipSelector';
import { FeedSlide } from '../components/profile/FeedSlide';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import styles from './Feed.module.css';

const PAGE_SIZE = 8;

export function Feed() {
  useDocumentTitle('Feed candidats');
  const { session, isRecruiter } = useSession();
  const { announce } = useAnnounce();
  const navigate = useNavigate();
  const searchId = useId();
  const filtersTitleId = useId();

  const [search, setSearch] = useState('');
  const [competenceIds, setCompetenceIds] = useState<number[]>([]);
  const [localisationIds, setLocalisationIds] = useState<number[]>([]);
  const [activitySectorIds, setActivitySectorIds] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [contactedIds, setContactedIds] = useState<Set<number>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [items, setItems] = useState<SeekerListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState(2);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const requestId = useRef(0);

  const reelRef = useRef<HTMLUListElement | null>(null);
  const sentinelRef = useRef<HTMLLIElement | null>(null);

  const recruiterId = isRecruiter ? session?.recruiterId : undefined;

  const competences = useAsync(() => listCompetences({ pageSize: 100 }), []);
  const sectors = useAsync(() => listActivitySectors({ pageSize: 100 }), []);
  const localisations = useAsync(
    () => listLocalisations({ pageSize: 100 }),
    [],
  );

  const loadFirstPage = useCallback(() => {
    const id = ++requestId.current;
    setInitialLoading(true);
    setLoadError(null);
    listSeekers({
      page: 1,
      pageSize: PAGE_SIZE,
      search: search || undefined,
      competenceIds,
      localisationIds,
      activitySectorIds,
      recruiterId,
    })
      .then((res) => {
        if (requestId.current !== id) return;
        setItems(res.data);
        setTotal(res.total);
        setNextPage(2);
        setInitialLoading(false);
      })
      .catch((err: unknown) => {
        if (requestId.current !== id) return;
        setLoadError(
          err instanceof ApiError
            ? err.details.join(' ')
            : 'Une erreur est survenue.',
        );
        setInitialLoading(false);
      });
  }, [search, competenceIds, localisationIds, activitySectorIds, recruiterId]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || initialLoading || items.length >= total) return;
    setLoadingMore(true);
    listSeekers({
      page: nextPage,
      pageSize: PAGE_SIZE,
      search: search || undefined,
      competenceIds,
      localisationIds,
      activitySectorIds,
      recruiterId,
    })
      .then((res) => {
        setItems((prev) => [...prev, ...res.data]);
        setNextPage((p) => p + 1);
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
  }, [
    loadingMore,
    initialLoading,
    items.length,
    total,
    nextPage,
    search,
    competenceIds,
    localisationIds,
    activitySectorIds,
    recruiterId,
  ]);

  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  const hasItems = items.length > 0;
  useEffect(() => {
    if (!hasItems) return;
    const target = sentinelRef.current;
    const root = reelRef.current;
    if (!target || !root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreRef.current();
        }
      },
      { root, threshold: 0.1 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasItems]);

  useEffect(() => {
    if (!session?.recruiterId) return;
    listSent(session.recruiterId, { type: 'favorite', pageSize: 100 })
      .then((res) => setFavoriteIds(new Set(res.data.map((i) => i.seeker.id))))
      .catch(() => setFavoriteIds(new Set()));
    listSent(session.recruiterId, { type: 'contact', pageSize: 100 })
      .then((res) => setContactedIds(new Set(res.data.map((i) => i.seeker.id))))
      .catch(() => setContactedIds(new Set()));
    listSent(session.recruiterId, { type: 'like', pageSize: 100 })
      .then((res) => setLikedIds(new Set(res.data.map((i) => i.seeker.id))))
      .catch(() => setLikedIds(new Set()));
  }, [session?.recruiterId]);

  async function handleContact(seekerId: number) {
    if (!recruiterId) return;
    await createInteraction({ type: 'contact', recruiterId, seekerId });
    setContactedIds((prev) => new Set(prev).add(seekerId));
    announce('Le candidat a été contacté.');
    navigate(`/messagerie?seekerId=${seekerId}`);
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

  async function handleToggleLike(seekerId: number) {
    if (!recruiterId) return;
    if (likedIds.has(seekerId)) {
      await removeLike(recruiterId, seekerId);
      setLikedIds((prev) => {
        const next = new Set(prev);
        next.delete(seekerId);
        return next;
      });
      announce('Recommandation retirée.');
    } else {
      await createInteraction({ type: 'like', recruiterId, seekerId });
      setLikedIds((prev) => new Set(prev).add(seekerId));
      announce('Profil recommandé.');
    }
  }

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">Découvrir les talents</h1>

      <div className={styles.hud}>
        {items.length > 0 && (
          <p className={styles.resultBadge}>
            {total} profil(s)
            <span className="visually-hidden"> correspondant aux filtres</span>
          </p>
        )}
        <Button variant="secondary" onClick={() => setFiltersOpen(true)}>
          Filtres
        </Button>
      </div>

      {initialLoading && (
        <div className={styles.centerState}>
          <LoadingState label="Chargement des profils..." />
        </div>
      )}

      {!initialLoading && loadError && (
        <div className={styles.centerState}>
          <ErrorState onRetry={loadFirstPage} />
        </div>
      )}

      {!initialLoading && !loadError && items.length === 0 && (
        <div className={styles.centerState}>
          <EmptyState>Aucun profil ne correspond à ces critères.</EmptyState>
        </div>
      )}

      {!initialLoading && !loadError && items.length > 0 && (
        <ul
          className={styles.reel}
          ref={reelRef}
          tabIndex={0}
          aria-label="Profils de candidats. Utilisez les flèches du clavier pour faire défiler."
        >
          {items.map((seeker) => (
            <FeedSlide
              key={seeker.id}
              seeker={seeker}
              interactive={Boolean(recruiterId)}
              liked={likedIds.has(seeker.id)}
              contacted={contactedIds.has(seeker.id)}
              favorited={favoriteIds.has(seeker.id)}
              onToggleLike={() => handleToggleLike(seeker.id)}
              onContact={() => handleContact(seeker.id)}
              onToggleFavorite={() => handleToggleFavorite(seeker.id)}
            />
          ))}
          <li ref={sentinelRef} className={styles.endSlide}>
            {loadingMore ? (
              <LoadingState label="Chargement de profils supplémentaires..." />
            ) : items.length >= total ? (
              <p className={styles.endMessage}>
                Vous avez vu tous les profils disponibles.
              </p>
            ) : null}
          </li>
        </ul>
      )}

      {filtersOpen && (
        <Modal
          titleId={filtersTitleId}
          title="Filtres"
          onClose={() => setFiltersOpen(false)}
        >
          <label htmlFor={searchId} className="visually-hidden">
            Mots-clés
          </label>
          <input
            id={searchId}
            type="search"
            placeholder="ex: Chef de projet"
            className={styles.searchField}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {competences.data && (
            <ChipSelector
              legend="Compétences clés"
              items={competences.data.data.map((c) => ({
                id: c.id,
                label: c.competence,
              }))}
              selectedIds={competenceIds}
              onChange={setCompetenceIds}
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
              onChange={setActivitySectorIds}
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
              onChange={setLocalisationIds}
            />
          )}
          <div className={styles.modalActions}>
            <Button onClick={() => setFiltersOpen(false)}>Appliquer</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
