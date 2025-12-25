"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
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

const STEP_LABELS = ["Service & issue", "Contact & address", "Date/Time & review", "Price estimate"];
const BOOK_STEP_STAGE_LABELS = ["Service", "Address", "Schedule", "Review"];
const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const BUDGET_OPTIONS = ["€80–€120", "€120–€200", "€200–€350", "I don’t know / Let the pro advise"];
const PRICE_RANGES: Record<string, { min: number; max: number }> = {
  cleaning: { min: 80, max: 150 },
  plumbing: { min: 120, max: 200 },
  electrician: { min: 120, max: 220 },
  handyman: { min: 80, max: 180 },
  painting: { min: 150, max: 300 },
  moving: { min: 180, max: 400 },
  gardening: { min: 80, max: 160 },
  "carpet cleaning": { min: 100, max: 180 },
  roofing: { min: 200, max: 500 },
  hvac: { min: 150, max: 400 },
  "pest control": { min: 90, max: 200 },
  locksmith: { min: 80, max: 160 },
  tiling: { min: 150, max: 350 },
  flooring: { min: 150, max: 350 },
};

const getEstimateForService = (service: string) => {
  const key = service.trim().toLowerCase();
  const direct = PRICE_RANGES[key];
  if (direct) return direct;
  if (key.includes("plumb")) return PRICE_RANGES.plumbing;
  if (key.includes("electric")) return PRICE_RANGES.electrician;
  if (key.includes("clean")) return PRICE_RANGES.cleaning;
  if (key.includes("paint")) return PRICE_RANGES.painting;
  if (key.includes("handy")) return PRICE_RANGES.handyman;
  if (key.includes("move")) return PRICE_RANGES.moving;
  if (key.includes("garden")) return PRICE_RANGES.gardening;
  if (key.includes("carpet")) return PRICE_RANGES["carpet cleaning"];
  if (key.includes("roof")) return PRICE_RANGES.roofing;
  if (key.includes("hvac") || key.includes("ac")) return PRICE_RANGES.hvac;
  if (key.includes("pest")) return PRICE_RANGES["pest control"];
  if (key.includes("lock")) return PRICE_RANGES.locksmith;
  if (key.includes("tile")) return PRICE_RANGES.tiling;
  if (key.includes("floor")) return PRICE_RANGES.flooring;
  return { min: 100, max: 250 };
};

