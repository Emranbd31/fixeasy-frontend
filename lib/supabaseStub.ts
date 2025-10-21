/*
 * Minimal Supabase client stub used when @supabase/supabase-js cannot be installed.
 * Replace with the official client in production environments.
 */

export interface Session {
  user: { id: string; email?: string | null } | null;
}

interface QueryResult<T> {
  data: T;
  error: Error | null;
}

interface MutationResult<T> {
  data: T | null;
  error: Error | null;
}

const generateId = () => {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* ignore */
  }
  return `stub-${Math.random().toString(36).slice(2, 10)}`;
};

class TableBuilder<T> {
  select(): this {
    return this;
  }

  eq(): this {
    return this;
  }

  async single(): Promise<QueryResult<T | null>> {
    return { data: null, error: null };
  }

  insert(_values: unknown): InsertBuilder {
    return new InsertBuilder();
  }

  update(_values?: unknown): UpdateBuilder {
    return new UpdateBuilder();
  }

  async upsert(_values?: unknown, _options?: unknown): Promise<MutationResult<T>> {
    return { data: null, error: null };
  }
}

class InsertBuilder {
  select(): this {
    return this;
  }

  async single(): Promise<MutationResult<{ id: string }>> {
    return { data: { id: generateId() }, error: null };
  }
}

class UpdateBuilder {
  async eq(): Promise<MutationResult<null>> {
    return { data: null, error: null };
  }
}

class StorageBucket {
  async upload(): Promise<{ error: Error | null }> {
    return { error: null };
  }
}

class StorageClient {
  from(): StorageBucket {
    return new StorageBucket();
  }
}

class SupabaseAuthClient {
  async getSession(): Promise<{ data: { session: Session | null } }> {
    return { data: { session: null } };
  }

  onAuthStateChange(): { data: { subscription: { unsubscribe: () => void } } } {
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  }

  async signInWithPassword(): Promise<{ error: Error | null }> {
    return { error: new Error('Supabase auth is unavailable in this stub environment.') };
  }

  async signUp(): Promise<{ error: Error | null }> {
    return { error: new Error('Supabase auth is unavailable in this stub environment.') };
  }

  async signInWithOAuth(): Promise<{ error: Error | null }> {
    return { error: new Error('Supabase auth is unavailable in this stub environment.') };
  }
}

export interface SupabaseClient<_Database = unknown> {
  auth: SupabaseAuthClient;
  from<T = unknown>(_table: string): {
    select: () => TableBuilder<T>;
    eq: () => TableBuilder<T>;
    single: () => Promise<QueryResult<T | null>>;
    insert: (_values: T) => InsertBuilder;
    update: (_values?: Partial<T>) => UpdateBuilder;
    upsert: (_values?: T, _options?: unknown) => Promise<MutationResult<T>>;
  };
  storage: StorageClient;
}

export function createClient<_Database = unknown>(_url: string, _key: string): SupabaseClient<_Database> {
  return {
    auth: new SupabaseAuthClient(),
    from<T = unknown>(_table: string) {
      return {
        select: () => new TableBuilder<T>(),
        eq: () => new TableBuilder<T>(),
        single: () => new TableBuilder<T>().single(),
        insert: (values: T) => new TableBuilder<T>().insert(values),
        update: (values?: Partial<T>) => new TableBuilder<T>().update(values),
        upsert: (values?: T, options?: unknown) => new TableBuilder<T>().upsert(values, options),
      };
    },
    storage: new StorageClient(),
  };
}
