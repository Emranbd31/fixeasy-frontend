'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSupabaseClient, useSupabaseSession } from '@/app/providers';
import { FxButton } from '@/components/ui/FxButton';

const bookingSchema = z.object({
  service: z.string().min(1, 'Select a service'),
  summary: z.string().min(10, 'Tell us a bit more (at least 10 characters)').max(300),
  address: z.string().min(5, 'Enter an address'),
  eircode: z.string().min(3, 'Enter your Eircode'),
  preferredDate: z.string(),
  preferredTime: z.string(),
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a phone number'),
});

type BookingValues = z.infer<typeof bookingSchema>;

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

export default function BookPage(): JSX.Element {
  const supabase = useSupabaseClient();
  const session = useSupabaseSession();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  const prefilledService = searchParams.get('service');

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: prefilledService ?? '',
      summary: '',
      address: '',
      eircode: '',
      preferredDate: '',
      preferredTime: '',
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (prefilledService) {
      setValue('service', prefilledService);
    }
  }, [prefilledService, setValue]);

  useEffect(() => {
    if (!session?.user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', session.user.id)
        .single();

      if (data?.full_name) setValue('name', data.full_name);
      if (session.user.email) setValue('email', session.user.email);
      if (data?.phone) setValue('phone', data.phone);
    };

    void loadProfile();
  }, [session?.user, supabase, setValue]);

  const handleNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (!valid) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        const trimmedValue = value.trim();
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
  });

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
      <form className="space-y-6" onSubmit={onSubmit}>
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
                  {...register('service')}
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
                {errors.service && (
                  <span className="text-xs text-fx-amber">{errors.service.message}</span>
                )}
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Problem summary
                <textarea
                  {...register('summary')}
                  rows={4}
                  maxLength={300}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                  placeholder="Tell us what’s happening"
                />
                <span className="text-xs text-white/50">Max 300 characters</span>
                {errors.summary && (
                  <span className="text-xs text-fx-amber">{errors.summary.message}</span>
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
                  {...register('address')}
                  placeholder="123 Merrion Square, Dublin"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {errors.address && (
                  <span className="text-xs text-fx-amber">{errors.address.message}</span>
                )}
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Eircode
                <input
                  {...register('eircode')}
                  placeholder="D02 XY23"
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                />
                {errors.eircode && (
                  <span className="text-xs text-fx-amber">{errors.eircode.message}</span>
                )}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-white/70">
                  Preferred date
                  <input
                    type="date"
                    {...register('preferredDate')}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-white outline-none focus:border-fx-primary"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-white/70">
                  Preferred time
                  <input
                    type="time"
                    {...register('preferredTime')}
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
              <FxButton type="submit" loading={isSubmitting} aria-label="Submit booking">
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
