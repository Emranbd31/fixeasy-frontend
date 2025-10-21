'use client';

import {
  Suspense,
  type ReactNode,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useSearchParams } from 'next/navigation';

import { useSupabaseClient, useSupabaseSession } from '@/app/providers';
import { FxButton } from '@/components/ui/FxButton';

type BookingValues = {
  service: string;
  summary: string;
  address: string;
  eircode: string;
  preferredDate: string;
  preferredTime: string;
  name: string;
  email: string;
  phone: string;
};

type BookingErrors = Partial<Record<keyof BookingValues, string>>;

const steps = ['Service', 'Details', 'Contact'] as const;

const stepFields: Array<(keyof BookingValues)[]> = [
  ['service', 'summary'],
  ['address', 'eircode', 'preferredDate', 'preferredTime'],
  ['name', 'email', 'phone'],
];

const serviceOptions = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'painting', label: 'Painting' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'security', label: 'CCTV & Alarms' },
  { value: 'it', label: 'IT Support' },
  { value: 'moving', label: 'Moving Help' },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateBookingField = (
  field: keyof BookingValues,
  value: string
): string | null => {
  const trimmed = value.trim();
  switch (field) {
    case 'service':
      return trimmed ? null : 'Select a service';
    case 'summary':
      if (trimmed.length < 10) return 'Tell us a bit more (at least 10 characters)';
      if (trimmed.length > 300) return 'Keep summary under 300 characters';
      return null;
    case 'address':
      return trimmed.length >= 5 ? null : 'Enter an address';
    case 'eircode':
      return trimmed.length >= 3 ? null : 'Enter your Eircode';
    case 'name':
      return trimmed.length >= 2 ? null : 'Enter your name';
    case 'email':
      return emailPattern.test(trimmed) ? null : 'Enter a valid email';
    case 'phone':
      return trimmed.length >= 7 ? null : 'Enter a phone number';
    case 'preferredDate':
    case 'preferredTime':
      return null;
    default:
      return null;
  }
};

