import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  SessionContextProvider,
  useSessionContext,
} from '@supabase/auth-helpers-react';
import { getSupabaseBrowserClient } from '../lib/supabaseBrowser';

type UserContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error?: Error;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

function InternalUserProvider({ children }: { children: ReactNode }) {
  const {
    session,
    isLoading,
    error,
  } = useSessionContext();

  const value = useMemo<UserContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      error: error ?? undefined,
    }),
    [session, isLoading, error]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function UserProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession?: Session | null;
}) {
  const [supabaseClient] = useState(() => getSupabaseBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession ?? undefined}
    >
      <InternalUserProvider>{children}</InternalUserProvider>
    </SessionContextProvider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
