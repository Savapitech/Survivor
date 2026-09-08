import styles from './CountBadge.module.css';

interface CountBadgeProps {
  count: number;
  label: string;
}

const MAX_DISPLAY = 9;

export function CountBadge({ count, label }: CountBadgeProps) {
  if (count <= 0) return null;

  const display = count > MAX_DISPLAY ? `${MAX_DISPLAY}+` : String(count);

  return (
    <span className={styles.badge} role="status" aria-label={label}>
      {display}
    </span>
  );
}
