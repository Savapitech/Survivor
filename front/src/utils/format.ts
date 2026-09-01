export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatScore(value: number): string {
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} %`;
}
