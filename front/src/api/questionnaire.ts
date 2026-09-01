import { apiFetch } from './http';
import type { AnswerInput, AttemptView, SubmitAttemptResult } from './models';

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
