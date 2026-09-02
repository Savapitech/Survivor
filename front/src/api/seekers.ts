import { apiFetch } from './http';
import type {
  CreateSeekerDto,
  FindSeekersAdminQuery,
  FindSeekersQuery,
  ModerateSeekerVideoDto,
  Paginated,
  SeekerAdmin,
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
      recruiterId: query.recruiterId,
    },
  });
}

export function getSeeker(
  id: number,
  options: { recruiterId?: number; viewerId?: string } = {},
) {
  return apiFetch<SeekerDetail>(`/seekers/${id}`, {
    query: { recruiterId: options.recruiterId, viewerId: options.viewerId },
  });
}

export function getSeekerByUserId(userId: string) {
  return apiFetch<SeekerDetail>(`/seekers/by-user/${userId}`);
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

export function listSeekersAdmin(query: FindSeekersAdminQuery = {}) {
  return apiFetch<Paginated<SeekerAdmin>>('/seekers/admin', { query });
}

export function moderateSeekerVideo(id: number, dto: ModerateSeekerVideoDto) {
  return apiFetch<SeekerAdmin>(`/seekers/admin/${id}/moderate`, {
    method: 'PATCH',
    body: dto,
  });
}
