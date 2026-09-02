import { apiFetch } from './http';
import type { Localisation, Paginated, PaginationQuery } from './models';

export function listLocalisations(query: PaginationQuery = {}) {
  return apiFetch<Paginated<Localisation>>('/localisations', { query });
}

export function createLocalisation(localisation: string) {
  return apiFetch<Localisation>('/localisations', {
    method: 'POST',
    body: { localisation },
  });
}

export function updateLocalisation(id: number, localisation: string) {
  return apiFetch<Localisation>(`/localisations/${id}`, {
    method: 'PATCH',
    body: { localisation },
  });
}

export function deleteLocalisation(id: number) {
  return apiFetch<void>(`/localisations/${id}`, { method: 'DELETE' });
}
