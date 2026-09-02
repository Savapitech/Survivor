import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getSeeker, updateSeeker } from '../../api/seekers';
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
import { validateRequired, validateVideoUrl } from '../../utils/validators';

export function ProfileEdit() {
  useDocumentTitle('Modifier mon profil');
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { session } = useSession();
  const { announce, announceError } = useAnnounce();
  const navigate = useNavigate();

  const viewerId = session?.userId;
  const seeker = useAsync(
    () => getSeeker(id, { viewerId }),
    [id, viewerId],
  );
  const competences = useAsync(() => listCompetences({ pageSize: 100 }), []);
  const sectors = useAsync(() => listActivitySectors({ pageSize: 100 }), []);
  const localisations = useAsync(
    () => listLocalisations({ pageSize: 100 }),
    [],
  );

  const [form, setForm] = useState<{
    name: string;
    lastname: string;
    video: string;
    competenceIds: number[];
    localisationIds: number[];
    activitySectorIds: number[];
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      video: seeker.data.video ?? '',
      competenceIds: seeker.data.competences.map((c) => c.id),
      localisationIds: seeker.data.localisations.map((l) => l.id),
      activitySectorIds: seeker.data.activitySectors.map((s) => s.id),
    });
    return <LoadingState label="Chargement du formulaire..." />;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    const nextErrors: Record<string, string> = {};
    const nameError = validateRequired(form.name, 'Le prénom', 80);
    const lastnameError = validateRequired(form.lastname, 'Le nom', 80);
    const videoError = validateVideoUrl(form.video);
    if (nameError) nextErrors.name = nameError;
    if (lastnameError) nextErrors.lastname = lastnameError;
    if (videoError) nextErrors.video = videoError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setApiError(null);
    try {
      await updateSeeker(id, {
        name: form.name,
        lastname: form.lastname,
        video: form.video.trim() || undefined,
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

  return (
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
      <Field
        label="Lien de la vidéo"
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={form.video}
        onChange={(e) => setForm({ ...form, video: e.target.value })}
        error={errors.video}
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
  );
}
