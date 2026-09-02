import { useId, useState } from 'react';
import type { LookupEntity } from '../../api/models';
import { ApiError } from '../../api/http';
import { useAnnounce } from '../../context/AnnounceContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './AdminLookupCrud.module.css';

interface AdminLookupCrudProps<K extends string> {
  title: string;
  fieldKey: K;
  fieldLabel: string;
  list: (query: { pageSize: number }) => Promise<{ data: LookupEntity<K>[] }>;
  create: (value: string) => Promise<LookupEntity<K>>;
  update: (id: number, value: string) => Promise<LookupEntity<K>>;
  remove: (id: number) => Promise<void>;
}

export function AdminLookupCrud<K extends string>({
  title,
  fieldKey,
  fieldLabel,
  list,
  create,
  update,
  remove,
}: AdminLookupCrudProps<K>) {
  useDocumentTitle(title);
  const { announce, announceError } = useAnnounce();
  const formId = useId();

  const items = useAsync(() => list({ pageSize: 100 }), [list]);

  const [newValue, setNewValue] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!newValue.trim()) {
      setCreateError('Ce champ est requis.');
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      await create(newValue.trim());
      setNewValue('');
      announce(`${fieldLabel} ajouté.`);
      items.refetch();
    } catch (err) {
      setCreateError(
        err instanceof ApiError
          ? err.details.join(' ')
          : 'Une erreur est survenue.',
      );
    } finally {
      setCreating(false);
    }
  }

  function startEdit(item: LookupEntity<K>) {
    setEditingId(item.id);
    setEditValue(item[fieldKey]);
  }

  async function handleSaveEdit(id: number) {
    if (!editValue.trim()) return;
    setSavingId(id);
    try {
      await update(id, editValue.trim());
      announce(`${fieldLabel} mis à jour.`);
      setEditingId(null);
      items.refetch();
    } catch (err) {
      announceError(
        err instanceof ApiError
          ? err.details.join(' ')
          : 'Une erreur est survenue.',
      );
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete() {
    if (deletingId === null) return;
    setDeleting(true);
    try {
      await remove(deletingId);
      announce(`${fieldLabel} supprimé.`);
      setDeletingId(null);
      items.refetch();
    } catch (err) {
      announceError(
        err instanceof ApiError
          ? err.details.join(' ')
          : 'Une erreur est survenue.',
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <h1>{title}</h1>

      <form onSubmit={handleCreate} className={styles.createForm} noValidate>
        <Field
          label={`Ajouter : ${fieldLabel}`}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          error={createError ?? undefined}
        />
        <Button type="submit" loading={creating}>
          Ajouter
        </Button>
      </form>

      {items.loading && <LoadingState label="Chargement..." />}
      {items.error && <ErrorState onRetry={items.refetch} />}
      {items.data && items.data.data.length === 0 && (
        <EmptyState>Aucun élément pour le moment.</EmptyState>
      )}

      {items.data && items.data.data.length > 0 && (
        <ul className={styles.list}>
          {items.data.data.map((item) => (
            <li key={item.id} className={styles.item}>
              {editingId === item.id ? (
                <>
                  <label
                    htmlFor={`${formId}-${item.id}`}
                    className="visually-hidden"
                  >
                    Modifier {fieldLabel}
                  </label>
                  <input
                    id={`${formId}-${item.id}`}
                    className={styles.editInput}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleSaveEdit(item.id)}
                    loading={savingId === item.id}
                  >
                    Enregistrer
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingId(null)}>
                    Annuler
                  </Button>
                </>
              ) : (
                <>
                  <span className={styles.value}>{item[fieldKey]}</span>
                  <Button variant="ghost" onClick={() => startEdit(item)}>
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeletingId(item.id)}
                  >
                    Supprimer
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {deletingId !== null && (
        <ConfirmDialog
          title="Supprimer cet élément ?"
          description="Cette action est irréversible."
          confirmLabel="Supprimer"
          variant="destructive"
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
          loading={deleting}
        />
      )}
    </section>
  );
}
