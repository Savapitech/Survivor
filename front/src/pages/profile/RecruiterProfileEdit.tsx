import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRecruiter, updateRecruiter } from '../../api/recruiters';
import { ApiError } from '../../api/http';
import { useSession } from '../../context/SessionContext';
import { useAnnounce } from '../../context/AnnounceContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { DeleteAccountFlow } from '../../components/profile/DeleteAccountFlow';
import { validateRequired } from '../../utils/validators';

export function RecruiterProfileEdit() {
  useDocumentTitle('Profil recruteur');
  const { session } = useSession();
  const { announce, announceError } = useAnnounce();
  const navigate = useNavigate();

  const recruiterId = session?.recruiterId;
  const recruiter = useAsync(
    () =>
      recruiterId
        ? getRecruiter(recruiterId)
        : Promise.reject(new Error('no recruiter')),
    [recruiterId],
  );
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [localisation, setLocalisation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session?.role !== 'recruiter' || !recruiterId) {
    return <Navigate to="/" replace />;
  }

  if (recruiter.loading) return <LoadingState label="Chargement..." />;
  if (recruiter.error) return <ErrorState onRetry={recruiter.refetch} />;
  if (!recruiter.data) return null;

  if (companyName === null) {
    setCompanyName(recruiter.data.companyName);
    setLocalisation(recruiter.data.localisation);
    return <LoadingState label="Chargement..." />;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const companyError = validateRequired(
      companyName ?? '',
      "Le nom de l'entreprise",
      120,
    );
    const localisationError = validateRequired(
      localisation,
      'La localisation',
      200,
    );
    if (companyError) nextErrors.companyName = companyError;
    if (localisationError) nextErrors.localisation = localisationError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setApiError(null);
    try {
      await updateRecruiter(recruiterId!, {
        companyName: companyName ?? '',
        localisation,
      });
      announce('Entreprise mise à jour.');
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

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Mon entreprise</h1>
      <Field
        label="Nom de l'entreprise"
        value={companyName ?? ''}
        onChange={(e) => setCompanyName(e.target.value)}
        error={errors.companyName}
        required
      />
      <Field
        label="Localisation"
        value={localisation}
        onChange={(e) => setLocalisation(e.target.value)}
        error={errors.localisation}
        required
      />
      {apiError && (
        <p role="alert" style={{ color: 'var(--color-error)' }}>
          {apiError}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-4)',
        }}
      >
        <Button type="submit" loading={submitting}>
          Enregistrer
        </Button>
        <DeleteAccountFlow
          role="recruiter"
          profileId={recruiterId}
          userId={recruiter.data.user.id}
        />
      </div>
    </form>
  );
}
