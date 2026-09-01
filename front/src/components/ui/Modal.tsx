import type { ReactNode } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './Modal.module.css';

interface ModalProps {
  titleId: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ titleId, title, onClose, children }: ModalProps) {
  const containerRef = useFocusTrap<HTMLDivElement>(true, onClose);

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog}
      >
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
