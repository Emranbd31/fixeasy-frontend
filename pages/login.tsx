import { useState } from 'react';
import type { FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { GetServerSideProps } from 'next';
import { getSupabaseServerClient } from '../lib/supabaseServer';
import { useUser } from '../contexts/UserContext';

type LoginProps = {
  redirectTo: string;
};

export default function Login({ redirectTo }: LoginProps) {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { isLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    await router.replace(redirectTo || '/dashboard');
  };

  return (
    <>
      <Head>
        <title>FixEasy Login</title>
      </Head>
      <section className="auth">
        <h1>Sign in to FixEasy</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading || isLoading}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading || isLoading}
          />

          {error ? <p className="error">{error}</p> : null}

          <button type="submit" disabled={loading || isLoading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<LoginProps> = async (ctx) => {
  const supabase = getSupabaseServerClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const redirectTo =
    typeof ctx.query.redirect === 'string' ? ctx.query.redirect : '/dashboard';

  if (session) {
    return {
      redirect: {
        destination: redirectTo,
        permanent: false,
      },
    };
  }

  return {
    props: {
      initialSession: session ?? null,
      redirectTo,
    },
  };
};
