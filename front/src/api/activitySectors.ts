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
