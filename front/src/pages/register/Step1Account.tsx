import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/users';
import { login } from '../../api/auth';
import { ApiError } from '../../api/http';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useAnnounce } from '../../context/AnnounceContext';
import { useSession } from '../../context/SessionContext';
import {
  validateBirthDate,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '../../utils/validators';
import { useWizard } from './wizardState';
import styles from './RegisterWizardLayout.module.css';

type Role = 'seeker' | 'recruiter';

export function Step1Account() {
  useDocumentTitle('Inscription');
  const navigate = useNavigate();
  const { update } = useWizard();
  const { establishSession } = useSession();
  const { announceError } = useAnnounce();
  const roleGroupId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validatePasswordConfirmation(
      password,
      confirmPassword,
    );
    const birthDateError = validateBirthDate(birthDate);
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (confirmError) nextErrors.confirmPassword = confirmError;
    if (birthDateError) nextErrors.birthDate = birthDateError;
    if (!role) nextErrors.role = 'Merci de préciser qui vous êtes.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !role) return;

    setSubmitting(true);
    setApiError(null);
    try {
      const user = await createUser({ email, password, role, birthDate });
      const { access_token } = await login({ email, password });
      establishSession({
        v: 1,
        userId: user.id,
        email: user.email,
        role,
        token: access_token,
      });
      update({ userId: user.id, email: user.email, birthDate, role });
      navigate('/inscription/profil');
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
      <p className={styles.step}>Étape 1 sur 3 - Création de compte</p>
      <h1>Rejoindre JibJob</h1>
      <p>
        Inscrivez-vous gratuitement pour commencer à valoriser vos compétences.
      </p>

      <Field
        label="Adresse e-mail"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      <Field
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
        hint="8 charactères minimum."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />
      <Field
        label="Confirmer le mot de passe"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        required
      />
      <Field
        label="Date de naissance"
        type="date"
        autoComplete="bday"
        hint="Vous devez avoir au moins 16 ans pour vous inscrire."
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        error={errors.birthDate}
        required
      />

      <fieldset aria-describedby={errors.role ? roleGroupId : undefined}>
        <legend>Vous êtes :</legend>
        <div className={styles.roleGroup}>
          <label
            className={`${styles.roleOption} ${role === 'seeker' ? styles.roleOptionSelected : ''}`}
          >
            <input
              type="radio"
              name="role"
              value="seeker"
              checked={role === 'seeker'}
              onChange={() => setRole('seeker')}
            />
            Demandeur d'emploi
          </label>
          <label
            className={`${styles.roleOption} ${role === 'recruiter' ? styles.roleOptionSelected : ''}`}
          >
            <input
              type="radio"
              name="role"
              value="recruiter"
              checked={role === 'recruiter'}
              onChange={() => setRole('recruiter')}
            />
            Recruteur
          </label>
        </div>
        {errors.role && (
          <p
            id={roleGroupId}
            role="alert"
            style={{ color: 'var(--color-error)' }}
          >
            {errors.role}
          </p>
        )}
      </fieldset>

      {apiError && (
        <p role="alert" style={{ color: 'var(--color-error)' }}>
          {apiError}
        </p>
      )}

      <div className={styles.actions}>
        <span />
        <Button type="submit" loading={submitting}>
          Suivant
        </Button>
      </div>
    </form>
  );
}
