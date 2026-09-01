import { apiFetch } from './http';
import type {
  CreateRecruiterDto,
  Paginated,
  PaginationQuery,
  RecruiterDetail,
  RecruiterListItem,
  UpdateRecruiterDto,
} from './models';

export function createRecruiter(dto: CreateRecruiterDto) {
  return apiFetch<RecruiterDetail>('/recruiters', {
    method: 'POST',
    body: dto,
  });
}

export function listRecruiters(query: PaginationQuery = {}) {
  return apiFetch<Paginated<RecruiterListItem>>('/recruiters', { query });
}

export function getRecruiter(id: number) {
  return apiFetch<RecruiterDetail>(`/recruiters/${id}`);
}

export function updateRecruiter(id: number, dto: UpdateRecruiterDto) {
  return apiFetch<RecruiterDetail>(`/recruiters/${id}`, {
    method: 'PATCH',
    body: dto,
  });
}

export function deleteRecruiter(id: number) {
  return apiFetch<void>(`/recruiters/${id}`, { method: 'DELETE' });
}
