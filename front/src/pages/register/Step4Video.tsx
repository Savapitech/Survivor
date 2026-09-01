import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createSeeker } from '../../api/seekers';
import { ApiError } from '../../api/http';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useAnnounce } from '../../context/AnnounceContext';
import { useSession } from '../../context/SessionContext';
import { validateVideoUrl } from '../../utils/validators';
import { useWizard } from './wizardState';
import styles from './RegisterWizardLayout.module.css';

export function Step4Video() {
  useDocumentTitle('Inscription');
  const { state } = useWizard();
  const { establishSession } = useSession();
  const { announceError } = useAnnounce();
  const navigate = useNavigate();

  const [video, setVideo] = useState(state.video);
  const [error, setError] = useState<string | undefined>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!state.userId || state.role !== 'seeker' || !state.name) {
    return <Navigate to="/inscription/compte" replace />;
  }

  async function finish(videoUrl?: string) {
    if (!state.userId) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const seeker = await createSeeker({
        name: state.name,
        lastname: state.lastname,
        userId: state.userId,
        video: videoUrl,
        competenceIds: state.competenceIds,
        localisationIds: state.localisationIds,
        activitySectorIds: state.activitySectorIds,
      });
      establishSession({
        v: 1,
        userId: state.userId,
        email: state.email,
        role: 'seeker',
        seekerId: seeker.id,
      });
      navigate('/inscription/certification-prompt');
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const videoError = validateVideoUrl(video);
    setError(videoError);
    if (videoError) return;
    finish(video.trim() || undefined);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className={styles.step}>Dernière étape - Votre vidéo</p>
      <h1>Téléchargez une vidéo pour vous présenter</h1>
      <p>
        Un lien YouTube ou Vimeo (fichier de moins de 100 Mo si vous l'hébergez
        vous-même).
      </p>

      <Field
        label="Lien de la vidéo"
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={video}
        onChange={(e) => setVideo(e.target.value)}
        error={error}
      />

      {apiError && (
        <p role="alert" style={{ color: 'var(--color-error)' }}>
          {apiError}
        </p>
      )}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => finish(undefined)}
          disabled={submitting}
        >
          Continuer sans télécharger de vidéo
        </Button>
        <Button type="submit" loading={submitting}>
          Continuer
        </Button>
      </div>
    </form>
  );
}
