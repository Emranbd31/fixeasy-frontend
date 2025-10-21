'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSupabaseClient, useSupabaseSession } from '@/app/providers';
import { FxButton } from '@/components/ui/FxButton';

const ibanField = z.string().max(34).optional().or(z.literal(''));

const proSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a phone number'),
  categories: z.array(z.string()).min(1, 'Pick at least one category'),
  experience: z.string().min(1, 'Tell us about your experience'),
  iban: ibanField,
  consentTerms: z.literal(true, {
    errorMap: () => ({ message: 'Please accept the terms' }),
  }),
  consentBackground: z.literal(true, {
    errorMap: () => ({ message: 'Authorize background check' }),
  }),
});

type ProValues = z.infer<typeof proSchema>;

const proSteps = ['Basics', 'KYC', 'Payouts'] as const;

const proStepFields: Array<Array<keyof ProValues>> = [
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
  const [kycError, setKycError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [photoId, setPhotoId] = useState<File | null>(null);
  const [irishDocument, setIrishDocument] = useState<File | null>(null);
  const [insurance, setInsurance] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
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

    if (session.user.email) {
      setValue('email', session.user.email, { shouldValidate: true });
    }

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', session.user!.id)
        .maybeSingle();

      if (data?.full_name) {
        setValue('name', data.full_name, { shouldValidate: true });
      }
      if (data?.phone) {
        setValue('phone', data.phone, { shouldValidate: true });
      }
    };

    void loadProfile();
  }, [session?.user, session?.user?.email, setValue, supabase]);

  const toggleCategory = (category: string) => {
    const current = watch('categories');
    const exists = current.includes(category);
    const nextCategories = exists
      ? current.filter((item) => item !== category)
      : [...current, category];

    setValue('categories', nextCategories, { shouldValidate: true });
  };

  const goNext = async () => {
    const fields = proStepFields[step];
    if (fields.length) {
      const valid = await trigger(fields);
      if (!valid) return;
    }

    if (step === 1) {
      if (!photoId || !irishDocument) {
        setKycError('Photo ID and Irish document are required.');
        return;
      }
      setKycError(null);
    }

    setStep((prev) => Math.min(prev + 1, proSteps.length - 1));
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      if (!photoId || !irishDocument) {
        throw new Error('Please upload the required identification documents.');
      }

      const formData = new FormData();
      formData.append('name', values.name.trim());
      formData.append('email', values.email.trim());
      formData.append('phone', values.phone.trim());
      formData.append('experience', values.experience.trim());
      formData.append('categories', JSON.stringify(values.categories));
      if (values.iban?.trim()) {
        formData.append('iban', values.iban.trim());
      }
      formData.append('consentTerms', values.consentTerms ? 'true' : 'false');
      formData.append('consentBackground', values.consentBackground ? 'true' : 'false');

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
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Unable to submit professional registration');
      }

      setSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
    }
  });

  if (success) {
    return (
      <div className="fx-container space-y-8 py-16">
        <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-10 text-center">
          <h1 className="text-3xl font-semibold text-white">Thanks for submitting!</h1>
          <p className="mt-3 text-white/70">
            Our compliance team is reviewing your documents. Expect an update within 24 hours to finalize your professional
            account.
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
      </div>
    );
  }

  return (
    <div className="fx-container space-y-8 py-16">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-4xl font-semibold text-white">Create your professional account</h1>
        <p className="text-white/60">
          Complete the steps to start receiving high-value jobs across Ireland. Required KYC keeps the marketplace secure.
        </p>
      </div>
      <form className="space-y-6" onSubmit={onSubmit}>
        {step === 0 && (
          <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-8">
            <h2 className="text-2xl font-semibold text-white">Tell us about you</h2>
            <p className="mt-2 text-sm text-white/60">We’ll use this information to match you with the right customers.</p>
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
                          onChange={() => toggleCategory(option)}
                          className="h-4 w-4 rounded border border-white/40 bg-white/10"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
                {errors.categories && <span className="text-xs text-fx-amber">{errors.categories.message}</span>}
              </fieldset>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Years experience & certifications
                <textarea
                  {...register('experience')}
                  rows={4}
                  placeholder="10 years domestic and commercial installs. Safe Electric certified."
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {errors.experience && <span className="text-xs text-fx-amber">{errors.experience.message}</span>}
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
            {kycError && <p className="mt-4 text-sm text-fx-amber">{kycError}</p>}
          </div>
        )}
        {step === 2 && (
          <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-8">
            <h2 className="text-2xl font-semibold text-white">Payout details</h2>
            <p className="mt-2 text-sm text-white/60">
              We use encrypted banking to deposit your payouts. Add your IBAN and confirm consent below.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                IBAN (optional)
                <input
                  {...register('iban')}
                  placeholder="IE29AIBK93115212345678"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {errors.iban && <span className="text-xs text-fx-amber">{errors.iban.message}</span>}
              </label>
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input type="checkbox" {...register('consentTerms')} className="mt-1 h-4 w-4 rounded border border-white/40 bg-white/10" />
                <span>
                  I agree to the FixEasy professional terms and understand my profile will be visible to customers.
                </span>
              </label>
              {errors.consentTerms && <span className="text-xs text-fx-amber">{errors.consentTerms.message}</span>}
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  {...register('consentBackground')}
                  className="mt-1 h-4 w-4 rounded border border-white/40 bg-white/10"
                />
                <span>I authorize FixEasy to conduct KYC and background checks to verify my credentials.</span>
              </label>
              {errors.consentBackground && <span className="text-xs text-fx-amber">{errors.consentBackground.message}</span>}
            </div>
          </div>
        )}
        {submitError && <p className="text-sm text-fx-amber">{submitError}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-white/60">
            {proSteps.map((label, index) => (
              <span key={label} className={`flex h-3 w-3 rounded-full ${index <= step ? 'bg-fx-primary' : 'bg-white/20'}`} />
            ))}
            <span className="ml-3 text-xs uppercase tracking-[0.3em] text-white/50">
              Step {Math.min(step + 1, proSteps.length)} of {proSteps.length}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {step > 0 && (
              <FxButton type="button" variant="ghost" onClick={goBack} aria-label="Previous step">
                Back
              </FxButton>
            )}
            {step < proSteps.length - 1 && (
              <FxButton type="button" onClick={goNext} aria-label="Next step">
                Next
              </FxButton>
            )}
            {step === proSteps.length - 1 && (
              <FxButton type="submit" loading={isSubmitting} disabled={isSubmitting} aria-label="Submit application">
                Submit application
              </FxButton>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
