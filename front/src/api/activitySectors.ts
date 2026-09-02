import { apiFetch } from './http';
import type { ActivitySector, Paginated, PaginationQuery } from './models';

export function listActivitySectors(query: PaginationQuery = {}) {
  return apiFetch<Paginated<ActivitySector>>('/activity-sectors', { query });
}

export function createActivitySector(activitySector: string) {
  return apiFetch<ActivitySector>('/activity-sectors', {
    method: 'POST',
    body: { activitySector },
  });
}

export function updateActivitySector(id: number, activitySector: string) {
  return apiFetch<ActivitySector>(`/activity-sectors/${id}`, {
    method: 'PATCH',
    body: { activitySector },
  });
}

export function deleteActivitySector(id: number) {
  return apiFetch<void>(`/activity-sectors/${id}`, { method: 'DELETE' });
}
