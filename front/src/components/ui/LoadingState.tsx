import styles from './StatusStates.module.css';

export function LoadingState({
  label = 'Chargement en cours...',
}: {
  label?: string;
}) {
  return (
    <p className={styles.state} role="status">
      {label}
    </p>
  );
}
