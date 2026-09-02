import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { getSeekerByUserId } from '../api/seekers';
import { getRecruiterByUserId } from '../api/recruiters';
import { ApiError } from '../api/http';
import { useSession } from '../context/SessionContext';
import { Field } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { validateEmail, validatePassword } from '../utils/validators';

export function Login() {
  useDocumentTitle('Connexion');
  const { session, isRecruiter, isAdmin, establishSession } = useSession();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (session) {
    return (
      <Navigate
        to={
          isAdmin
            ? '/admin'
            : isRecruiter
              ? '/flux'
              : `/profils/${session.seekerId}`
        }
        replace
      />
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setApiError(null);
    try {
      const { user } = await login({ email, password });

      if (user.role === 'seeker') {
        const seeker = await getSeekerByUserId(user.id);
        establishSession({
          v: 1,
          userId: user.id,
          email: user.email,
          role: 'seeker',
          seekerId: seeker.id,
        });
        navigate(`/profils/${seeker.id}`);
      } else if (user.role === 'recruiter') {
        const recruiter = await getRecruiterByUserId(user.id);
        establishSession({
          v: 1,
          userId: user.id,
          email: user.email,
          role: 'recruiter',
          recruiterId: recruiter.id,
        });
        navigate('/flux');
      } else if (user.role === 'admin') {
        establishSession({
          v: 1,
          userId: user.id,
          email: user.email,
          role: 'admin',
        });
        navigate('/admin');
      }
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? 'Adresse e-mail ou mot de passe incorrect.'
          : err instanceof ApiError
            ? err.details.join(' ')
            : 'Une erreur est survenue.';
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} noValidate>
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
        {apiError && (
          <p role="alert" style={{ color: 'var(--color-error)' }}>
            {apiError}
          </p>
        )}
        <Button type="submit" loading={submitting}>
          Se connecter
        </Button>
      </form>
      <p>
        Pas encore de compte ?{' '}
        <Link to="/inscription/compte">Créer mon profil</Link>
      </p>
    </section>
  );
}
