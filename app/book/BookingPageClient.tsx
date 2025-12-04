"use client";

import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { MAIN_SERVICES, SUB_SERVICES } from "@/lib/service-options";

type ServiceOption = {
  label: string;
  subServices: string[];
};

const POPULAR_SERVICE_LABELS = [
  "Cleaning",
  "Handyman",
  "Plumbing",
  "Electrician",
  "Gardening",
  "Painting",
];

const SERVICE_OPTIONS: ServiceOption[] = MAIN_SERVICES.map((label) => ({
  label,
  subServices: SUB_SERVICES[label] || [],
}));

const POPULAR_SERVICES = SERVICE_OPTIONS.filter((service) =>
  POPULAR_SERVICE_LABELS.includes(service.label)
);

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

type BookingStep = 1 | 2 | 3 | 4 | 5;

interface BookingState {
  service: string;
  subService: string;
  description: string;
  budget: string;
  appointmentStart: Date | null;
  isScheduled: boolean;
  name: string;
  email: string;
  phone: string;
  address: string;
  consent: boolean;
  paymentMethodId?: string;
}

const INITIAL_STATE: BookingState = {
  service: "",
  subService: "",
  description: "",
  budget: "",
  appointmentStart: null,
  isScheduled: false,
  name: "",
  email: "",
  phone: "",
  address: "",
  consent: false,
  paymentMethodId: "",
};


