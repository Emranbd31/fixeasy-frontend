'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useSupabaseClient } from '@/app/providers';
import { FxButton } from '@/components/ui/FxButton';

const authSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Use at least 6 characters'),
  name: z.string().optional(),
});

type AuthValues = z.infer<typeof authSchema>;

type AuthMode = 'sign-in' | 'sign-up';

export function AuthPanel(): JSX.Element {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '', name: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const trimmedName = values.name?.trim() ?? '';

    if (mode === 'sign-up' && !trimmedName) {
      setError('name', { type: 'manual', message: 'Enter your name' });
      return;
    }

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
              full_name: trimmedName,
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
  });

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
              {...register('name')}
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
            />
            {errors.name && <span className="text-xs text-fx-amber">{errors.name.message}</span>}
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm text-white/70">
          Email
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
          />
          {errors.email && <span className="text-xs text-fx-amber">{errors.email.message}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm text-white/70">
          Password
          <input
            type="password"
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            placeholder="Minimum 6 characters"
            {...register('password')}
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
          />
          {errors.password && <span className="text-xs text-fx-amber">{errors.password.message}</span>}
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
            onClick={() => {
              setMode('sign-up');
              clearErrors();
            }}
            type="button"
          >
            Need an account? Sign up
          </button>
        ) : (
          <button
            className="text-white underline-offset-4 hover:underline"
            onClick={() => {
              setMode('sign-in');
              clearErrors();
            }}
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
