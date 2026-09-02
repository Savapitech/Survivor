import { apiFetch } from './http';
import type {
  AnswerInput,
  AttemptView,
  Paginated,
  PaginationQuery,
  Question,
  SubmitAttemptResult,
} from './models';

export function listQuestions(
  query: PaginationQuery & { includeInactive?: boolean } = {},
) {
  return apiFetch<Paginated<Question>>('/questionnaire/questions', {
    query,
  });
}

export function createQuestion(label: string, weight?: number) {
  return apiFetch<Question>('/questionnaire/questions', {
    method: 'POST',
    body: { label, weight },
  });
}

export function updateQuestion(
  id: number,
  dto: { label?: string; weight?: number },
) {
  return apiFetch<Question>(`/questionnaire/questions/${id}`, {
    method: 'PATCH',
    body: dto,
  });
}

export function deleteQuestion(id: number) {
  return apiFetch<void>(`/questionnaire/questions/${id}`, {
    method: 'DELETE',
  });
}

export function getCurrentAttempt(seekerId: number) {
  return apiFetch<AttemptView>('/questionnaire/attempts/current', {
    query: { seekerId },
  });
}

export function saveAnswers(attemptId: number, answers: AnswerInput[]) {
  return apiFetch<AttemptView>(`/questionnaire/attempts/${attemptId}/answers`, {
    method: 'PUT',
    body: { answers },
  });
}

export function submitAttempt(attemptId: number) {
  return apiFetch<SubmitAttemptResult>(
    `/questionnaire/attempts/${attemptId}/submit`,
    {
      method: 'POST',
    },
  );
}
