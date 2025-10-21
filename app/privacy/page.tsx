import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FixEasy Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="fx-container space-y-6 py-16">
      <h1 className="text-4xl font-semibold text-white">Privacy Policy</h1>
      <p className="text-white/60">
        FixEasy protects your data using Supabase Auth and encrypted storage. Replace this placeholder copy with your GDPR-compliant policy.
      </p>
    </div>
  );
}
