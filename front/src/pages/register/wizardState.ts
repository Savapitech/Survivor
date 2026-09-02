import { createContext, useContext } from 'react';

export interface WizardState {
  userId: string | null;
  email: string;
  role: 'seeker' | 'recruiter' | null;
  name: string;
  lastname: string;
  video: string;
  competenceIds: number[];
  localisationIds: number[];
  activitySectorIds: number[];
  companyName: string;
  seekerId: number | null;
}

export const initialWizardState: WizardState = {
  userId: null,
  email: '',
  role: null,
  name: '',
  lastname: '',
  video: '',
  competenceIds: [],
  localisationIds: [],
  activitySectorIds: [],
  companyName: '',
  seekerId: null,
};

interface WizardContextValue {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error('useWizard');
  }
  return ctx;
}
