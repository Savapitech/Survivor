import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Field.module.css';

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function Field({
  label,
  hint,
  error,
  required,
  className,
  ...inputProps
}: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <>
            {' '}
            <span className={styles.required} aria-hidden="true">
              *
            </span>
            <span className="visually-hidden">requis</span>
          </>
        )}
      </label>
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      <input
        id={id}
        className={`${styles.input} ${error ? styles.invalid : ''} ${className ?? ''}`}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        required={required}
        {...inputProps}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