const validateBookingFields = (
  values: BookingValues,
  fields: (keyof BookingValues)[],
  setFieldErrors: (updater: (prev: BookingErrors) => BookingErrors) => void
): boolean => {
  const pendingErrors: BookingErrors = {};
  let isValid = true;

  fields.forEach((field) => {
    const error = validateBookingField(field, values[field]);
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

function BookPageContent(): JSX.Element {
  const supabase = useSupabaseClient();
  const session = useSupabaseSession();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  const prefilledService = searchParams.get('service');

  const [values, setValues] = useState<BookingValues>({
    service: prefilledService ?? '',
    summary: '',
    address: '',
    eircode: '',
    preferredDate: '',
    preferredTime: '',
    name: '',
    email: '',
    phone: '',
  });
  const [fieldErrors, setFieldErrors] = useState<BookingErrors>({});

  useEffect(() => {
    if (!prefilledService) return;
    setValues((prev) => ({ ...prev, service: prefilledService }));
    setFieldErrors((prev) => {
      if (!prev.service) return prev;
      const next = { ...prev };
      delete next.service;
      return next;
    });
  }, [prefilledService]);

  useEffect(() => {
    if (!session?.user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', session.user!.id)
        .single();

      setValues((prev) => ({
        ...prev,
        name: data?.full_name ?? prev.name,
        email: session.user?.email ?? prev.email,
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
    field: keyof BookingValues
  ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const nextValue = event.target.value;
      setValues((prev) => ({ ...prev, [field]: nextValue }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const handleNext = () => {
    const valid = validateBookingFields(values, stepFields[step], setFieldErrors);
    if (!valid) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allFields = Object.keys(values) as (keyof BookingValues)[];
    if (!validateBookingFields(values, allFields, setFieldErrors)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      (Object.keys(values) as (keyof BookingValues)[]).forEach((key) => {
        const trimmedValue = values[key].trim();
        if ((key === 'preferredDate' || key === 'preferredTime') && trimmedValue.length === 0) {
          return;
        }
        formData.append(key, trimmedValue);
      });
      if (session?.user?.id) {
        formData.append('user_id', session.user.id);
      }
      photos.forEach((file, index) => {
        formData.append(`photos_${index}`, file);
      });

      const response = await fetch('/api/bookings', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Unable to create booking');
      }

      const payload = (await response.json()) as { reference: string };
      setSuccessRef(payload.reference);
      setStep(steps.length - 1);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  let content: ReactNode;

  if (successRef) {
    content = (
      <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-10 text-center">
        <h2 className="text-3xl font-semibold text-white">Booking confirmed!</h2>
        <p className="mt-3 text-white/70">
          Your reference number is <span className="font-semibold text-white">{successRef}</span>.
          We’ve emailed details to {session?.user?.email ?? 'your inbox'}.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <FxButton href="/login" variant="secondary" aria-label="Track booking">
            Track booking
          </FxButton>
          <FxButton href="/" aria-label="Return home" variant="ghost">
            Return home
          </FxButton>
        </div>
      </div>
    );
  } else {
    content = (
      <form className="space-y-6" onSubmit={handleSubmitForm}>
        {step === 0 && (
          <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-8">
            <h2 className="text-2xl font-semibold text-white">Which service do you need?</h2>
            <p className="mt-2 text-sm text-white/60">
              Choose a category and describe the issue so we can match you with the right professional.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Service
                <select
                  value={values.service}
                  onChange={handleInputChange('service')}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                  aria-label="Select service"
                >
                  <option value="">Select…</option>
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value} className="text-black">
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.service && (
                  <span className="text-xs text-fx-amber">{fieldErrors.service}</span>
                )}
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Problem summary
                <textarea
                  value={values.summary}
                  onChange={handleInputChange('summary')}
                  rows={4}
                  maxLength={300}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                  placeholder="Tell us what’s happening"
                />
                <span className="text-xs text-white/50">Max 300 characters</span>
                {fieldErrors.summary && (
                  <span className="text-xs text-fx-amber">{fieldErrors.summary}</span>
                )}
              </label>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-8">
            <h2 className="text-2xl font-semibold text-white">Where and when?</h2>
            <p className="mt-2 text-sm text-white/60">
              We’ll confirm availability instantly and share your pro’s contact info once accepted.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Address
                <input
                  value={values.address}
                  onChange={handleInputChange('address')}
                  placeholder="123 Merrion Square, Dublin"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {fieldErrors.address && (
                  <span className="text-xs text-fx-amber">{fieldErrors.address}</span>
                )}
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Eircode
                <input
                  value={values.eircode}
                  onChange={handleInputChange('eircode')}
                  placeholder="D02 XY23"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {fieldErrors.eircode && (
                  <span className="text-xs text-fx-amber">{fieldErrors.eircode}</span>
                )}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-white/70">
                  Preferred date
                  <input
                    type="date"
                    value={values.preferredDate}
                    onChange={handleInputChange('preferredDate')}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-white/70">
                  Preferred time
                  <input
                    type="time"
                    value={values.preferredTime}
                    onChange={handleInputChange('preferredTime')}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Attach photos (optional)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = event.target.files;
                    if (!files) return;
                    setPhotos(Array.from(files));
                  }}
                  className="rounded-xl border border-dashed border-white/20 bg-white/5 px-3 py-6 text-sm text-white/70"
                />
                <span className="text-xs text-white/50">Help your pro prepare with a quick photo or two.</span>
              </label>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="glass-surface rounded-3xl border border-white/10 bg-white/10 p-8">
            <h2 className="text-2xl font-semibold text-white">How can we reach you?</h2>
            <p className="mt-2 text-sm text-white/60">
              We’ll send booking updates and connect you to your professional once confirmed.
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
            </div>
          </div>
        )}
        {error && <p className="text-sm text-fx-amber">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-white/60">
            {steps.map((label, index) => (
              <span
                key={label}
                className={`flex h-3 w-3 rounded-full ${
                  index <= step ? 'bg-fx-primary' : 'bg-white/20'
                }`}
              />
            ))}
            <span className="ml-3 text-xs uppercase tracking-[0.3em] text-white/50">
              Step {Math.min(step + 1, steps.length)} of {steps.length}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {step > 0 && !successRef && (
              <FxButton
                type="button"
                variant="ghost"
                onClick={handleBack}
                aria-label="Previous step"
              >
                Back
              </FxButton>
            )}
            {step < steps.length - 1 && !successRef && (
              <FxButton type="button" onClick={handleNext} aria-label="Next step">
                Next
              </FxButton>
            )}
            {step === steps.length - 1 && !successRef && (
              <FxButton
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                aria-label="Submit booking"
              >
                Submit booking
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
        <h1 className="text-4xl font-semibold text-white">Book a service</h1>
        <p className="text-white/60">
          Complete the steps below to create a new FixEasy booking. We’ll confirm within minutes and keep you updated every step.
        </p>
      </div>
      {content}
    </div>
  );
}

export default function BookPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="fx-container py-24 text-center text-white/70">
          Loading booking form…
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
