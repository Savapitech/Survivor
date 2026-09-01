import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={styles.nav}>
      <button
        type="button"
        className={styles.pageButton}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Précédent
      </button>
      <span className={styles.status} aria-live="polite">
        Page {page} sur {totalPages}
      </span>
      <button
        type="button"
        className={styles.pageButton}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Suivant
      </button>
    </nav>
  );
}
