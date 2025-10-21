'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSupabaseClient, useSupabaseSession } from '@/app/providers';
import { FxButton } from '@/components/ui/FxButton';

const proSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a phone number'),
  categories: z.array(z.string()).min(1, 'Pick at least one category'),
  experience: z.string().min(1, 'Tell us about your experience'),
  iban: z.union([z.string().min(8, 'Enter IBAN (masked)'), z.literal('')]).optional(),
  consentTerms: z.boolean().refine(Boolean, 'Please accept the terms'),
  consentBackground: z.boolean().refine(Boolean, 'Authorize background check'),
});

type ProValues = z.infer<typeof proSchema>;

const proSteps = ['Basics', 'KYC', 'Payouts'] as const;

const proStepFields: Array<(keyof ProValues)[]> = [
  ['name', 'email', 'phone', 'categories', 'experience'],
  [],
  ['iban', 'consentTerms', 'consentBackground'],
];

const categoryOptions = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Painting',
  'Gardening',
  'Security systems',
  'IT Support',
  'Moving & logistics',
];

export default function ProRegisterPage(): JSX.Element {
  const session = useSupabaseSession();
  const supabase = useSupabaseClient();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [photoId, setPhotoId] = useState<File | null>(null);
  const [irishDocument, setIrishDocument] = useState<File | null>(null);
  const [insurance, setInsurance] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProValues>({
    resolver: zodResolver(proSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      categories: [],
      experience: '',
      iban: '',
      consentTerms: false,
      consentBackground: false,
    },
  });

  const selectedCategories = watch('categories');

  useEffect(() => {
    if (!session?.user) return;
    setValue('email', session.user.email ?? '');
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', session.user!.id)
        .single();
      if (data?.full_name) setValue('name', data.full_name);
      if (data?.phone) setValue('phone', data.phone);
    };
    void loadProfile();
  }, [session?.user, supabase, setValue]);

  const handleNext = async () => {
    const fields = proStepFields[step];
    if (fields.length) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    if (step === 1) {
      if (!photoId || !irishDocument) {
        setError('Photo ID and Irish document are required.');
        return;
      }
      setError(null);
    }
    setStep((prev) => Math.min(prev + 1, proSteps.length - 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!photoId || !irishDocument) {
        throw new Error('Please upload the required identification documents.');
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
          return;
        }

        const serialized = value?.toString().trim() ?? '';
        if (key === 'iban' && serialized.length === 0) {
          return;
        }

        if ((key === 'consentTerms' || key === 'consentBackground') && typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false');
          return;
        }

        formData.append(key, serialized);
      });

      if (session?.user?.id) {
        formData.append('user_id', session.user.id);
      }

      formData.append('photo_id', photoId);
      formData.append('irish_document', irishDocument);
      if (insurance) {
        formData.append('insurance', insurance);
      }

      const response = await fetch('/api/professionals', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Unable to submit professional registration');
      }

      setSuccess(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  });

  let content: ReactNode;

  if (success) {
    content = (
      <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-10 text-center">
        <h2 className="text-3xl font-semibold text-white">Thanks for submitting!</h2>
        <p className="mt-3 text-white/70">
          Our compliance team is reviewing your documents. Expect an update within 24 hours to finalize your professional account.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <FxButton href="/" variant="secondary" aria-label="Return home">
            Back to homepage
          </FxButton>
          <FxButton href="/login" variant="ghost" aria-label="Sign in">
            Sign in
          </FxButton>
        </div>
      </div>
    );
  } else {
    content = (
      <form className="space-y-6" onSubmit={onSubmit}>
        {step === 0 && (
          <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-8">
            <h2 className="text-2xl font-semibold text-white">Tell us about you</h2>
            <p className="mt-2 text-sm text-white/60">
              We’ll use this information to match you with the right customers.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Full name
                <input
                  {...register('name')}
                  placeholder="Jane Murphy"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {errors.name && <span className="text-xs text-fx-amber">{errors.name.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Email
                <input
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {errors.email && <span className="text-xs text-fx-amber">{errors.email.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Phone
                <input
                  {...register('phone')}
                  placeholder="+353 85 123 4567"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {errors.phone && <span className="text-xs text-fx-amber">{errors.phone.message}</span>}
              </label>
              <fieldset className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <legend className="text-sm uppercase tracking-[0.3em] text-white/50">Service categories</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categoryOptions.map((option) => {
                    const selected = selectedCategories.includes(option);
                    return (
                      <label key={option} className="flex items-center gap-3 text-sm text-white/70">
                        <input
                          type="checkbox"
                          value={option}
                          checked={selected}
                          onChange={(event) => {
                            const current = selectedCategories;
                            if (event.target.checked) {
                              setValue('categories', [...current, option], { shouldValidate: true });
                            } else {
                              setValue(
                                'categories',
                                current.filter((category) => category !== option),
                                { shouldValidate: true }
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border border-white/40 bg-white/10"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
                {errors.categories && (
                  <span className="text-xs text-fx-amber">{errors.categories.message}</span>
                )}
              </fieldset>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Years experience & certifications
                <textarea
                  {...register('experience')}
                  rows={4}
                  placeholder="10 years domestic and commercial installs. Safe Electric certified."
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {errors.experience && (
                  <span className="text-xs text-fx-amber">{errors.experience.message}</span>
                )}
              </label>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-8">
            <h2 className="text-2xl font-semibold text-white">Verify your identity</h2>
            <p className="mt-2 text-sm text-white/60">
              Upload a clear photo of your ID and a valid Irish document. Insurance is optional but recommended.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Photo ID (passport or driving licence)
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(event) => setPhotoId(event.target.files?.[0] ?? null)}
                  className="rounded-xl border border-dashed border-white/20 bg-white/5 px-3 py-6 text-sm text-white/70"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Irish document (Passport / Driving Licence / PPSN letter)
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(event) => setIrishDocument(event.target.files?.[0] ?? null)}
                  className="rounded-xl border border-dashed border-white/20 bg-white/5 px-3 py-6 text-sm text-white/70"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Insurance certificate (optional)
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(event) => setInsurance(event.target.files?.[0] ?? null)}
                  className="rounded-xl border border-dashed border-white/20 bg-white/5 px-3 py-6 text-sm text-white/70"
                />
              </label>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-8">
            <h2 className="text-2xl font-semibold text-white">Payout details</h2>
            <p className="mt-2 text-sm text-white/60">
              We’ll mask your IBAN for security and only share it with Stripe Connect for payouts.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                IBAN (masked)
                <input
                  {...register('iban')}
                  placeholder="IE29AIBK93115212345678"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
              </label>
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  {...register('consentTerms')}
                  className="mt-1 h-4 w-4 rounded border border-white/40 bg-white/10"
                />
                <span>
                  I confirm the information provided is accurate and agree to FixEasy’s Professional Terms.
                </span>
              </label>
              {errors.consentTerms && (
                <span className="text-xs text-fx-amber">{errors.consentTerms.message}</span>
              )}
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  {...register('consentBackground')}
                  className="mt-1 h-4 w-4 rounded border border-white/40 bg-white/10"
                />
                <span>I authorize FixEasy to conduct identity and background verification checks.</span>
              </label>
              {errors.consentBackground && (
                <span className="text-xs text-fx-amber">{errors.consentBackground.message}</span>
              )}
            </div>
          </div>
        )}
        {error && <p className="text-sm text-fx-amber">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-white/60">
            {proSteps.map((label, index) => (
              <span
                key={label}
                className={`flex h-3 w-3 rounded-full ${
                  index <= step ? 'bg-fx-emerald' : 'bg-white/20'
                }`}
              />
            ))}
            <span className="ml-3 text-xs uppercase tracking-[0.3em] text-white/50">
              Step {Math.min(step + 1, proSteps.length)} of {proSteps.length}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {step > 0 && (
              <FxButton
                type="button"
                variant="ghost"
                onClick={handleBack}
                aria-label="Previous step"
              >
                Back
              </FxButton>
            )}
            {step < proSteps.length - 1 && (
              <FxButton type="button" onClick={handleNext} aria-label="Next step">
                Next
              </FxButton>
            )}
            {step === proSteps.length - 1 && (
              <FxButton type="submit" loading={isSubmitting} aria-label="Submit professional application">
                Submit application
              </FxButton>
            )}
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="fx-container space-y-8 py-16">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-4xl font-semibold text-white">Create your professional account</h1>
        <p className="text-white/60">
          Submit your details and required documents to start accepting FixEasy bookings across Ireland.
        </p>
      </div>
      {content}
    </div>
  );
}
