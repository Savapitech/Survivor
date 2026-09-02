import { apiFetch } from './http';
import type { LoginDto, LoginResponse } from './models';

export function login(dto: LoginDto) {
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: dto });
}
