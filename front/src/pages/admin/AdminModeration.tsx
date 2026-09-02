import { useId, useState } from 'react';
import { listSeekersAdmin, moderateSeekerVideo } from '../../api/seekers';
import { ApiError } from '../../api/http';
import { useSession } from '../../context/SessionContext';
import { useAnnounce } from '../../context/AnnounceContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { toEmbedUrl } from '../../utils/video';
import styles from './AdminModeration.module.css';

export function AdminModeration() {
  useDocumentTitle('Modération vidéo');
  const { session } = useSession();
  const { announce, announceError } = useAnnounce();
  const rejectTitleId = useId();

  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const pending = useAsync(
    () => listSeekersAdmin({ videoStatus: 'pending', pageSize: 50 }),
    [],
  );

  async function handleApprove(id: number) {
    if (!session) return;
    setSubmittingId(id);
    try {
      await moderateSeekerVideo(id, {
        status: 'approved',
        adminUserId: session.userId,
      });
      announce('Vidéo approuvée.');
      pending.refetch();
    } catch (err) {
      announceError(
        err instanceof ApiError ? err.details.join(' ') : 'Erreur.',
      );
    } finally {
      setSubmittingId(null);
    }
  }

  function openReject(id: number) {
    setRejectingId(id);
    setReason('');
    setFormError(null);
  }

  async function handleReject(event: React.FormEvent) {
    event.preventDefault();
    if (!session || rejectingId === null) return;
    if (!reason.trim()) {
      setFormError('Le motif de refus est requis.');
      return;
    }
    setSubmittingId(rejectingId);
    try {
      await moderateSeekerVideo(rejectingId, {
        status: 'rejected',
        reason: reason.trim(),
        adminUserId: session.userId,
      });
      announce('Vidéo refusée.');
      setRejectingId(null);
      pending.refetch();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.details.join(' ') : 'Une erreur est survenue.',
      );
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <section>
      <h1>Modération vidéo</h1>
      <p>
        Toute vidéo déposée reste invisible des recruteurs et du public tant
        qu'elle n'a pas été validée ici.
      </p>

      {pending.loading && <LoadingState label="Chargement de la file..." />}
      {pending.error && <ErrorState onRetry={pending.refetch} />}
      {pending.data && pending.data.data.length === 0 && (
        <EmptyState>Aucune vidéo en attente de modération.</EmptyState>
      )}

      {pending.data && pending.data.data.length > 0 && (
        <ul className={styles.list}>
          {pending.data.data.map((seeker) => {
            const embedUrl = seeker.video ? toEmbedUrl(seeker.video) : null;
            return (
              <li key={seeker.id} className={styles.card}>
                <div className={styles.videoWrapper}>
                  {embedUrl ? (
                    <iframe
                      className={styles.iframe}
                      src={embedUrl}
                      title={`Vidéo de présentation de ${seeker.name} ${seeker.lastname}`}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <p className={styles.noVideo}>Lien vidéo invalide.</p>
                  )}
                </div>
                <div className={styles.meta}>
                  <h2 className={styles.name}>
                    {seeker.name} {seeker.lastname}
                  </h2>
                  <p className={styles.email}>{seeker.user.email}</p>
                  <p className={styles.rawUrl}>{seeker.video}</p>
                </div>
                <div className={styles.actions}>
                  <Button
                    onClick={() => handleApprove(seeker.id)}
                    loading={submittingId === seeker.id}
                  >
                    Approuver
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => openReject(seeker.id)}
                    disabled={submittingId === seeker.id}
                  >
                    Refuser
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {rejectingId !== null && (
        <Modal
          titleId={rejectTitleId}
          title="Refuser la vidéo"
          onClose={() => setRejectingId(null)}
        >
          <form onSubmit={handleReject} noValidate>
            <Field
              label="Motif du refus"
              hint="Ce motif sera visible par le candidat dans son espace."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={formError ?? undefined}
              required
            />
            <div className={styles.modalActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setRejectingId(null)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="destructive"
                loading={submittingId === rejectingId}
              >
                Confirmer le refus
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
