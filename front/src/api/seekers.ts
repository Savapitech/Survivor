import { apiFetch } from './http';
import type {
  CreateSeekerDto,
  FindSeekersQuery,
  Paginated,
  SeekerDetail,
  SeekerListItem,
  UpdateSeekerDto,
} from './models';

export function createSeeker(dto: CreateSeekerDto) {
  return apiFetch<SeekerDetail>('/seekers', { method: 'POST', body: dto });
}

export function listSeekers(query: FindSeekersQuery = {}) {
  return apiFetch<Paginated<SeekerListItem>>('/seekers', {
    query: {
      page: query.page,
      pageSize: query.pageSize,
      competenceIds: query.competenceIds,
      localisationIds: query.localisationIds,
      activitySectorIds: query.activitySectorIds,
      search: query.search,
    },
  });
}

export function getSeeker(id: number) {
  return apiFetch<SeekerDetail>(`/seekers/${id}`);
}

export function updateSeeker(id: number, dto: UpdateSeekerDto) {
  return apiFetch<SeekerDetail>(`/seekers/${id}`, {
    method: 'PATCH',
    body: dto,
  });
}

export function deleteSeeker(id: number) {
  return apiFetch<void>(`/seekers/${id}`, { method: 'DELETE' });
}
