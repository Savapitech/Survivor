import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  WizardContext,
  initialWizardState,
  type WizardState,
} from './wizardState';
import styles from './RegisterWizardLayout.module.css';

export function RegisterWizardLayout() {
  const [state, setState] = useState<WizardState>(initialWizardState);

  const update = useCallback((patch: Partial<WizardState>) => {
    setState((current) => ({ ...current, ...patch }));
  }, []);

  return (
    <div className={styles.wizard}>
      <WizardContext.Provider value={{ state, update }}>
        <Outlet />
      </WizardContext.Provider>
    </div>
  );
}
