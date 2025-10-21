import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FixEasy Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="fx-container space-y-6 py-16">
      <h1 className="text-4xl font-semibold text-white">Terms of Service</h1>
      <p className="text-white/60">
        These placeholder terms outline the professional standards and customer protections for FixEasy bookings. Replace with legal copy before launch.
      </p>
    </div>
  );
}
