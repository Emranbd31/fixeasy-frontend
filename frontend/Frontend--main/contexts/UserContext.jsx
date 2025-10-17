import { createContext, useContext, useMemo, useState } from 'react'
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react'
import { getSupabaseBrowserClient } from '../lib/supabaseBrowser'

const UserContext = createContext(undefined)

function InternalUserProvider({ children }) {
  const {
    session,
    isLoading,
    error,
  } = useSessionContext()

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      error: error ?? undefined,
    }),
    [session, isLoading, error]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function UserProvider({
  children,
  initialSession,
}) {
  const [supabaseClient] = useState(() => getSupabaseBrowserClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession ?? undefined}
    >
      <InternalUserProvider>{children}</InternalUserProvider>
    </SessionContextProvider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
