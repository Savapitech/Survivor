import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  deleteSeekerVideo,
  getSeeker,
  updateSeeker,
  uploadSeekerVideo,
} from '../../api/seekers';
import { listCompetences } from '../../api/competences';
import { listActivitySectors } from '../../api/activitySectors';
import { listLocalisations } from '../../api/localisations';
import { ApiError } from '../../api/http';
import { useSession } from '../../context/SessionContext';
import { useAnnounce } from '../../context/AnnounceContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { ChipSelector } from '../../components/ui/ChipSelector';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { validateRequired } from '../../utils/validators';
import { VIDEO_CONSENT_TEXT } from '../../utils/videoConsent';

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function ProfileEdit() {
  useDocumentTitle('Modifier mon profil');
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { session } = useSession();
  const { announce, announceError } = useAnnounce();
  const navigate = useNavigate();

  const viewerId = session?.userId;
  const seeker = useAsync(() => getSeeker(id, { viewerId }), [id, viewerId]);
  const competences = useAsync(() => listCompetences({ pageSize: 100 }), []);
  const sectors = useAsync(() => listActivitySectors({ pageSize: 100 }), []);
  const localisations = useAsync(
    () => listLocalisations({ pageSize: 100 }),
    [],
  );

  const [form, setForm] = useState<{
    name: string;
    lastname: string;
    competenceIds: number[];
    localisationIds: number[];
    activitySectorIds: number[];
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoConsent, setVideoConsent] = useState(false);
  const [videoError, setVideoError] = useState<string | undefined>();
  const [videoBusy, setVideoBusy] = useState(false);

  if (session?.role !== 'seeker' || session.seekerId !== id) {
    return <Navigate to="/" replace />;
  }

  if (
    seeker.loading ||
    competences.loading ||
    sectors.loading ||
    localisations.loading
  ) {
    return <LoadingState label="Chargement du formulaire..." />;
  }
  if (seeker.error) return <ErrorState onRetry={seeker.refetch} />;
  if (!seeker.data) return null;

  if (!form) {
    setForm({
      name: seeker.data.name,
      lastname: seeker.data.lastname,
      competenceIds: seeker.data.competences.map((c) => c.id),
      localisationIds: seeker.data.localisations.map((l) => l.id),
      activitySectorIds: seeker.data.activitySectors.map((s) => s.id),
    });
    return <LoadingState label="Chargement du formulaire..." />;
  }

  function handleVideoFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_VIDEO_BYTES) {
      setVideoError(
        'Le fichier dépasse la taille maximale autorisée (100 Mo).',
      );
      setVideoFile(null);
      return;
    }
    setVideoError(undefined);
    setVideoFile(selected);
  }

  async function handleVideoUpload() {
    if (!videoFile) return;
    if (!videoConsent) {
      setVideoError(
        'Vous devez donner votre consentement pour publier cette vidéo.',
      );
      return;
    }
    setVideoBusy(true);
    setVideoError(undefined);
    try {
      await uploadSeekerVideo(id, videoFile, true);
      setVideoFile(null);
      setVideoConsent(false);
      announce('Vidéo envoyée, elle sera visible après modération.');
      seeker.refetch();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.details.join(' ')
          : 'Une erreur est survenue.';
      setVideoError(message);
      announceError(message);
    } finally {
      setVideoBusy(false);
    }
  }

  async function handleVideoDelete() {
    setVideoBusy(true);
    setVideoError(undefined);
    try {
      await deleteSeekerVideo(id);
      announce('Vidéo supprimée.');
      seeker.refetch();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.details.join(' ')
          : 'Une erreur est survenue.';
      setVideoError(message);
      announceError(message);
    } finally {
      setVideoBusy(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    const nextErrors: Record<string, string> = {};
    const nameError = validateRequired(form.name, 'Le prénom', 80);
    const lastnameError = validateRequired(form.lastname, 'Le nom', 80);
    if (nameError) nextErrors.name = nameError;
    if (lastnameError) nextErrors.lastname = lastnameError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setApiError(null);
    try {
      await updateSeeker(id, {
        name: form.name,
        lastname: form.lastname,
        competenceIds: form.competenceIds,
        localisationIds: form.localisationIds,
        activitySectorIds: form.activitySectorIds,
      });
      announce('Profil mis à jour.');
      navigate(`/profils/${id}`);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.details.join(' ')
          : 'Une erreur est survenue.';
      setApiError(message);
      announceError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const hasVideo = seeker.data.videoView.status !== 'none';

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <h1>Modifier mon profil</h1>

        <Field
          label="Prénom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
        />
        <Field
          label="Nom de famille"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          error={errors.lastname}
          required
        />

        {competences.data && (
          <ChipSelector
            legend="Compétences"
            items={competences.data.data.map((c) => ({
              id: c.id,
              label: c.competence,
            }))}
            selectedIds={form.competenceIds}
            onChange={(ids) => setForm({ ...form, competenceIds: ids })}
          />
        )}
        {sectors.data && (
          <ChipSelector
            legend="Secteur d'activité"
            items={sectors.data.data.map((s) => ({
              id: s.id,
              label: s.activitySector,
            }))}
            selectedIds={form.activitySectorIds}
            onChange={(ids) => setForm({ ...form, activitySectorIds: ids })}
          />
        )}
        {localisations.data && (
          <ChipSelector
            legend="Localisation(s) recherchée(s)"
            items={localisations.data.data.map((l) => ({
              id: l.id,
              label: l.localisation,
            }))}
            selectedIds={form.localisationIds}
            onChange={(ids) => setForm({ ...form, localisationIds: ids })}
          />
        )}

        {apiError && (
          <p role="alert" style={{ color: 'var(--color-error)' }}>
            {apiError}
          </p>
        )}

        <Button type="submit" loading={submitting}>
          Enregistrer
        </Button>
      </form>

      <section
        aria-labelledby="video-section-title"
        style={{ marginTop: 'var(--space-6)' }}
      >
        <h2 id="video-section-title">Vidéo de présentation</h2>

        {hasVideo && (
          <>
            <p>
              Une vidéo est déjà associée à votre profil (statut :{' '}
              {seeker.data.videoStatus === 'pending'
                ? 'en cours de modération'
                : seeker.data.videoStatus === 'approved'
                  ? 'approuvée'
                  : 'refusée'}
              ).
            </p>
            {seeker.data.videoConsentGivenAt && (
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Consentement donné le{' '}
                {new Date(seeker.data.videoConsentGivenAt).toLocaleString(
                  'fr-FR',
                )}
                {seeker.data.videoConsentVersion
                  ? ` (texte version ${seeker.data.videoConsentVersion})`
                  : ''}
                .
              </p>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={handleVideoDelete}
              loading={videoBusy}
            >
              Retirer ma vidéo
            </Button>
          </>
        )}

        <div style={{ marginTop: 'var(--space-4)' }}>
          <label htmlFor="video-file-edit">
            {hasVideo
              ? 'Remplacer par une nouvelle vidéo'
              : 'Ajouter une vidéo'}
          </label>
          <input
            id="video-file-edit"
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleVideoFileChange}
          />
        </div>

        {videoFile && (
          <div role="group" style={{ marginTop: 'var(--space-3)' }}>
            <label
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                alignItems: 'flex-start',
              }}
            >
              <input
                type="checkbox"
                checked={videoConsent}
                onChange={(e) => setVideoConsent(e.target.checked)}
              />
              <span>{VIDEO_CONSENT_TEXT}</span>
            </label>
            <Button
              type="button"
              onClick={handleVideoUpload}
              loading={videoBusy}
              style={{ marginTop: 'var(--space-2)' }}
            >
              Envoyer la vidéo
            </Button>
          </div>
        )}

        {videoError && (
          <p role="alert" style={{ color: 'var(--color-error)' }}>
            {videoError}
          </p>
        )}
      </section>
    </>
  );
}
