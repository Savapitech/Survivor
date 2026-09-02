import { apiFetch } from './http';
import type {
  CreateMessageDto,
  MessagePreview,
  MessageSenderRole,
  Paginated,
  PaginationQuery,
  RecruiterConversation,
  SeekerConversation,
} from './models';

export function sendMessage(dto: CreateMessageDto) {
  return apiFetch<MessagePreview>('/messages', { method: 'POST', body: dto });
}

export function getThread(
  recruiterId: number,
  seekerId: number,
  query: PaginationQuery = {},
) {
  return apiFetch<Paginated<MessagePreview>>('/messages/thread', {
    query: { recruiterId, seekerId, ...query },
  });
}

export function listRecruiterConversations(recruiterId: number) {
  return apiFetch<RecruiterConversation[]>('/messages/conversations/recruiter', {
    query: { recruiterId },
  });
}

export function listSeekerConversations(seekerId: number) {
  return apiFetch<SeekerConversation[]>('/messages/conversations/seeker', {
    query: { seekerId },
  });
}

export function markThreadSeen(
  recruiterId: number,
  seekerId: number,
  viewerRole: MessageSenderRole,
) {
  return apiFetch<{ updated: number }>('/messages/seen', {
    method: 'POST',
    body: { recruiterId, seekerId, viewerRole },
  });
}
