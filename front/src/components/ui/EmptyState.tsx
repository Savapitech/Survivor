import type { ReactNode } from 'react';
import styles from './StatusStates.module.css';

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className={styles.state}>{children}</p>;
}
