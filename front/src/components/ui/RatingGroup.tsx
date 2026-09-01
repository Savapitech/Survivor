import { useId } from 'react';
import styles from './RatingGroup.module.css';

const SCALE = [0, 1, 2, 3, 4, 5];

interface RatingGroupProps {
  questionId: number;
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function RatingGroup({
  questionId,
  label,
  value,
  onChange,
}: RatingGroupProps) {
  const name = useId();

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.scale} role="radiogroup" aria-label={label}>
        {SCALE.map((score) => {
          const optionId = `${name}-${score}`;
          return (
            <span className={styles.option} key={score}>
              <input
                type="radio"
                id={optionId}
                name={`question-${questionId}`}
                value={score}
                checked={value === score}
                onChange={() => onChange(score)}
              />
              <label htmlFor={optionId}>{score}</label>
            </span>
          );
        })}
      </div>
      <div className={styles.endLabels} aria-hidden="true">
        <span>Pas du tout d'accord</span>
        <span>Tout à fait d'accord</span>
      </div>
    </fieldset>
  );
}