export default function BookingPageClient() {
  const [step, setStep] = useState<BookingStep>(1);
  const [booking, setBooking] = useState<BookingState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availability, setAvailability] = useState<string[]>([]);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const addressRef = useRef<HTMLInputElement | null>(null);

  const smoothScroll = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleNext = () => {
    setStep((prev) => {
      const next = prev < 5 ? ((prev + 1) as BookingStep) : prev;
      smoothScroll(`step${next}`);
      return next;
    });
  };

  const handleBack = () => {
    setStep((prev) => {
      const next = prev > 1 ? ((prev - 1) as BookingStep) : prev;
      smoothScroll(`step${next}`);
      return next;
    });
  };

  const handleServiceSelect = (value: ServiceOption | null) => {
    setBooking((prev) => ({
      ...prev,
      service: value?.label || "",
      subService: "",
    }));
  };

  const handleChange =
    (field: keyof BookingState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "consent" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : e.target.value;

      setBooking((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const buildSummary = () => {
    const summaryParts = [
      booking.service || "Service",
      booking.subService ? `(${booking.subService})` : "",
      booking.description || "No details provided",
    ]
      .filter(Boolean)
      .join(" ");

    return summaryParts.length >= 10 ? summaryParts : `${summaryParts} details`;
  };

  const createBookingRecord = async () => {
    if (bookingReference) return bookingReference;
    const form = new FormData();
    form.append("service", booking.service);
    form.append("summary", buildSummary());
    form.append("address", booking.address);
    form.append("eircode", booking.address);
    if (booking.subService) form.append("subService", booking.subService);
    if (booking.budget) form.append("budget", booking.budget);
    if (booking.appointmentStart) form.append("appointmentStart", booking.appointmentStart.toISOString());
    form.append("jobType", booking.isScheduled ? "scheduled" : "emergency");
    form.append("name", booking.name);
    form.append("phone", booking.phone);
    form.append("email", booking.email);

    const res = await fetch("/api/bookings", {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Booking failed");
    }

    const data = await res.json().catch(() => ({}));
    const ref = data.reference || data.id || null;
    if (ref) setBookingReference(ref);
    return ref;
  };

  const estimatedAmount = useMemo(() => {
    const parsed = parseFloat(booking.budget);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    return 50;
  }, [booking.budget]);

  const finalizeBookingWithPayment = async (paymentMethodId: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setPaymentError(null);
    setPaymentSuccess(null);
    setSubmitSuccess(false);
    try {
      const bookingId = await createBookingRecord();
      setBooking((prev) => ({ ...prev, paymentMethodId }));
      const amount = Math.max(1, estimatedAmount);
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "eur",
          paymentMethodId,
          bookingId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Unable to save payment method");
      }
      setPaymentIntentId(data.paymentIntentId || data.id || null);
      setPaymentSuccess("Payment method saved. Waiting for a professional to accept your request.");
      setSubmitSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setPaymentError(msg);
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceOption = booking.service
    ? SERVICE_OPTIONS.find((svc) => svc.label === booking.service) || null
    : null;

  const currentSubServices = selectedServiceOption?.subServices || [];

  const canGoNextFromStep1 = booking.service.trim().length > 0;

  const canGoNextFromStep2 = true;

  const canGoNextFromStep3 =
    booking.name.trim().length > 1 &&
    booking.email.trim().length > 3 &&
    booking.phone.trim().length > 5 &&
    booking.address.trim().length > 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!(window as any).google) return;
    if (!addressRef.current) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(addressRef.current, {
      fields: ["formatted_address", "geometry"],
      types: ["address"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      setBooking((prev) => ({ ...prev, address: place?.formatted_address || prev.address }));
    });

    return () => listener?.remove?.();
  }, []);

  useEffect(() => {
    const loadAvailability = async () => {
      if (!booking.service) return;
      try {
        const res = await fetch(
          `/api/availability?service=${encodeURIComponent(booking.service)}&location=${encodeURIComponent(booking.address || "IE")}`
        );
        const data = await res.json();
        setAvailability(Array.isArray(data?.slots) ? data.slots : []);
      } catch {
        setAvailability([]);
      }
    };
    loadAvailability();
  }, [booking.service, booking.address]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto pt-6 pb-20 px-4 flex flex-col">
        <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-slate-100 py-3">
          <header className="mb-3">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
              4-step booking
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Tell us what you need — we’ll match you with the right professional
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Quick form — free quotes, no obligation.
            </p>
          </header>

          <nav className="flex items-center justify-between gap-2 text-xs font-medium">
            {[
              "Service",
              "Problem details",
              "Contact info",
              "Review",
              "Payment",
            ].map((label, index) => {
              const stepNumber = (index + 1) as BookingStep;
              const isActive = step === stepNumber;
              const isDone = step > stepNumber;

              return (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <div
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full border text-[11px]",
                      isActive
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isDone
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-slate-300 bg-white text-slate-600",
                    ].join(" ")}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`hidden text-[11px] sm:inline ${
                      isActive ? "font-semibold text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6">
          {/* STEP 1 */}
          {step === 1 && (
            <section id="step1" className="space-y-6 scroll-mt-24">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Step 1 — Choose your service</h2>
                <p className="mt-1 text-sm text-slate-600">Search for your service or pick a popular one.</p>
              </div>

              <Autocomplete
                options={SERVICE_OPTIONS}
                value={selectedServiceOption}
                onChange={(_, val) => handleServiceSelect(val)}
                getOptionLabel={(option) => option?.label ?? ""}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                renderInput={(params) => <TextField {...params} label="Search services" size="small" />}
              />

              {selectedServiceOption && currentSubServices.length > 0 && (
                <div className="space-y-2">
                  <Autocomplete
                    options={currentSubServices}
                    value={booking.subService || null}
                    onChange={(_, val) => setBooking((prev) => ({ ...prev, subService: val || "" }))}
                    renderInput={(params) => (
                      <TextField {...params} label="Choose a sub-service (optional)" size="small" />
                    )}
                  />
                  <div className="flex flex-wrap gap-2">
                    {currentSubServices.slice(0, 6).map((svc) => {
                      const selected = booking.subService === svc;
                      return (
                        <button
                          key={svc}
                          type="button"
                          onClick={() =>
                            setBooking((prev) => ({
                              ...prev,
                              subService: selected ? "" : svc,
                            }))
                          }
                          className={[
                            "rounded-full border px-3 py-1 text-xs",
                            selected
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50",
                          ].join(" ")}
                        >
                          {svc}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setBooking((prev) => ({ ...prev, subService: "" }))}
                      className="rounded-full border border-transparent px-3 py-1 text-xs text-slate-600 underline underline-offset-2"
                    >
                      Skip sub-service
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Popular services
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SERVICES.map((svc) => {
                    const selected = booking.service === svc.label;
                    return (
                      <button
                        key={svc.label}
                        type="button"
                        onClick={() => handleServiceSelect(svc)}
                        className={[
                          "rounded-full border px-3 py-1 text-xs",
                          selected
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50",
                        ].join(" ")}
                      >
                        {svc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                Tip: Choose a main service first, then refine with a sub-service or skip to continue.
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!canGoNextFromStep1}
                  onClick={handleNext}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-medium",
                    canGoNextFromStep1
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "cursor-not-allowed bg-slate-200 text-slate-500",
                  ].join(" ")}
                >
                  Continue to problem details
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section id="step2" className="space-y-6 scroll-mt-24">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Step 2 — Problem details</h2>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Describe the issue (optional)</label>
                <textarea
                  value={booking.description}
                  onChange={handleChange("description")}
                  rows={4}
                  placeholder="Add short details that help the professional understand your issue..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={booking.isScheduled}
                    onChange={(e) => setBooking((prev) => ({ ...prev, isScheduled: e.target.checked }))}
                  />
                  Schedule for later
                </label>
                {booking.isScheduled && (
                  <DatePicker
                    selected={booking.appointmentStart}
                    onChange={(date: Date) => setBooking((prev) => ({ ...prev, appointmentStart: date }))}
                    showTimeSelect
                    timeIntervals={30}
                    minDate={new Date()}
                    dateFormat="MM/dd/yyyy h:mm aa"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                    placeholderText="Select date & time"
                  />
                )}
                {booking.isScheduled && (
                  <div className="flex flex-wrap gap-2">
                    {availability.slice(0, 6).map((iso) => {
                      const d = new Date(iso);
                      const label = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
                      return (
                        <button
                          key={iso}
                          type="button"
                          onClick={() => setBooking((prev) => ({ ...prev, appointmentStart: new Date(iso) }))}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs hover:border-blue-300 hover:bg-blue-50"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Your budget (optional)</label>
                <input
                  type="number"
                  min={0}
                  value={booking.budget}
                  onChange={handleChange("budget")}
                  placeholder="e.g. 200"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <hr className="border-slate-200" />

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">
                    Book Now / Emergency
                  </span>
                  <button
                    type="button"
                    onClick={() => setBooking((prev) => ({ ...prev, isScheduled: !prev.isScheduled }))}
                    className={[
                      "rounded-full px-4 py-2 text-sm border",
                      booking.isScheduled
                        ? "border-slate-200 bg-slate-50 text-slate-700"
                        : "border-red-500 bg-red-50 text-red-700",
                    ].join(" ")}
                  >
                    {booking.isScheduled ? "Scheduled Job" : "Emergency (Book Now) — High Priority"}
                  </button>
                  {!booking.isScheduled && (
                    <span className="text-xs font-semibold text-red-600">High Priority</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!canGoNextFromStep2}
                  onClick={handleNext}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-medium",
                    canGoNextFromStep2
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "cursor-not-allowed bg-slate-200 text-slate-500",
                  ].join(" ")}
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section id="step3" className="space-y-6 scroll-mt-24">
              <h2 className="text-lg font-semibold text-slate-900">
                Step 3 — Contact information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={booking.name}
                    onChange={handleChange("name")}
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={booking.phone}
                    onChange={handleChange("phone")}
                    placeholder="Mobile number"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={booking.email}
                    onChange={handleChange("email")}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700">
                    Eircode or Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    ref={addressRef}
                    value={booking.address}
                    onChange={handleChange("address")}
                    placeholder="Eircode or Address"
                    className="w-full rounded-md border px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!canGoNextFromStep3}
                  onClick={handleNext}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-medium",
                    canGoNextFromStep3
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "cursor-not-allowed bg-slate-200 text-slate-500",
                  ].join(" ")}
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <section id="step4" className="space-y-6 scroll-mt-24">
              <h2 className="text-lg font-semibold text-slate-900">
                Step 4 — Review
              </h2>

              <div className="space-y-4 rounded-xl bg-slate-50 p-4 text-sm">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500">
                    Service
                  </h3>
                  <p className="mt-1">
                    {booking.service || "Not specified"}
                  </p>
                  {booking.subService && (
                    <p className="mt-1 text-xs text-slate-600">
                      Sub: {booking.subService}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-500">
                    Problem details
                  </h3>
                  <p className="mt-1 whitespace-pre-line">
                    {booking.description || "No description provided."}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500">
                      Name
                    </h3>
                    <p className="mt-1">{booking.name}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500">
                      Phone
                    </h3>
                    <p className="mt-1">{booking.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <h3 className="text-xs font-semibold text-slate-500">
                      Email
                    </h3>
                    <p className="mt-1">{booking.email}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <h3 className="text-xs font-semibold text-slate-500">
                      Address / Eircode
                    </h3>
                    <p className="mt-1">{booking.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={booking.consent}
                  onChange={handleChange("consent")}
                  className="mt-1 h-4 w-4"
                />
                <label htmlFor="consent" className="text-xs text-slate-600">
                  I agree to FixEasy&apos;s{" "}
                  <a href="/terms" className="text-blue-600 underline underline-offset-2">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600 underline underline-offset-2">
                    Privacy Policy
                  </a>{" "}
                  and consent to share my details with vetted local professionals.
                </label>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!booking.consent}
                  onClick={handleNext}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-medium",
                    !booking.consent
                      ? "cursor-not-allowed bg-slate-200"
                      : "bg-blue-600 text-white hover:bg-blue-700",
                  ].join(" ")}
                >
                  Continue to payment
                </button>
              </div>
            </section>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <section id="step5" className="space-y-6 scroll-mt-24">
              <h2 className="text-lg font-semibold text-slate-900">Step 5 — Payment</h2>
              <p className="text-sm text-slate-600">
                We securely save your payment method to hold the booking. You won&apos;t be charged until the job is accepted and confirmed.
              </p>

              {paymentError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{paymentError}</div>}
              {paymentSuccess && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{paymentSuccess}</div>}
              {submitError && !paymentError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</div>}

              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <PaymentStep
                    estimate={estimatedAmount}
                    isSubmitting={isSubmitting}
                    onPaymentMethodCreated={(id) => finalizeBookingWithPayment(id)}
                  />
                </Elements>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Stripe publishable key is not configured. Please contact support or try again later.
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <div />
              </div>
            </section>
          )}
        </form>
      </div>
    </main>
  );
}

function PaymentStep({
  estimate,
  isSubmitting,
  onPaymentMethodCreated,
}: {
  estimate: number;
  isSubmitting: boolean;
  onPaymentMethodCreated: (paymentMethodId: string) => Promise<void> | void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element not ready");
      return;
    }
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (pmError || !paymentMethod?.id) {
      setError(pmError?.message || "Unable to create payment method");
      return;
    }
    setError(null);
    await onPaymentMethodCreated(paymentMethod.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700">Estimated total</span>
        <span className="text-lg font-semibold text-slate-900">€{estimate.toFixed(2)}</span>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                "::placeholder": { color: "#9ca3af" },
              },
              invalid: { color: "#dc2626" },
            },
          }}
        />
      </div>
      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className={[
          "w-full rounded-lg px-4 py-3 text-sm font-semibold shadow-sm",
          !stripe || isSubmitting
            ? "cursor-not-allowed bg-slate-200 text-slate-500"
            : "bg-blue-600 text-white hover:bg-blue-700",
        ].join(" ")}
      >
        {isSubmitting ? "Saving..." : "Save payment method & submit request"}
      </button>
      <p className="text-xs text-slate-500">
        Your card is saved securely via Stripe. We only capture payment once a professional accepts and you confirm the quote.
      </p>
    </form>
  );
}
