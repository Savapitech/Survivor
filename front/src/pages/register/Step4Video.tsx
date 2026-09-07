import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createSeeker, uploadSeekerVideo } from '../../api/seekers';
import { ApiError } from '../../api/http';
import { Button } from '../../components/ui/Button';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useAnnounce } from '../../context/AnnounceContext';
import { useSession } from '../../context/SessionContext';
import { isMinor } from '../../utils/validators';
import { VIDEO_CONSENT_TEXT } from '../../utils/videoConsent';
import { useWizard } from './wizardState';
import styles from './RegisterWizardLayout.module.css';

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function Step4Video() {
  useDocumentTitle('Inscription');
  const { state } = useWizard();
  const { updateSession } = useSession();
  const { announceError } = useAnnounce();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [consentError, setConsentError] = useState<string | undefined>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!state.userId || state.role !== 'seeker' || !state.name) {
    return <Navigate to="/inscription/compte" replace />;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_VIDEO_BYTES) {
      setError('Le fichier dépasse la taille maximale autorisée (100 Mo).');
      setFile(null);
      return;
    }
    setError(undefined);
    setFile(selected);
  }

  async function finish(uploadFile: File | null) {
    if (!state.userId) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const seeker = await createSeeker({
        name: state.name,
        lastname: state.lastname,
        userId: state.userId,
        competenceIds: state.competenceIds,
        localisationIds: state.localisationIds,
        activitySectorIds: state.activitySectorIds,
      });
      if (uploadFile) {
        await uploadSeekerVideo(seeker.id, uploadFile, true);
      }
      updateSession({ seekerId: seeker.id });
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
    const needsConsent = Boolean(file) && !consent;
    setConsentError(
      needsConsent
        ? 'Vous devez donner votre consentement pour publier cette vidéo.'
        : undefined,
    );
    if (needsConsent) return;
    finish(file);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className={styles.step}>Dernière étape - Votre vidéo</p>
      <h1>Téléchargez une vidéo pour vous présenter</h1>
      <p>
        Un fichier vidéo (MP4, WebM ou MOV, 100 Mo maximum). Chaque vidéo est
        vérifiée par notre équipe avant d'être visible des recruteurs.
      </p>

      {state.birthDate && isMinor(state.birthDate) && (
        <p className={styles.minorNotice} role="note">
          Vous êtes mineur : conformément à notre politique de protection des
          mineurs, votre vidéo ne sera jamais rendue publique ni visible par les
          recruteurs, quel que soit son contenu. Seul votre profil textuel
          (compétences, secteur, localisation) pourra être consulté.
        </p>
      )}

      <div>
        <label htmlFor="video-file">Fichier vidéo</label>
        <input
          id="video-file"
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileChange}
        />
        {error && (
          <p role="alert" style={{ color: 'var(--color-error)' }}>
            {error}
          </p>
        )}
      </div>

      {file && (
        <div className={styles.minorNotice} role="group">
          <label
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              alignItems: 'flex-start',
            }}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>{VIDEO_CONSENT_TEXT}</span>
          </label>
          {consentError && (
            <p role="alert" style={{ color: 'var(--color-error)' }}>
              {consentError}
            </p>
          )}
        </div>
      )}

      {apiError && (
        <p role="alert" style={{ color: 'var(--color-error)' }}>
          {apiError}
        </p>
      )}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => finish(null)}
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
