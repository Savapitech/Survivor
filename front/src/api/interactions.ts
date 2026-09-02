import { apiFetch } from './http';
import type {
  CreateInteractionDto,
  InteractionFull,
  InteractionReceived,
  InteractionSent,
  InteractionType,
  Paginated,
  PaginationQuery,
} from './models';

export function createInteraction(dto: CreateInteractionDto) {
  return apiFetch<InteractionFull>('/interactions', {
    method: 'POST',
    body: dto,
  });
}

export function listSent(
  recruiterId: number,
  query: PaginationQuery & { type?: InteractionType } = {},
) {
  return apiFetch<Paginated<InteractionSent>>('/interactions/sent', {
    query: { recruiterId, ...query },
  });
}

export function listReceived(
  seekerId: number,
  query: PaginationQuery & {
    type?: InteractionType;
    unreadOnly?: boolean;
  } = {},
) {
  return apiFetch<Paginated<InteractionReceived>>('/interactions/received', {
    query: { seekerId, ...query },
  });
}

export function countUnread(seekerId: number) {
  return apiFetch<{ unread: number }>('/interactions/unread-count', {
    query: { seekerId },
  });
}

export function markSeen(id: number, seekerId: number) {
  return apiFetch<InteractionFull>(`/interactions/${id}/seen`, {
    method: 'PATCH',
    query: { seekerId },
  });
}

export function markAllSeen(seekerId: number) {
  return apiFetch<{ updated: number }>('/interactions/seen-all', {
    method: 'POST',
    body: { seekerId },
  });
}

export function removeFavorite(recruiterId: number, seekerId: number) {
  return apiFetch<void>('/interactions/favorite', {
    method: 'DELETE',
    query: { recruiterId, seekerId },
  });
}

export function removeLike(recruiterId: number, seekerId: number) {
  return apiFetch<void>('/interactions/like', {
    method: 'DELETE',
    query: { recruiterId, seekerId },
  });
}
