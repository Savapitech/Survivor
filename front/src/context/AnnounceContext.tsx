import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';

interface AnnounceContextValue {
  announce: (message: string) => void;
  announceError: (message: string) => void;
}

const AnnounceContext = createContext<AnnounceContextValue | null>(null);

export function AnnounceProvider({ children }: { children: ReactNode }) {
  const [polite, setPolite] = useState('');
  const [assertive, setAssertive] = useState('');
  const counter = useRef(0);

  const announce = useCallback((message: string) => {
    counter.current += 1;
    setPolite(`${message} ${counter.current % 2 === 0 ? '​' : ''}`.trim());
  }, []);

  const announceError = useCallback((message: string) => {
    counter.current += 1;
    setAssertive(`${message} ${counter.current % 2 === 0 ? '​' : ''}`.trim());
  }, []);

  return (
    <AnnounceContext.Provider value={{ announce, announceError }}>
      {children}
      <div aria-live="polite" role="status" className="visually-hidden">
        {polite}
      </div>
      <div aria-live="assertive" role="alert" className="visually-hidden">
        {assertive}
      </div>
    </AnnounceContext.Provider>
  );
}

export function useAnnounce(): AnnounceContextValue {
  const ctx = useContext(AnnounceContext);
  if (!ctx) {
    throw new Error('useAnnounc');
  }
  return ctx;
}