export default function BookingPageClient() {
  // AB test text for quote CTA
  const abVariant = useMemo(() => (Math.random() < 0.5 ? "A" : "B"), []);

  // Quote path state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteService, setQuoteService] = useState("");
  const [quoteSubService, setQuoteSubService] = useState("");
  const [quoteDescription, setQuoteDescription] = useState("");
  const [quoteAddress, setQuoteAddress] = useState("");
  const [quoteContactName, setQuoteContactName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quotePhotos, setQuotePhotos] = useState<File[]>([]);
  const [quoteBudget, setQuoteBudget] = useState("");
  const [quoteUrgency, setQuoteUrgency] = useState("asap");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);
  const [quotePhotoError, setQuotePhotoError] = useState<string | null>(null);

  // Book path state
  const [bookOpen, setBookOpen] = useState(false);
  const [bookStep, setBookStep] = useState(1);
  const [bookService, setBookService] = useState("");
  const [bookSubService, setBookSubService] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookUrgency, setBookUrgency] = useState<Urgency>("emergency");
  const [bookAddress, setBookAddress] = useState("");
  const [bookContactName, setBookContactName] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookDateTime, setBookDateTime] = useState<Date | null>(null);
  const [bookBudget, setBookBudget] = useState("");
  const [bookPhotos, setBookPhotos] = useState<File[]>([]);
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookSuccess, setBookSuccess] = useState<string | null>(null);
  const [bookPhotoError, setBookPhotoError] = useState<string | null>(null);

  const quoteAddressRef = useRef<HTMLInputElement | null>(null);
  const bookAddressRef = useRef<HTMLInputElement | null>(null);
  const quoteModalScrollRef = useRef<HTMLDivElement | null>(null);
  const bookModalScrollRef = useRef<HTMLDivElement | null>(null);
  const didInitFromParamsRef = useRef(false);
  const searchParams = useSearchParams();

  const selectedQuoteService = useMemo(
    () => (quoteService ? SERVICE_OPTIONS.find((s) => s.label === quoteService) || null : null),
    [quoteService]
  );
  const selectedBookService = useMemo(
    () => (bookService ? SERVICE_OPTIONS.find((s) => s.label === bookService) || null : null),
    [bookService]
  );
  const currentQuoteSubServices = selectedQuoteService?.subServices || [];
  const currentBookSubServices = selectedBookService?.subServices || [];
  const readFilesToBase64 = async (files: File[]) => {
    const limited = files.slice(0, MAX_PHOTOS);
    const conversions = limited.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        })
    );
    return Promise.all(conversions);
  };

  const handlePhotoSelect = (
    event: ChangeEvent<HTMLInputElement>,
    setFiles: (files: File[]) => void,
    setError: (err: string | null) => void
  ) => {
    const { files } = event.target;
    if (!files) return;
    const images = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (images.some((file) => file.size > MAX_PHOTO_SIZE)) {
      setError("Each photo must be under 5MB.");
      return;
    }
    if (images.length > MAX_PHOTOS) {
      setError(`You can upload up to ${MAX_PHOTOS} photos.`);
    } else {
      setError(null);
    }
    setFiles(images.slice(0, MAX_PHOTOS));
  };

  const removePhotoAt = (index: number, files: File[], setFiles: (files: File[]) => void) => {
    setFiles(files.filter((_, i) => i !== index));
  };

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

  // Google address autocomplete
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!(window as any).google) return;
    const refs = [
      { ref: quoteAddressRef, setter: setQuoteAddress },
      { ref: bookAddressRef, setter: setBookAddress },
    ];
    const listeners: Array<{ listener: any }> = [];
    refs.forEach(({ ref, setter }) => {
      if (!ref.current) return;
      const autocomplete = new (window as any).google.maps.places.Autocomplete(ref.current, {
        fields: ["formatted_address", "geometry"],
        types: ["address"],
      });
      const listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setter(place?.formatted_address || ref.current?.value || "");
      });
      listeners.push({ listener });
    });
    return () => listeners.forEach(({ listener }) => listener?.remove?.());
  }, []);

  // Prefill service/mode from URL params (?service=, ?mode=, legacy ?type=)
  useEffect(() => {
    const serviceParam = searchParams?.get?.("service") || searchParams?.get?.("type");
    if (serviceParam) {
      const normalized = normalizeService(serviceParam);
      if (normalized) {
        setQuoteService(normalized);
        setBookService(normalized);
      }
    }

    if (didInitFromParamsRef.current) return;
    const modeParamRaw = (searchParams?.get?.("mode") || "").toLowerCase();
    const modeParam = modeParamRaw === "booking" ? "book" : modeParamRaw;
    if (modeParam !== "quote" && modeParam !== "book") return;

    didInitFromParamsRef.current = true;
    if (modeParam === "quote") {
      setQuoteOpen(true);
      setBookOpen(false);
      recordPathChoice("quote");
      setTimeout(() => scrollModalToTop(quoteModalScrollRef), 0);
      return;
    }

    setBookOpen(true);
    setBookStep(1);
    setQuoteOpen(false);
    recordPathChoice("book");
    setTimeout(() => scrollModalToTop(bookModalScrollRef), 0);
  }, [searchParams]);

  const emailValid = (value: string) => /\S+@\S+\.\S+/.test(value.trim());
  const phoneValid = (value: string) => value.replace(/\D/g, "").length >= 8;
  const quoteHasContact = emailValid(quoteEmail) || phoneValid(quotePhone);
  const bookHasContact = emailValid(bookEmail) || phoneValid(bookPhone);

  const quoteCanSubmit = quoteService.trim().length > 0 && quoteAddress.trim().length > 0 && quoteHasContact;

  const bookStepValid = (step: number) => {
    if (step === 1) return bookService.trim().length > 0;
    if (step === 2) return bookHasContact && bookAddress.trim().length > 0;
    if (step === 3) return bookUrgency === "scheduled" ? !!bookDateTime : true;
    return true;
  };

  const scrollModalToTop = (ref?: React.RefObject<HTMLDivElement>) => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    ref?.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const recordPathChoice = (pathType: RequestType) => {
    try {
      navigator.sendBeacon?.(
        "/api/metrics",
        new Blob([JSON.stringify({ pathType })], { type: "application/json" })
      );
    } catch {
      // ignore beacon errors
    }
  };

  const handleQuoteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!quoteCanSubmit) return;
    setQuoteSubmitting(true);
    setQuoteError(null);
    setQuoteSuccess(null);
    try {
      const photos = await readFilesToBase64(quotePhotos);
      const estimate = getEstimateForService(quoteService);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "quote",
          service: quoteService,
          subService: quoteSubService,
          description: quoteDescription,
          urgency: quoteUrgency,
          address: quoteAddress,
          contactName: quoteContactName,
          email: quoteEmail,
          phone: quotePhone,
          budgetRange: quoteBudget,
          priceEstimateMin: estimate.min,
          priceEstimateMax: estimate.max,
          photos,
          abVariant,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to submit request");
      const firstName = (quoteContactName || quoteEmail || "there").split(" ")[0];
      setQuoteSuccess(`Thanks, ${firstName}! Your quote request was sent. We’re notifying nearby professionals.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setQuoteError(msg);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const handleBookSubmit = async () => {
    if (!bookStepValid(3)) return;
    setBookSubmitting(true);
    setBookError(null);
    setBookSuccess(null);
    try {
      const photos = await readFilesToBase64(bookPhotos);
      const estimate = getEstimateForService(bookService);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "book",
          service: bookService,
          subService: bookSubService,
          description: bookDescription,
          urgency: bookUrgency,
          address: bookAddress,
          contactName: bookContactName,
          email: bookEmail,
          phone: bookPhone,
          appointmentStart: bookDateTime?.toISOString() ?? null,
          budgetRange: bookBudget,
          priceEstimateMin: estimate.min,
          priceEstimateMax: estimate.max,
          photos,
          abVariant,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to submit booking");
      const firstName = (bookContactName || bookEmail || "there").split(" ")[0];
      setBookSuccess(
        `Thanks, ${firstName}! Your booking request is in. We’ll confirm and share the professional’s details shortly.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setBookError(msg);
    } finally {
      setBookSubmitting(false);
    }
  };

  const handleBookFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bookStepValid(bookStep)) return;
    if (bookStep < 4) {
      setBookStep((prev) => prev + 1);
      setTimeout(() => scrollModalToTop(bookModalScrollRef), 0);
    } else {
      handleBookSubmit();
    }
  };

  const renderBookStep = () => {
    if (bookStep === 1) {
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
            You&apos;re starting with a free estimate. You&apos;ll confirm before any booking is made.
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Service</label>
            <Autocomplete
              options={SERVICE_OPTIONS}
              value={selectedBookService}
              onChange={(_, val) => {
                setBookService(val?.label || "");
                setBookSubService("");
              }}
              getOptionLabel={(option) => option?.label ?? ""}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => <TextField {...params} label="Search services" size="small" />}
            />
          </div>
          {selectedBookService && currentBookSubServices.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Sub-service (optional)</label>
              <Autocomplete
                options={currentBookSubServices}
                value={bookSubService || null}
                onChange={(_, val) => setBookSubService(val || "")}
                renderInput={(params) => <TextField {...params} label="Pick a sub-service" size="small" />}
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Describe the problem (optional)</label>
            <textarea
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              rows={3}
              placeholder="Add helpful details or leave blank"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Add photos (optional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotoSelect(e, setBookPhotos, setBookPhotoError)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            />
            <p className="text-xs text-slate-600">Up to {MAX_PHOTOS} photos, max 5MB each.</p>
            {bookPhotoError && <p className="text-xs text-rose-600">{bookPhotoError}</p>}
            {bookPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {bookPhotos.map((file, idx) => (
                  <div key={file.name + idx} className="flex items-center gap-2 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removePhotoAt(idx, bookPhotos, setBookPhotos)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">When do you need the service?</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setBookUrgency("emergency")}
                className={[
                  "flex-1 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition",
                  bookUrgency === "emergency"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                Emergency (ASAP)
              </button>
              <button
                type="button"
                onClick={() => setBookUrgency("scheduled")}
                className={[
                  "flex-1 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition",
                  bookUrgency === "scheduled"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                Flexible timing
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (bookStep === 2) {
      return (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">Still just a quote — no booking yet.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Name (optional)</label>
              <input
                value={bookContactName}
                onChange={(e) => setBookContactName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Email or phone</label>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={bookEmail}
                  onChange={(e) => setBookEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                  placeholder="email@example.com"
                  type="email"
                />
                <input
                  value={bookPhone}
                  onChange={(e) => setBookPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                  placeholder="+353 87 123 4567"
                />
              </div>
              {!bookHasContact && (
                <p className="text-xs text-rose-600">Please add at least one contact method so we can confirm details.</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Address / postcode</label>
            <input
              ref={bookAddressRef}
              value={bookAddress}
              onChange={(e) => setBookAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Eircode or address"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Budget (optional)</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {BUDGET_OPTIONS.map((budget) => (
                <button
                  type="button"
                  key={budget}
                  onClick={() => setBookBudget(budget)}
                  className={[
                    "rounded-lg border px-3 py-2 text-left text-sm transition",
                    bookBudget === budget
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                  ].join(" ")}
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (bookStep === 3) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            You&apos;re still just getting a quote — no booking yet. You&apos;ll confirm before anything is final.
          </p>
          {bookUrgency === "scheduled" ? (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <label className="text-xs font-semibold text-slate-700">Select date & time</label>
              <DatePicker
                selected={bookDateTime}
                onChange={(date: Date) => setBookDateTime(date)}
                showTimeSelect
                timeIntervals={30}
                minDate={new Date()}
                dateFormat="MM/dd/yyyy h:mm aa"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                placeholderText="Select date & time"
              />
              {!bookDateTime && <p className="text-xs text-slate-600">Pick a time so we can confirm your booking.</p>}
            </div>
          ) : (
            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-semibold text-amber-800">We’ll dispatch the next available professional.</p>
              <p className="text-xs text-amber-700">If you prefer a specific time, switch to “Schedule for later” and choose a slot.</p>
            </div>
          )}
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-800">Review</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>Service: {bookService || "—"}</li>
              {bookSubService && <li>Sub-service: {bookSubService}</li>}
              <li>Urgency: {bookUrgency === "emergency" ? "Emergency" : "Flexible"}</li>
              <li>Address: {bookAddress || "—"}</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {(() => {
          const estimate = getEstimateForService(bookService);
          const budgetValue = BUDGET_OPTIONS.find((b) => b === bookBudget);
          const budgetLow =
            budgetValue && budgetValue !== BUDGET_OPTIONS[BUDGET_OPTIONS.length - 1]
              ? parseInt(budgetValue.replace(/[^\d]/g, ""), 10)
              : null;
          const budgetWarning = budgetLow !== null && budgetLow < estimate.min;
          return (
            <div className="rounded-lg border border-slate-200 p-3 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Estimated price</p>
              <p className="text-sm text-slate-700">
                Estimated cost: €{estimate.min}–€{estimate.max}. The professional will confirm the final price before starting work.
              </p>
              <p className="text-xs text-slate-600">Most jobs in this category fall in this range.</p>
              {budgetWarning && (
                <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Note: Your budget is below the typical price for this type of job. Most jobs like this cost €{estimate.min}–€
                  {estimate.max}.
                </div>
              )}
            </div>
          );
        })()}
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-sm font-semibold text-slate-800">Summary</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            <li>Service: {bookService || "—"}</li>
            {bookSubService && <li>Sub-service: {bookSubService}</li>}
            <li>Urgency: {bookUrgency === "emergency" ? "Emergency" : "Flexible"}</li>
            <li>When: {bookDateTime ? bookDateTime.toLocaleString() : "Not set"}</li>
            <li>Address: {bookAddress || "—"}</li>
            {bookBudget && <li>Budget: {bookBudget}</li>}
            <li>Contact: {bookEmail || bookPhone || "—"}</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderStepper = () => (
    <div className="flex items-center justify-between gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
      {STEP_LABELS.map((label, idx) => {
        const stepNumber = idx + 1;
        const active = stepNumber === bookStep;
        const done = stepNumber < bookStep;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <span
              className={[
                "flex h-6 w-6 items-center justify-center rounded-full border",
                done
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : active
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-600",
              ].join(" ")}
            >
              {stepNumber}
            </span>
            <span className={active ? "text-blue-700" : "text-slate-600"}>{label}</span>
          </div>
        );
      })}
    </div>
  );

  const quoteButtonLabel = abVariant === "A" ? "Get Free Quote" : "Get Free Quote";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Get started</h1>
            <p className="mt-2 text-slate-600">
              Choose the option you need. You’ll review details before anything is confirmed.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6">
              <p className="text-sm font-semibold text-slate-900">Book a Service</p>
              <p className="mt-1 text-sm text-slate-600">Request a professional. You’ll review before confirming.</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>
                  <span className="font-semibold text-slate-900">Step-by-step:</span> Service → Address → Schedule → Review
                </li>
                <li>
                  <span className="font-semibold text-slate-900">No payment:</span> taken until your booking is confirmed
                </li>
              </ul>

              <button
                type="button"
                onClick={() => {
                  setBookOpen(true);
                  setBookStep(1);
                  setQuoteOpen(false);
                  recordPathChoice("book");
                  setTimeout(() => scrollModalToTop(bookModalScrollRef), 0);
                }}
                className="mt-5 w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700"
              >
                Book a Service
              </button>
              <p className="mt-2 text-xs text-slate-600">You’ll confirm your booking request at the final step.</p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-6">
              <p className="text-sm font-semibold text-slate-900">Get Free Quote</p>
              <p className="mt-1 text-sm text-slate-600">See estimated price. No booking. No payment.</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>
                  <span className="font-semibold text-slate-900">Estimate only:</span> get an expected price range
                </li>
                <li>
                  <span className="font-semibold text-slate-900">No commitment:</span> you decide if you want to book
                </li>
                <li>
                  <span className="font-semibold text-slate-900">No payment:</span> nothing is charged in the quote flow
                </li>
              </ul>

              <button
                type="button"
                onClick={() => {
                  setQuoteOpen(true);
                  setBookOpen(false);
                  recordPathChoice("quote");
                  setTimeout(() => scrollModalToTop(quoteModalScrollRef), 0);
                }}
                className="mt-5 w-full rounded-full border border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
              >
                {quoteButtonLabel}
              </button>
              <p className="mt-2 text-xs text-slate-600">Free estimate only. No booking. No payment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote modal */}
      {quoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            ref={quoteModalScrollRef}
            className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setQuoteOpen(false)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Get a Free Quote</h2>
            <p className="text-sm text-slate-600">Free estimate only. No booking. No payment.</p>
            <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
              You are requesting a quote. This does not confirm a booking.
            </div>

            <form onSubmit={handleQuoteSubmit} className="mt-4 flex-1 space-y-4 pr-1">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Service</label>
                <Autocomplete
                  options={SERVICE_OPTIONS}
                  value={selectedQuoteService}
                  onChange={(_, val) => {
                    setQuoteService(val?.label || "");
                    setQuoteSubService("");
                  }}
                  getOptionLabel={(option) => option?.label ?? ""}
                  isOptionEqualToValue={(option, value) => option.label === value.label}
                  renderInput={(params) => <TextField {...params} label="Search services" size="small" />}
                />
              </div>

              {selectedQuoteService && currentQuoteSubServices.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Sub-service (optional)</label>
                  <Autocomplete
                    options={currentQuoteSubServices}
                    value={quoteSubService || null}
                    onChange={(_, val) => setQuoteSubService(val || "")}
                    renderInput={(params) => <TextField {...params} label="Pick a sub-service" size="small" />}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Describe the issue (optional)</label>
                <textarea
                  value={quoteDescription}
                  onChange={(e) => setQuoteDescription(e.target.value)}
                  rows={3}
                  placeholder="Add helpful details or leave blank"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Add photos (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoSelect(e, setQuotePhotos, setQuotePhotoError)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                />
                <p className="text-xs text-slate-600">Up to {MAX_PHOTOS} photos, max 5MB each.</p>
                {quotePhotoError && <p className="text-xs text-rose-600">{quotePhotoError}</p>}
                {quotePhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {quotePhotos.map((file, idx) => (
                      <div key={file.name + idx} className="flex items-center gap-2 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removePhotoAt(idx, quotePhotos, setQuotePhotos)}
                          className="text-rose-600 hover:text-rose-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">How soon do you need it?</label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { value: "asap", label: "ASAP / Emergency" },
                    { value: "24h", label: "Within 24 hours" },
                    { value: "week", label: "This week" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setQuoteUrgency(opt.value)}
                      className={[
                        "rounded-lg border px-3 py-2 text-left text-sm font-semibold transition",
                        quoteUrgency === opt.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Budget (optional)</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {BUDGET_OPTIONS.map((budget) => (
                    <button
                      type="button"
                      key={budget}
                      onClick={() => setQuoteBudget(budget)}
                      className={[
                        "rounded-lg border px-3 py-2 text-left text-sm transition",
                        quoteBudget === budget
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                      ].join(" ")}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Address / postcode</label>
                <input
                  ref={quoteAddressRef}
                  value={quoteAddress}
                  onChange={(e) => setQuoteAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                  placeholder="Eircode or address"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Name (optional)</label>
                  <input
                    value={quoteContactName}
                    onChange={(e) => setQuoteContactName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Email or phone</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={quoteEmail}
                      onChange={(e) => setQuoteEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                      placeholder="email@example.com"
                      type="email"
                    />
                    <input
                      value={quotePhone}
                      onChange={(e) => setQuotePhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                      placeholder="+353 87 123 4567"
                    />
                  </div>
                  {!quoteHasContact && (
                    <p className="text-xs text-rose-600">Please add at least one contact method so we can send quotes.</p>
                  )}
                </div>
              </div>

              {quoteError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{quoteError}</div>}
              {quoteSuccess && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {quoteSuccess}
                  <p className="mt-1 text-xs text-emerald-800">We’ll alert nearby pros and share responses with you.</p>
                </div>
              )}

              <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setQuoteOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuoteOpen(false);
                    setBookOpen(true);
                    setBookStep(1);
                    setTimeout(() => scrollModalToTop(bookModalScrollRef), 0);
                  }}
                  className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Proceed to Booking
                </button>
                <button
                  type="submit"
                  disabled={!quoteCanSubmit || quoteSubmitting}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-semibold",
                    !quoteCanSubmit || quoteSubmitting
                      ? "cursor-not-allowed bg-slate-200 text-slate-500"
                      : "bg-blue-600 text-white hover:bg-blue-700",
                  ].join(" ")}
                >
                  {quoteSubmitting ? "Sending..." : "Request Free Quote"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book modal */}
      {bookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            ref={bookModalScrollRef}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setBookOpen(false)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Book a Service</h2>
            <p className="text-sm text-slate-600">
              Book a trusted local professional in a few steps. You’ll review details before anything is confirmed.
            </p>

            <div className="mt-4">{renderStepper()}</div>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Step {bookStep} of {STEP_LABELS.length} – {BOOK_STEP_STAGE_LABELS[bookStep - 1] ?? "Review"}
            </p>

            <form onSubmit={handleBookFormSubmit} className="mt-4 flex-1 space-y-4">
              {renderBookStep()}

              {bookError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{bookError}</div>}
              {bookSuccess && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {bookSuccess}
                  <p className="mt-1 text-xs text-emerald-800">We’re assigning a professional and will confirm the booking.</p>
                </div>
              )}

              {bookStep === STEP_LABELS.length && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  No payment is taken until your booking is confirmed.
                </div>
              )}

              <div className="flex justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (bookStep > 1) setBookStep((prev) => prev - 1);
                    else setBookOpen(false);
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {bookStep > 1 ? "Back" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={!bookStepValid(bookStep) || bookSubmitting}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-semibold",
                    !bookStepValid(bookStep) || bookSubmitting
                      ? "cursor-not-allowed bg-slate-200 text-slate-500"
                      : "bg-emerald-600 text-white hover:bg-emerald-700",
                  ].join(" ")}
                >
                  {bookSubmitting
                    ? "Submitting..."
                    : bookStep === 1
                      ? "Add Contact & Address"
                      : bookStep === 2
                        ? "Choose Schedule"
                        : bookStep === 3
                          ? "Review & Estimate"
                          : "Confirm Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
