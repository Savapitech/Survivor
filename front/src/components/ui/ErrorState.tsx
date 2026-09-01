import { Button } from './Button';
import styles from './StatusStates.module.css';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Une erreur est survenue lors du chargement.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={`${styles.state} ${styles.error}`} role="alert">
      <p>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className={styles.retry}>
          Réessayer
        </Button>
      )}
    </div>
  );
}
