import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { UserRole } from '../api/models';
import { SESSION_STORAGE_KEY } from '../api/token';

const STORAGE_KEY = SESSION_STORAGE_KEY;

export interface Session {
  v: 1;
  userId: string;
  email: string;
  role: UserRole;
  token: string;
  seekerId?: number;
  recruiterId?: number;
}

function readStoredSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (
      parsed.v !== 1 ||
      !parsed.userId ||
      !parsed.email ||
      !parsed.role ||
      !parsed.token
    ) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed as Session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

interface SessionContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  isSeeker: boolean;
  isRecruiter: boolean;
  isAdmin: boolean;
  establishSession: (session: Session) => void;
  updateSession: (patch: Partial<Session>) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() =>
    readStoredSession(),
  );

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setSession(readStoredSession());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const establishSession = useCallback((next: Session) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const updateSession = useCallback((patch: Partial<Session>) => {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const value: SessionContextValue = {
    session,
    isAuthenticated: session !== null,
    isSeeker: session?.role === 'seeker',
    isRecruiter: session?.role === 'recruiter',
    isAdmin: session?.role === 'admin',
    establishSession,
    updateSession,
    logout,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession');
  }
  return ctx;
}
