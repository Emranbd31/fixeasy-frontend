"use client";

import { useEffect, useRef, useState, FormEvent } from "react";

type BookingStep = 1 | 2 | 3 | 4;

interface BookingState {
  service: string;
  customService: string;
  subService: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  consent: boolean;
}

const INITIAL_STATE: BookingState = {
  service: "",
  customService: "",
  subService: "",
  description: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  consent: false,
};

const MAIN_SERVICES = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Handyman",
  "Gardening",
  "Painting",
  "Moving",
  "Appliance Repair",
];

const SUB_SERVICES: Record<string, string[]> = {
  Plumbing: ["Leak", "Blocked drain", "Toilet issue", "Tap / mixer issue"],
  Electrical: ["No power", "Light fitting", "Socket / switch", "Fuse board"],
  Cleaning: ["Full house clean", "Kitchen clean", "Bathroom clean", "End of tenancy"],
  Handyman: ["Furniture assembly", "Small repairs", "Hanging shelves / TV", "Door / lock issue"],
  Gardening: ["Grass cut", "Hedge trim", "Garden tidy", "Weeding"],
  Painting: ["Single room", "Full house", "Exterior", "Touch-up / patch"],
  Moving: ["Small move / van", "Apartment move", "House move", "Furniture move"],
  "Appliance Repair": ["Washing machine", "Dishwasher", "Fridge / freezer", "Oven / hob"],
};

export default function BookingPageClient() {
  const [step, setStep] = useState<BookingStep>(1);
  const [booking, setBooking] = useState<BookingState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const addressRef = useRef<HTMLInputElement | null>(null);

  const smoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleNext = () => {
    setStep((prev) => {
      const next = prev < 4 ? ((prev + 1) as BookingStep) : prev;
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

  const handleServiceSelect = (value: string) => {
    setBooking((prev) => ({
      ...prev,
      service: value,
      subService: "",
    }));
    // Auto-advance
    setStep(2);
    smoothScroll("step2");
  };

  const handleSubServiceSelect = (value: string) => {
    setBooking((prev) => ({
      ...prev,
      subService: value,
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      const summaryParts = [
        booking.service || booking.customService || "Service",
        booking.subService ? `(${booking.subService})` : "",
        booking.description || "No details provided",
      ]
        .filter(Boolean)
        .join(" ");

      const summary = summaryParts.length >= 10 ? summaryParts : `${summaryParts} details`;

      const form = new FormData();
      form.append("service", booking.service || booking.customService);
      form.append("summary", summary);
      form.append("address", booking.address);
      form.append("eircode", booking.address);
      if (booking.subService) form.append("subService", booking.subService);
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

      setSubmitSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSubServices =
    booking.service && SUB_SERVICES[booking.service]
      ? SUB_SERVICES[booking.service]
      : [];

  const canGoNextFromStep1 =
    booking.service.trim().length > 0 || booking.customService.trim().length > 0;

  const canGoNextFromStep2 = booking.description.trim().length > 0;

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
      setBooking((prev) => ({ ...prev, address: place?.formatted_address || "" }));
    });

    return () => listener?.remove?.();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto pt-10 pb-20 px-4 flex flex-col">
        {/* Header */}
        <header className="mb-6">
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

        {/* Step indicators */}
        <nav className="mb-6 flex items-center justify-between gap-2 text-xs font-medium">
          {[
            "Service",
            "Problem details",
            "Contact info",
            "Review & submit",
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

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6">
          {/* STEP 1 */}
          {step === 1 && (
            <section id="step1" className="space-y-6 scroll-mt-24">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Step 1 — Choose your service
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Select a service or type your own.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {MAIN_SERVICES.map((service) => {
                  const selected = booking.service === service;
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceSelect(service)}
                      className={[
                        "rounded-lg border px-2 py-2 text-left text-xs sm:text-sm",
                        selected
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50",
                      ].join(" ")}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">
                  Or type your own service
                </label>
                <input
                  type="text"
                  value={booking.customService}
                  onChange={handleChange("customService")}
                  placeholder="e.g. Boiler service, CCTV install, lock change..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div className="mt-4 flex justify-end">
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
                  Continue
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section id="step2" className="space-y-6 scroll-mt-24">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Step 2 — Problem details
                </h2>
              </div>

              {booking.service && (
                <div className="flex flex-wrap gap-2">
                  {currentSubServices.map((sub) => {
                    const selected = booking.subService === sub;
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubServiceSelect(sub)}
                        className={[
                          "rounded-full border px-3 py-1 text-xs",
                          selected
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50",
                        ].join(" ")}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={booking.description}
                  onChange={handleChange("description")}
                  rows={4}
                  placeholder="Add short details that help the professional understand your issue..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                />
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
                Step 4 — Review & submit
              </h2>

              <div className="space-y-4 rounded-xl bg-slate-50 p-4 text-sm">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500">
                    Service
                  </h3>
                  <p className="mt-1">
                    {booking.service || booking.customService || "Not specified"}
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
                </div>
              </div>

              {submitError && <p className="text-red-600">{submitError}</p>}
              {submitSuccess && (
                <p className="text-green-600">
                  Your request has been submitted!
                </p>
              )}

              <div className="flex items-start gap-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={booking.consent}
                  onChange={handleChange("consent")}
                  className="mt-1 h-4 w-4"
                />
                <label htmlFor="consent" className="text-xs text-slate-600">
                  FixEasy may share your details with vetted local professionals.
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
                  type="submit"
                  disabled={isSubmitting || !booking.consent}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-medium",
                    isSubmitting || !booking.consent
                      ? "cursor-not-allowed bg-slate-200"
                      : "bg-blue-600 text-white hover:bg-blue-700",
                  ].join(" ")}
                >
                  {isSubmitting ? "Sending..." : "Submit request"}
                </button>
              </div>
            </section>
          )}
        </form>
      </div>
    </main>
  );
}
