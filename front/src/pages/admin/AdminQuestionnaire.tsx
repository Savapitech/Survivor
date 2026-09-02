import { useId, useState } from 'react';
import {
  createQuestion,
  deleteQuestion,
  listQuestions,
  updateQuestion,
} from '../../api/questionnaire';
import { ApiError } from '../../api/http';
import { useAnnounce } from '../../context/AnnounceContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './AdminQuestionnaire.module.css';

export function AdminQuestionnaire() {
  useDocumentTitle('Questionnaire');
  const { announce, announceError } = useAnnounce();
  const labelFieldId = useId();

  const questions = useAsync(
    () => listQuestions({ pageSize: 100, includeInactive: true }),
    [],
  );

  const [newLabel, setNewLabel] = useState('');
  const [newWeight, setNewWeight] = useState('1');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editWeight, setEditWeight] = useState('1');
  const [savingId, setSavingId] = useState<number | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!newLabel.trim()) {
      setCreateError('L\'intitulé est requis.');
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      await createQuestion(newLabel.trim(), Number(newWeight) || 1);
      setNewLabel('');
      setNewWeight('1');
      announce('Question ajoutée.');
      questions.refetch();
    } catch (err) {
      setCreateError(
        err instanceof ApiError ? err.details.join(' ') : 'Une erreur est survenue.',
      );
    } finally {
      setCreating(false);
    }
  }

  function startEdit(id: number, label: string, weight: number) {
    setEditingId(id);
    setEditLabel(label);
    setEditWeight(String(weight));
  }

  async function handleSaveEdit(id: number) {
    if (!editLabel.trim()) return;
    setSavingId(id);
    try {
      await updateQuestion(id, {
        label: editLabel.trim(),
        weight: Number(editWeight) || 1,
      });
      announce('Question mise à jour.');
      setEditingId(null);
      questions.refetch();
    } catch (err) {
      announceError(
        err instanceof ApiError ? err.details.join(' ') : 'Une erreur est survenue.',
      );
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete() {
    if (deletingId === null) return;
    setDeleting(true);
    try {
      await deleteQuestion(deletingId);
      announce('Question désactivée.');
      setDeletingId(null);
      questions.refetch();
    } catch (err) {
      announceError(
        err instanceof ApiError ? err.details.join(' ') : 'Une erreur est survenue.',
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <h1>Questionnaire de certification</h1>
      <p>
        {questions.data
          ? `${questions.data.data.filter((q) => q.active).length} question(s) active(s) sur ${questions.data.total} au total.`
          : null}
      </p>

      <form onSubmit={handleCreate} className={styles.createForm} noValidate>
        <Field
          label="Nouvelle question"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          error={createError ?? undefined}
        />
        <Field
          label="Poids"
          type="number"
          min={0.1}
          max={10}
          step={0.1}
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          className={styles.weightField}
        />
        <Button type="submit" loading={creating}>
          Ajouter
        </Button>
      </form>

      {questions.loading && <LoadingState label="Chargement..." />}
      {questions.error && <ErrorState onRetry={questions.refetch} />}
      {questions.data && questions.data.data.length === 0 && (
        <EmptyState>Aucune question pour le moment.</EmptyState>
      )}

      {questions.data && questions.data.data.length > 0 && (
        <ul className={styles.list}>
          {questions.data.data.map((question) => (
            <li key={question.id} className={styles.item}>
              {editingId === question.id ? (
                <>
                  <label
                    htmlFor={`${labelFieldId}-${question.id}`}
                    className="visually-hidden"
                  >
                    Modifier l'intitulé
                  </label>
                  <input
                    id={`${labelFieldId}-${question.id}`}
                    className={styles.editInput}
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                  />
                  <input
                    className={styles.editWeight}
                    type="number"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    aria-label="Poids"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleSaveEdit(question.id)}
                    loading={savingId === question.id}
                  >
                    Enregistrer
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingId(null)}>
                    Annuler
                  </Button>
                </>
              ) : (
                <>
                  <span className={styles.label}>
                    {question.label}
                    {!question.active && (
                      <Badge variant="neutral">Désactivée</Badge>
                    )}
                  </span>
                  <span className={styles.weight}>
                    Poids : {question.weight}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      startEdit(question.id, question.label, question.weight)
                    }
                  >
                    Modifier
                  </Button>
                  {question.active && (
                    <Button
                      variant="destructive"
                      onClick={() => setDeletingId(question.id)}
                    >
                      Désactiver
                    </Button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {deletingId !== null && (
        <ConfirmDialog
          title="Désactiver cette question ?"
          description="La question ne sera plus proposée dans les nouvelles tentatives, mais reste conservée dans l'historique des tentatives déjà passées."
          confirmLabel="Désactiver"
          variant="destructive"
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
          loading={deleting}
        />
      )}
    </section>
  );
}
