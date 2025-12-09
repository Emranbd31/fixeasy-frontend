"use client";

import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MAIN_SERVICES, SUB_SERVICES } from "@/lib/service-options";

type ServiceOption = {
  label: string;
  subServices: string[];
};

type Urgency = "emergency" | "scheduled";
type RequestType = "quote" | "book";

const SERVICE_OPTIONS: ServiceOption[] = MAIN_SERVICES.map((label) => ({
  label,
  subServices: SUB_SERVICES[label] || [],
}));

export default function BookingPageClient() {
  const [open, setOpen] = useState(true);
  const [service, setService] = useState<string>("");
  const [subService, setSubService] = useState<string>("");
  const [urgency, setUrgency] = useState<Urgency>("emergency");
  const [requestType, setRequestType] = useState<RequestType>("quote");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [appointmentStart, setAppointmentStart] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const modalScrollRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const abVariant = useMemo(() => (Math.random() < 0.5 ? "A" : "B"), []);

  const selectedServiceOption = useMemo(
    () => (service ? SERVICE_OPTIONS.find((s) => s.label === service) || null : null),
    [service]
  );
  const currentSubServices = selectedServiceOption?.subServices || [];
  const normalizeService = (typeValue: string) => {
    const cleaned = typeValue.trim().toLowerCase();
    const direct = SERVICE_OPTIONS.find((s) => s.label.toLowerCase() === cleaned);
    if (direct) return direct.label;
    if (cleaned.includes("clean")) return "Cleaning";
    if (cleaned.includes("plumb")) return "Plumbing";
    if (cleaned.includes("electric")) return "Electrician";
    if (cleaned.includes("move")) return "Moving";
    if (cleaned.includes("paint")) return "Painting";
    if (cleaned.includes("handy")) return "Handyman";
    if (cleaned.includes("garden")) return "Gardening";
    if (cleaned.includes("carpet")) return "Carpet Cleaning";
    return "";
  };

  useEffect(() => {
    // Google autocomplete hook (preserve previous behavior)
    if (typeof window === "undefined") return;
    if (!(window as any).google) return;
    if (!addressRef.current) return;
    const autocomplete = new (window as any).google.maps.places.Autocomplete(addressRef.current, {
      fields: ["formatted_address", "geometry"],
      types: ["address"],
    });
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      setAddress(place?.formatted_address || address);
    });
    return () => listener?.remove?.();
  }, [address]);

  const scrollModalToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    modalScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      setTimeout(scrollModalToTop, 0);
    }
  }, [open]);

  useEffect(() => {
    const typeParam = searchParams?.get?.("type");
    if (typeParam) {
      const normalized = normalizeService(typeParam);
      if (normalized) {
        setService(normalized);
      }
    }
  }, [searchParams]);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const phoneValid = useMemo(() => phone.replace(/\D/g, "").length >= 8, [phone]);
  const hasContact = emailValid || phoneValid;

  const canSubmit =
    service.trim().length > 0 &&
    address.trim().length > 0 &&
    hasContact &&
    (requestType === "quote" || !!appointmentStart);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const appointmentIso =
      requestType === "book"
        ? appointmentStart?.toISOString() ?? null
        : urgency === "scheduled" && appointmentStart
          ? appointmentStart.toISOString()
          : null;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const payload = {
        service,
        subService,
        requestType,
        urgency,
        description,
        address,
        contactName,
        email,
        phone,
        appointmentStart: appointmentIso,
        abVariant,
      };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to submit request");
      setSubmitSuccess("Thanks! Your request has been submitted. We’ll confirm shortly.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">{abVariant === "A" ? "Request a quote" : "Get quotes in minutes"}</h1>
        <p className="mt-2 text-slate-600">Share the basics. We’ll match you with pros and handle scheduling after you accept.</p>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setTimeout(scrollModalToTop, 0);
          }}
          className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
        >
          {abVariant === "A" ? "Request a Quote" : "Get Quotes"}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[85vh] flex flex-col">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-slate-900">
              {requestType === "quote" ? "Quick quote request" : "Schedule now (full booking)"}
            </h2>
            <p className="text-sm text-slate-600">
              {requestType === "quote"
                ? "We’ll notify nearby professionals and send you quotes."
                : "Pick a time now if you prefer to schedule immediately."}
            </p>

            <form onSubmit={handleSubmit} className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
              <div ref={modalScrollRef} className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Service</label>
                <Autocomplete
                  options={SERVICE_OPTIONS}
                  value={selectedServiceOption}
                  onChange={(_, val) => {
                    setService(val?.label || "");
                    setSubService("");
                  }}
                  getOptionLabel={(option) => option?.label ?? ""}
                  isOptionEqualToValue={(option, value) => option.label === value.label}
                  renderInput={(params) => <TextField {...params} label="Search services" size="small" />}
                />
              </div>

              {selectedServiceOption && currentSubServices.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Sub-service (optional)</label>
                  <Autocomplete
                    options={currentSubServices}
                    value={subService || null}
                    onChange={(_, val) => setSubService(val || "")}
                    renderInput={(params) => <TextField {...params} label="Pick a sub-service" size="small" />}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Describe the issue (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Add helpful details or leave blank"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Address / postcode</label>
                <input
                  ref={addressRef}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                  placeholder="Eircode or address"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Name (optional)</label>
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Email or phone</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                      placeholder="email@example.com"
                      type="email"
                    />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                      placeholder="+353 87 123 4567"
                    />
                  </div>
                  {!hasContact && (
                    <p className="text-xs text-rose-600">Please add at least one contact method so we can send your quotes.</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Choose your path</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setRequestType("quote")}
                    className={[
                      "rounded-lg border px-4 py-3 text-left text-sm font-semibold transition",
                      requestType === "quote"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    Request quotes (recommended)
                    <span className="mt-1 block text-xs font-normal text-slate-600">No date/time needed now.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestType("book")}
                    className={[
                      "rounded-lg border px-4 py-3 text-left text-sm font-semibold transition",
                      requestType === "book"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    Schedule now
                    <span className="mt-1 block text-xs font-normal text-slate-600">Pick a time and we’ll confirm.</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-800">When do you need the service?</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setUrgency("emergency")}
                    className={[
                      "flex-1 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition",
                      urgency === "emergency"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    Emergency (ASAP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency("scheduled")}
                    className={[
                      "flex-1 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition",
                      urgency === "scheduled"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    Flexible timing
                  </button>
                </div>

                {requestType === "book" && (
                  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <DatePicker
                      selected={appointmentStart}
                      onChange={(date: Date) => setAppointmentStart(date)}
                      showTimeSelect
                      timeIntervals={30}
                      minDate={new Date()}
                      dateFormat="MM/dd/yyyy h:mm aa"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                      placeholderText="Select date & time"
                    />
                    {!appointmentStart && (
                      <p className="text-xs text-slate-600">Pick a time to submit a scheduled booking. Leave blank to request quotes instead.</p>
                    )}
                  </div>
                )}
              </div>

              {submitError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</div>}
              {submitSuccess && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {submitSuccess}
                  <p className="mt-1 text-xs text-emerald-800">We’ll alert nearby pros. You can confirm time and payment after you accept a quote.</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-semibold",
                    !canSubmit || isSubmitting
                      ? "cursor-not-allowed bg-slate-200 text-slate-500"
                      : "bg-blue-600 text-white hover:bg-blue-700",
                  ].join(" ")}
                >
                  {isSubmitting ? "Sending..." : requestType === "quote" ? "Send quote request" : "Schedule booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
