import { useState } from 'react';
import { deleteUser, listUsers } from '../../api/users';
import { ApiError } from '../../api/http';
import { useAnnounce } from '../../context/AnnounceContext';
import { useAsync } from '../../hooks/useAsync';
import { usePagination } from '../../hooks/usePagination';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';
import styles from './AdminUsers.module.css';

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrateur',
  seeker: "Demandeur d'emploi",
  recruiter: 'Recruteur',
};

export function AdminUsers() {
  useDocumentTitle('Utilisateurs');
  const { announce, announceError } = useAnnounce();
  const { page, pageSize, goToPage } = usePagination(20);

  const users = useAsync(() => listUsers({ page, pageSize }), [page, pageSize]);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await deleteUser(deletingId);
      announce('Compte supprimé.');
      setDeletingId(null);
      users.refetch();
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
      <h1>Utilisateurs</h1>

      {users.loading && <LoadingState label="Chargement..." />}
      {users.error && <ErrorState onRetry={users.refetch} />}
      {users.data && users.data.data.length === 0 && (
        <EmptyState>Aucun utilisateur.</EmptyState>
      )}

      {users.data && users.data.data.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <caption className="visually-hidden">
                Liste des comptes utilisateurs
              </caption>
              <thead>
                <tr>
                  <th scope="col">E-mail</th>
                  <th scope="col">Rôle</th>
                  <th scope="col">Date de naissance</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.data.data.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>
                      <Badge
                        variant={user.role === 'admin' ? 'success' : 'neutral'}
                      >
                        {ROLE_LABEL[user.role] ?? user.role}
                      </Badge>
                    </td>
                    <td>{formatDate(user.birthDate)}</td>
                    <td>
                      <Button
                        variant="destructive"
                        onClick={() => setDeletingId(user.id)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={users.data.page}
            totalPages={users.data.totalPages}
            onChange={goToPage}
          />
        </>
      )}

      {deletingId && (
        <ConfirmDialog
          title="Supprimer ce compte ?"
          description="Le compte et le profil associé (candidat ou recruteur) seront définitivement supprimés."
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
