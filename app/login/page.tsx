import type { Metadata } from 'next';

import { AuthPanel } from '@/components/auth/AuthPanel';

export const metadata: Metadata = {
  title: 'Sign in to FixEasy',
  description: 'Access FixEasy with Google, Apple or email credentials.',
};

export default function LoginPage() {
  return (
    <div className="px-5 py-16 sm:px-6 lg:px-8">
      <AuthPanel />
    </div>
  );
}
