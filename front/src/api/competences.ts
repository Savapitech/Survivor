import { apiFetch } from './http';
import type { Competence, Paginated, PaginationQuery } from './models';

export function listCompetences(query: PaginationQuery = {}) {
  return apiFetch<Paginated<Competence>>('/competences', { query });
}

export function createCompetence(competence: string) {
  return apiFetch<Competence>('/competences', {
    method: 'POST',
    body: { competence },
  });
}
