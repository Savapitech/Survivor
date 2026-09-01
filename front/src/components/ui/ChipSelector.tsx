import { useId, useState } from 'react';
import styles from './ChipSelector.module.css';

export interface ChipItem {
  id: number;
  label: string;
}

interface ChipSelectorProps {
  legend: string;
  items: ChipItem[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  searchPlaceholder?: string;
}

export function ChipSelector({
  legend,
  items,
  selectedIds,
  onChange,
  searchPlaceholder = 'Rechercher...',
}: ChipSelectorProps) {
  const [query, setQuery] = useState('');
  const searchId = useId();

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function toggle(id: number) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((existing) => existing !== id)
        : [...selectedIds, id],
    );
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      <label htmlFor={searchId} className="visually-hidden">
        {searchPlaceholder}
      </label>
      <input
        id={searchId}
        type="search"
        className={styles.search}
        placeholder={searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p className={styles.empty}>Aucun résultat.</p>
      ) : (
        <ul className={styles.chips}>
          {filtered.map((item) => {
            const selected = selectedIds.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
                  aria-pressed={selected}
                  onClick={() => toggle(item.id)}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}
