'use client';

import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSupabaseClient } from '@/app/providers';
import { FxButton } from '@/components/ui/FxButton';

interface AuthValues {
  email: string;
  password: string;
  name: string;
}

type AuthMode = 'sign-in' | 'sign-up';

export function AuthPanel(): JSX.Element {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<AuthValues>({ email: '', password: '', name: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof AuthValues, string>>>({});

  const handleFieldChange = (field: keyof AuthValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof AuthValues, string>> = {};
    const email = values.email.trim();
    const password = values.password.trim();
    const name = values.name.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (password.length < 6) {
      nextErrors.password = 'Use at least 6 characters';
    }

    if (mode === 'sign-up' && name.length === 0) {
      nextErrors.name = 'Enter your name';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage(null);
    try {
      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email.trim(),
          password: values.password.trim(),
        });
        if (error) throw error;
        setMessage('Signed in successfully. Redirecting…');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email: values.email.trim(),
          password: values.password.trim(),
          options: {
            data: {
              full_name: values.name.trim(),
            },
          },
        });
        if (error) throw error;
        setMessage('Check your inbox to confirm your email and complete sign-up.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setMessage(null);
    const redirectTo = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="glass-surface mx-auto mt-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-3d">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo.svg" alt="FixEasy" width={48} height={48} className="h-12 w-12" />
        <h1 className="text-2xl font-semibold text-white">Access your FixEasy account</h1>
        <p className="text-sm text-white/60">
          Sign in with social or email. Your details are encrypted and secured by Supabase Auth.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <FxButton
          type="button"
          variant="secondary"
          onClick={() => handleOAuth('google')}
          aria-label="Continue with Google"
        >
          Continue with Google
        </FxButton>
        <FxButton
          type="button"
          variant="secondary"
          onClick={() => handleOAuth('apple')}
          aria-label="Continue with Apple"
        >
          Continue with Apple
        </FxButton>
      </div>
      <div className="my-6 flex items-center gap-4 text-xs text-white/40">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {mode === 'sign-up' && (
          <label className="flex flex-col gap-1 text-sm text-white/70">
            Full name
            <input
              type="text"
              placeholder="Jane Murphy"
              value={values.name}
              onChange={handleFieldChange('name')}
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
            />
            {errors.name && <span className="text-xs text-fx-amber">{errors.name}</span>}
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm text-white/70">
          Email
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleFieldChange('email')}
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
          />
          {errors.email && <span className="text-xs text-fx-amber">{errors.email}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm text-white/70">
          Password
          <input
            type="password"
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            placeholder="Minimum 6 characters"
            value={values.password}
            onChange={handleFieldChange('password')}
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
          />
          {errors.password && <span className="text-xs text-fx-amber">{errors.password}</span>}
        </label>
        <FxButton
          type="submit"
          loading={loading}
          disabled={loading}
          aria-label={mode === 'sign-in' ? 'Sign in' : 'Create account'}
        >
          {mode === 'sign-in' ? 'Sign in' : 'Create account'}
        </FxButton>
      </form>
      <div className="mt-4 text-center text-sm text-white/60">
        {mode === 'sign-in' ? (
          <button
            className="text-white underline-offset-4 hover:underline"
            onClick={() => setMode('sign-up')}
            type="button"
          >
            Need an account? Sign up
          </button>
        ) : (
          <button
            className="text-white underline-offset-4 hover:underline"
            onClick={() => setMode('sign-in')}
            type="button"
          >
            Already have an account? Sign in
          </button>
        )}
      </div>
      {message && <p className="mt-4 text-center text-sm text-white/70">{message}</p>}
    </div>
  );
}
