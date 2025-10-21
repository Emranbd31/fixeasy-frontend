'use client';

import {
  type ReactNode,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import { useSupabaseClient, useSupabaseSession } from '@/app/providers';
import { FxButton } from '@/components/ui/FxButton';

type ProValues = {
  name: string;
  email: string;
  phone: string;
  categories: string[];
  experience: string;
  iban: string;
  consentTerms: boolean;
  consentBackground: boolean;
};

type ProErrors = Partial<Record<keyof ProValues, string>>;

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateProField = (field: keyof ProValues, values: ProValues): string | null => {
  switch (field) {
    case 'name':
      return values.name.trim().length >= 2 ? null : 'Enter your full name';
    case 'email':
      return emailPattern.test(values.email.trim()) ? null : 'Enter a valid email';
    case 'phone':
      return values.phone.trim().length >= 7 ? null : 'Enter a phone number';
    case 'categories':
      return values.categories.length > 0 ? null : 'Pick at least one category';
    case 'experience':
      return values.experience.trim().length > 0 ? null : 'Tell us about your experience';
    case 'iban': {
      const trimmed = values.iban.trim();
      if (!trimmed) return null;
      return trimmed.length >= 8 ? null : 'Enter IBAN (masked)';
    }
    case 'consentTerms':
      return values.consentTerms ? null : 'Please accept the terms';
    case 'consentBackground':
      return values.consentBackground ? null : 'Authorize background check';
    default:
      return null;
  }
};

const validateProFields = (
  values: ProValues,
  fields: (keyof ProValues)[],
  setFieldErrors: (updater: (prev: ProErrors) => ProErrors) => void
): boolean => {
  const pendingErrors: ProErrors = {};
  let isValid = true;

  fields.forEach((field) => {
    const error = validateProField(field, values);
    if (error) {
      pendingErrors[field] = error;
      isValid = false;
    }
  });

  setFieldErrors((prev) => {
    const next = { ...prev };
    fields.forEach((field) => {
      const error = pendingErrors[field];
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
    });
    return next;
  });

  return isValid;
};

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

  const [values, setValues] = useState<ProValues>({
    name: '',
    email: '',
    phone: '',
    categories: [],
    experience: '',
    iban: '',
    consentTerms: false,
    consentBackground: false,
  });
  const [fieldErrors, setFieldErrors] = useState<ProErrors>({});

  const selectedCategories = values.categories;

  useEffect(() => {
    if (!session?.user) return;
    setValues((prev) => ({
      ...prev,
      email: session.user?.email ?? prev.email,
    }));

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', session.user!.id)
        .single();

      setValues((prev) => ({
        ...prev,
        name: data?.full_name ?? prev.name,
        phone: data?.phone ?? prev.phone,
      }));

      setFieldErrors((prev) => {
        const next = { ...prev };
        if (data?.full_name) delete next.name;
        if (session.user?.email) delete next.email;
        if (data?.phone) delete next.phone;
        return next;
      });
    };

    void loadProfile();
  }, [session?.user, supabase]);

  const handleInputChange = (
    field: 'name' | 'email' | 'phone' | 'experience' | 'iban'
  ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = event.target.value;
      setValues((prev) => ({ ...prev, [field]: nextValue }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const handleCategoryToggle = (category: string) => {
    setValues((prev) => {
      const exists = prev.categories.includes(category);
      const nextCategories = exists
        ? prev.categories.filter((item) => item !== category)
        : [...prev.categories, category];
      return { ...prev, categories: nextCategories };
    });
    setFieldErrors((prev) => {
      if (!prev.categories) return prev;
      const next = { ...prev };
      delete next.categories;
      return next;
    });
  };

  const handleConsentChange = (field: 'consentTerms' | 'consentBackground') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setValues((prev) => ({ ...prev, [field]: checked }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const handleNext = () => {
    const fields = proStepFields[step];
    if (fields.length) {
      const valid = validateProFields(values, fields, setFieldErrors);
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

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allFields = Object.keys(values) as (keyof ProValues)[];
    if (!validateProFields(values, allFields, setFieldErrors)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
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
      if (values.iban.trim()) {
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
        const payload = await response.json();
        throw new Error(payload.error ?? 'Unable to submit professional registration');
      }

      setSuccess(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <form className="space-y-6" onSubmit={handleSubmitForm}>
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
                  value={values.name}
                  onChange={handleInputChange('name')}
                  placeholder="Jane Murphy"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {fieldErrors.name && <span className="text-xs text-fx-amber">{fieldErrors.name}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Email
                <input
                  type="email"
                  value={values.email}
                  onChange={handleInputChange('email')}
                  placeholder="you@example.com"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {fieldErrors.email && <span className="text-xs text-fx-amber">{fieldErrors.email}</span>}
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Phone
                <input
                  value={values.phone}
                  onChange={handleInputChange('phone')}
                  placeholder="+353 85 123 4567"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {fieldErrors.phone && <span className="text-xs text-fx-amber">{fieldErrors.phone}</span>}
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
                          onChange={() => handleCategoryToggle(option)}
                          className="h-4 w-4 rounded border border-white/40 bg-white/10"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
                {fieldErrors.categories && (
                  <span className="text-xs text-fx-amber">{fieldErrors.categories}</span>
                )}
              </fieldset>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Years experience & certifications
                <textarea
                  value={values.experience}
                  onChange={handleInputChange('experience')}
                  rows={4}
                  placeholder="10 years domestic and commercial installs. Safe Electric certified."
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {fieldErrors.experience && (
                  <span className="text-xs text-fx-amber">{fieldErrors.experience}</span>
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
                  value={values.iban}
                  onChange={handleInputChange('iban')}
                  placeholder="IE29AIBK93115212345678"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
              </label>
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={values.consentTerms}
                  onChange={handleConsentChange('consentTerms')}
                  className="mt-1 h-4 w-4 rounded border border-white/40 bg-white/10"
                />
                <span>
                  I confirm the information provided is accurate and agree to FixEasy’s Professional Terms.
                </span>
              </label>
              {fieldErrors.consentTerms && (
                <span className="text-xs text-fx-amber">{fieldErrors.consentTerms}</span>
              )}
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={values.consentBackground}
                  onChange={handleConsentChange('consentBackground')}
                  className="mt-1 h-4 w-4 rounded border border-white/40 bg-white/10"
                />
                <span>I authorize FixEasy to conduct identity and background verification checks.</span>
              </label>
              {fieldErrors.consentBackground && (
                <span className="text-xs text-fx-amber">{fieldErrors.consentBackground}</span>
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
              <FxButton
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                aria-label="Submit professional application"
              >
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
