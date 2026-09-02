import { isAllowedVideoUrl } from './video';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_AGE = 16;

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "L'adresse e-mail est requise.";
  if (!EMAIL_RE.test(value)) return 'Adresse e-mail invalide.';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Le mot de passe est requis.';
  if (value.length < 8)
    return 'Le mot de passe doit contenir au moins 8 caractères.';
  return undefined;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): string | undefined {
  if (!confirmation) return 'Merci de confirmer le mot de passe.';
  if (password !== confirmation)
    return 'Les mots de passe ne correspondent pas.';
  return undefined;
}

export function validateRequired(
  value: string,
  fieldLabel: string,
  maxLength = 200,
): string | undefined {
  if (!value.trim()) return `${fieldLabel} est requis.`;
  if (value.length > maxLength)
    return `${fieldLabel} doit contenir moins de ${maxLength} caractères.`;
  return undefined;
}

export function validateBirthDate(value: string): string | undefined {
  if (!value) return 'La date de naissance est requise.';
  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return 'Date de naissance invalide.';

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;

  if (age < MIN_AGE) {
    return `Vous devez avoir au moins ${MIN_AGE} ans pour vous inscrire.`;
  }
  return undefined;
}

export function validateVideoUrl(value: string): string | undefined {
  if (!value.trim()) return undefined;
  if (!isAllowedVideoUrl(value)) {
    return 'Le lien doit venir de YouTube ou Vimeo.';
  }
  return undefined;
}
