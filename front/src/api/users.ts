import { apiFetch } from './http';
import type {
  CreateUserDto,
  Paginated,
  PaginationQuery,
  PublicUser,
} from './models';

export function createUser(dto: CreateUserDto) {
  return apiFetch<PublicUser>('/users', { method: 'POST', body: dto });
}

export function listUsers(query: PaginationQuery = {}) {
  return apiFetch<Paginated<PublicUser>>('/users', { query });
}

export function getUser(id: string) {
  return apiFetch<PublicUser>(`/users/${id}`);
}

export function deleteUser(id: string) {
  return apiFetch<void>(`/users/${id}`, { method: 'DELETE' });
}
