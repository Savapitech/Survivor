import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createRecruiter } from '../../api/recruiters';
import { listLocalisations } from '../../api/localisations';
import { ApiError } from '../../api/http';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { ChipSelector } from '../../components/ui/ChipSelector';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useAnnounce } from '../../context/AnnounceContext';
import { useSession } from '../../context/SessionContext';
import { useAsync } from '../../hooks/useAsync';
import { validateRequired } from '../../utils/validators';
import { useWizard } from './wizardState';
import styles from './RegisterWizardLayout.module.css';

export function Step2Role() {
  useDocumentTitle('Inscription');
  const { state, update } = useWizard();
  const { establishSession } = useSession();
  const { announceError } = useAnnounce();
  const navigate = useNavigate();

  const [name, setName] = useState(state.name);
  const [lastname, setLastname] = useState(state.lastname);
  const [companyName, setCompanyName] = useState(state.companyName);
  const [localisationIds, setLocalisationIds] = useState(state.localisationIds);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const localisations = useAsync(
    () => listLocalisations({ pageSize: 100 }),
    [],
  );

  if (!state.userId || !state.role) {
    return <Navigate to="/inscription/compte" replace />;
  }

  async function handleSeekerSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const nameError = validateRequired(name, 'Le prénom', 80);
    const lastnameError = validateRequired(lastname, 'Le nom', 80);
    if (nameError) nextErrors.name = nameError;
    if (lastnameError) nextErrors.lastname = lastnameError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    update({ name, lastname, localisationIds });
    navigate('/inscription/competences');
  }

  async function handleRecruiterSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const companyError = validateRequired(
      companyName,
      "Le nom de l'entreprise",
      120,
    );
    if (companyError) nextErrors.companyName = companyError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!state.userId) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const recruiter = await createRecruiter({
        companyName,
        userId: state.userId,
      });
      establishSession({
        v: 1,
        userId: state.userId,
        email: state.email,
        role: 'recruiter',
        recruiterId: recruiter.id,
      });
      navigate('/flux');
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

  if (state.role === 'recruiter') {
    return (
      <form onSubmit={handleRecruiterSubmit} noValidate>
        <p className={styles.step}>Étape 2 sur 2 - Votre entreprise</p>
        <h1>Parlez-nous de votre entreprise</h1>
        <Field
          label="Nom de l'entreprise"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          error={errors.companyName}
          required
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
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <Button type="submit" loading={submitting}>
            Créer mon compte
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSeekerSubmit} noValidate>
      <p className={styles.step}>Étape 2 sur 3 - Votre profil</p>
      <h1>Parlez-nous de vous</h1>
      <Field
        label="Prénom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />
      <Field
        label="Nom de famille"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        error={errors.lastname}
        required
      />
      {localisations.loading && <p>Chargement des localisations...</p>}
      {localisations.data && (
        <ChipSelector
          legend="Localisation(s) recherchée(s)"
          items={localisations.data.data.map((l) => ({
            id: l.id,
            label: l.localisation,
          }))}
          selectedIds={localisationIds}
          onChange={setLocalisationIds}
        />
      )}
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Retour
        </Button>
        <Button type="submit">Suivant</Button>
      </div>
    </form>
  );
}
