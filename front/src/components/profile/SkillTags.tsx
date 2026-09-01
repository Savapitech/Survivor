import styles from './SkillTags.module.css';

interface SkillTagsProps<T extends { id: number }> {
  label: string;
  items: T[];
  getText: (item: T) => string;
}

export function SkillTags<T extends { id: number }>({
  label,
  items,
  getText,
}: SkillTagsProps<T>) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="visually-hidden">{label}</h3>
      <ul className={styles.list} aria-label={label}>
        {items.map((item) => (
          <li key={item.id} className={styles.tag}>
            {getText(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}
