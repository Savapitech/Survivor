import { useId } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import styles from './Modal.module.css';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'primary' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Continuer',
  variant = 'primary',
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  const titleId = useId();

  return (
    <Modal titleId={titleId} title={title} onClose={onCancel}>
      <p>{description}</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
