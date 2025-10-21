'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

import {
  createSupabaseBrowserClient,
  type Database,
} from '@/lib/supabaseClient';

interface SupabaseContextValue {
  client: SupabaseClient<Database>;
  session: Session | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(
  undefined
);

export function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [client] = useState(() => createSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    client.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [client]);

  const value = useMemo(
    () => ({
      client,
      session,
      loading,
    }),
    [client, session, loading]
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseClient(): SupabaseClient<Database> {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabaseClient must be used within SupabaseProvider');
  }

  return context.client;
}

export function useSupabaseSession(): Session | null {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabaseSession must be used within SupabaseProvider');
  }

  return context.session;
}

export function useSupabaseAuthState(): {
  session: Session | null;
  loading: boolean;
} {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabaseAuthState must be used within SupabaseProvider');
  }

  return { session: context.session, loading: context.loading };
}
