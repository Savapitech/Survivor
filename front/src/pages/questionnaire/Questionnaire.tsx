import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  getCurrentAttempt,
  saveAnswers,
  submitAttempt,
} from '../../api/questionnaire';
import { ApiError } from '../../api/http';
import type { AttemptView } from '../../api/models';
import { useSession } from '../../context/SessionContext';
import { useAnnounce } from '../../context/AnnounceContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { QuestionBatch } from './QuestionBatch';
import { QuestionnaireResult } from './QuestionnaireResult';
import styles from './Questionnaire.module.css';

const BATCH_SIZE = 10;

export function Questionnaire() {
  useDocumentTitle('Certification JEB');
  const { session, isSeeker } = useSession();
  const { announceError } = useAnnounce();
  const hasFetched = useRef(false);

  const [attempt, setAttempt] = useState<AttemptView | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [batchIndex, setBatchIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    if (!isSeeker || !session?.seekerId || hasFetched.current) return;
    hasFetched.current = true;
    getCurrentAttempt(session.seekerId)
      .then((view) => {
        setAttempt(view);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError
            ? err.details.join(' ')
            : 'Une erreur est survenue.',
        );
        setLoading(false);
      });
  }, [isSeeker, session?.seekerId]);

  if (!isSeeker || !session?.seekerId) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <LoadingState label="Chargment du questionnaire..." />;
  if (error) return <ErrorState message={error} />;
  if (!attempt) return null;

  if (attempt.submittedAt || finalScore !== null) {
    return (
      <QuestionnaireResult
        attempt={
          finalScore !== null ? { ...attempt, score: finalScore } : attempt
        }
        seekerId={session.seekerId}
      />
    );
  }

  const batches = chunk(attempt.questions, BATCH_SIZE);
  const currentBatch = batches[batchIndex] ?? [];
  const isLastBatch = batchIndex === batches.length - 1;
  const allAnswered = currentBatch.every((q) => answers[q.id] !== undefined);

  function handleAnswer(questionId: number, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleNext() {
    if (!attempt) return;
    setSaving(true);
    setError(null);
    try {
      const batchAnswers = currentBatch.map((q) => ({
        questionId: q.id,
        value: answers[q.id],
      }));
      await saveAnswers(attempt.id, batchAnswers);

      if (isLastBatch) {
        const result = await submitAttempt(attempt.id);
        setFinalScore(result.score);
      } else {
        setBatchIndex((i) => i + 1);
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.details.join(' ')
          : 'Une erreur est survenue.';
      setError(message);
      announceError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1>Certification professionnelle</h1>
      <p className={styles.progress}>
        Groupe de questions {batchIndex + 1} sur {batches.length} - attention,
        si vous quittez cette page avant la fin, votre progression sera perdue
        et vous recommencerez.
      </p>

      <QuestionBatch
        questions={currentBatch}
        answers={answers}
        onAnswer={handleAnswer}
      />

      {error && (
        <p role="alert" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <span />
        <Button onClick={handleNext} disabled={!allAnswered} loading={saving}>
          {isLastBatch ? 'Terminer' : 'Suivant'}
        </Button>
      </div>
    </section>
  );
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result.length > 0 ? result : [[]];
}
