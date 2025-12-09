"use client";

import { useMemo, useRef, useState, FormEvent, ChangeEvent } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MAIN_SERVICES, SUB_SERVICES } from "@/lib/service-options";

type ServiceOption = { label: string; subServices: string[] };
type Urgency = "emergency" | "scheduled";

const SERVICE_OPTIONS: ServiceOption[] = MAIN_SERVICES.map((label) => ({
  label,
  subServices: SUB_SERVICES[label] || [],
}));

const PRICE_RANGES: Record<string, [number, number][]> = {
  plumbing: [
    [100, 150],
    [150, 250],
    [250, 500],
  ],
  welding: [
    [80, 150],
    [150, 300],
    [300, 700],
  ],
  cleaning: [
    [60, 120],
    [120, 200],
    [200, 350],
  ],
  handyman: [
    [70, 140],
    [140, 240],
    [240, 400],
  ],
  electrical: [
    [110, 180],
    [180, 280],
    [280, 500],
  ],
  painting: [
    [100, 180],
    [180, 300],
    [300, 600],
  ],
  gardening: [
    [60, 120],
    [120, 200],
    [200, 320],
  ],
  moving: [
    [150, 250],
    [250, 400],
    [400, 700],
  ],
  carpentry: [
    [120, 200],
    [200, 350],
    [350, 600],
  ],
  hvac: [
    [120, 220],
    [220, 380],
    [380, 650],
  ],
  "pest control": [
    [80, 140],
    [140, 220],
    [220, 380],
  ],
  locksmith: [
    [70, 130],
    [130, 220],
    [220, 350],
  ],
  tiling: [
    [130, 220],
    [220, 380],
    [380, 650],
  ],
  flooring: [
    [150, 250],
    [250, 450],
    [450, 800],
  ],
  roofing: [
    [180, 300],
    [300, 550],
    [550, 900],
  ],
  "cctv installation": [
    [120, 220],
    [220, 380],
    [380, 700],
  ],
  "solar panels": [
    [250, 500],
    [500, 900],
    [900, 1500],
  ],
  "appliance repair": [
    [80, 140],
    [140, 220],
    [220, 360],
  ],
  "window cleaning": [
    [60, 100],
    [100, 160],
    [160, 260],
  ],
  "pressure washing": [
    [80, 140],
    [140, 220],
    [220, 360],
  ],
  "chimney sweep": [
    [80, 140],
    [140, 220],
    [220, 360],
  ],
  "gutter cleaning": [
    [70, 130],
    [130, 200],
    [200, 320],
  ],
  "air conditioning": [
    [120, 200],
    [200, 350],
    [350, 650],
  ],
  "builder": [
    [200, 400],
    [400, 800],
    [800, 1500],
  ],
  "roof cleaning": [
    [100, 170],
    [170, 280],
    [280, 450],
  ],
};

const normalizePriceKey = (service: string) => service.trim().toLowerCase();

const getEstimate = (service: string): [number, number] => {
  const key = normalizePriceKey(service);
  const ranges = PRICE_RANGES[key];
  if (ranges && ranges.length) return ranges[1] || ranges[0];
  // fuzzy
  if (key.includes("plumb")) return PRICE_RANGES.plumbing[1];
  if (key.includes("electric")) return PRICE_RANGES.electrical[1];
  if (key.includes("clean")) return PRICE_RANGES.cleaning[1];
  if (key.includes("paint")) return PRICE_RANGES.painting[1];
  if (key.includes("handy")) return PRICE_RANGES.handyman[1];
  if (key.includes("move")) return PRICE_RANGES.moving[1];
  if (key.includes("garden")) return PRICE_RANGES.gardening[1];
  if (key.includes("carpet")) return PRICE_RANGES["carpet cleaning"][1];
  if (key.includes("roof")) return PRICE_RANGES.roofing[1];
  if (key.includes("hvac") || key.includes("ac")) return PRICE_RANGES.hvac[1];
  if (key.includes("pest")) return PRICE_RANGES["pest control"][1];
  if (key.includes("lock")) return PRICE_RANGES.locksmith[1];
  if (key.includes("tile")) return PRICE_RANGES.tiling[1];
  if (key.includes("floor")) return PRICE_RANGES.flooring[1];
  return [100, 250];
};

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const readFilesToBase64 = async (files: File[]) => {
  const limited = files.slice(0, MAX_PHOTOS);
  return Promise.all(
    limited.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        })
    )
  );
};

const usePhotos = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    const images = list.filter((f) => f.type.startsWith("image/"));
    if (images.some((f) => f.size > MAX_PHOTO_SIZE)) {
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
  const removeAt = (i: number) => setFiles(files.filter((_, idx) => idx !== i));
  return { files, error, onSelect, removeAt, setFiles };
};

function TrustIcons() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-semibold text-green-200">
        ✅ ID Verified
      </span>
      <span className="flex items-center gap-2 rounded-full bg-blue-500/15 px-3 py-1.5 text-xs font-semibold text-blue-200">
        🛡️ Insured
      </span>
      <span className="flex items-center gap-2 rounded-full bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-200">
        🔒 Secure Payment
      </span>
    </div>
  );
}

function Modal({
  open,
  onClose,
  children,
  title,
  subtitle,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className={`relative ${wide ? "max-w-4xl" : "max-w-2xl"} w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`}>
        <button onClick={onClose} className="absolute right-3 top-3 text-slate-500 hover:text-slate-800">
          ✕
        </button>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [service, setService] = useState("");
  const [subService, setSubService] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [urgency, setUrgency] = useState("asap");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const { files, error: photoError, onSelect, removeAt } = usePhotos();

  const selectedService = useMemo(
    () => (service ? SERVICE_OPTIONS.find((s) => s.label === service) || null : null),
    [service]
  );
  const subServices = selectedService?.subServices || [];
  const hasContact = /\S+@\S+\.\S+/.test(email.trim()) || phone.replace(/\D/g, "").length >= 8;
  const canSubmit = service.trim() && address.trim() && hasContact;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const photos = await readFilesToBase64(files);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "quote",
          service,
          subService,
          description,
          address,
          contactName,
          email,
          phone,
          urgency,
          photos,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to submit request");
      const first = (contactName || email || "there").split(" ")[0];
      setSubmitSuccess(`Thanks, ${first}! Your quote request was sent. We’re notifying nearby professionals.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Get quotes" subtitle="Quick request—no payment or schedule required." wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Service</label>
          <Autocomplete
            options={SERVICE_OPTIONS}
            value={selectedService}
            onChange={(_, val) => {
              setService(val?.label || "");
              setSubService("");
            }}
            getOptionLabel={(option) => option?.label ?? ""}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderInput={(params) => <TextField {...params} label="Search services" size="small" />}
          />
        </div>
        {subServices.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Sub-service (optional)</label>
            <Autocomplete
              options={subServices}
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
          <label className="text-xs font-semibold text-slate-700">Add photos (optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onSelect}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
          />
          <p className="text-xs text-slate-600">Up to 5 photos, max 5MB each.</p>
          {photoError && <p className="text-xs text-rose-600">{photoError}</p>}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <div key={file.name + idx} className="flex items-center gap-2 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => removeAt(idx)} className="text-rose-600 hover:text-rose-700">
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
                onClick={() => setUrgency(opt.value)}
                className={[
                  "rounded-lg border px-3 py-2 text-left text-sm font-semibold transition",
                  urgency === opt.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Address / postcode</label>
          <input
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
            {!hasContact && <p className="text-xs text-rose-600">Add at least one contact method so we can send quotes.</p>}
          </div>
        </div>

        {submitError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</div>}
        {submitSuccess && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {submitSuccess}
            <p className="mt-1 text-xs text-emerald-800">We’ll alert nearby pros and share responses with you.</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={[
              "rounded-lg px-4 py-2 text-sm font-semibold",
              !canSubmit || isSubmitting ? "cursor-not-allowed bg-slate-200 text-slate-500" : "bg-blue-600 text-white hover:bg-blue-700",
            ].join(" ")}
          >
            {isSubmitting ? "Sending..." : "Send request"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function BookModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [subService, setSubService] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("emergency");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const { files, error: photoError, onSelect, removeAt } = usePhotos();

  const selectedService = useMemo(
    () => (service ? SERVICE_OPTIONS.find((s) => s.label === service) || null : null),
    [service]
  );
  const subServices = selectedService?.subServices || [];
  const hasContact = /\S+@\S+\.\S+/.test(email.trim()) || phone.replace(/\D/g, "").length >= 8;

  const stepValid = (s: number) => {
    if (s === 1) return !!service;
    if (s === 2) return hasContact && address.trim().length > 0;
    if (s === 3) return urgency === "scheduled" ? !!dateTime : true;
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stepValid(step)) return;
    if (step < 4) {
      setStep((prev) => prev + 1);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const photos = await readFilesToBase64(files);
      const [min, max] = getEstimate(service);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "book",
          service,
          subService,
          description,
          urgency,
          address,
          contactName,
          email,
          phone,
          appointmentStart: urgency === "scheduled" ? dateTime?.toISOString() ?? null : null,
          priceEstimateMin: min,
          priceEstimateMax: max,
          photos,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to submit booking");
      const first = (contactName || email || "there").split(" ")[0];
      setSubmitSuccess(`Thanks, ${first}! Your booking request is in. We’ll confirm and share the professional’s details shortly.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimateRange = getEstimate(service);

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Service</label>
            <Autocomplete
              options={SERVICE_OPTIONS}
              value={selectedService}
              onChange={(_, val) => {
                setService(val?.label || "");
                setSubService("");
              }}
              getOptionLabel={(option) => option?.label ?? ""}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => <TextField {...params} label="Search services" size="small" />}
            />
          </div>
          {subServices.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Sub-service (optional)</label>
              <Autocomplete
                options={subServices}
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
            <label className="text-xs font-semibold text-slate-700">Add photos (optional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onSelect}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            />
            <p className="text-xs text-slate-600">Up to 5 photos, max 5MB each.</p>
            {photoError && <p className="text-xs text-rose-600">{photoError}</p>}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((file, idx) => (
                  <div key={file.name + idx} className="flex items-center gap-2 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700">
                    <span>{file.name}</span>
                    <button type="button" onClick={() => removeAt(idx)} className="text-rose-600 hover:text-rose-700">
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
                onClick={() => setUrgency("emergency")}
                className={[
                  "flex-1 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition",
                  urgency === "emergency" ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                Emergency / ASAP
              </button>
              <button
                type="button"
                onClick={() => setUrgency("scheduled")}
                className={[
                  "flex-1 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition",
                  urgency === "scheduled" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                Schedule for later
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
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
              {!hasContact && <p className="text-xs text-rose-600">Add at least one contact so we can confirm.</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Address / postcode</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Eircode or address"
            />
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-4">
          {urgency === "scheduled" ? (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <label className="text-xs font-semibold text-slate-700">Select date & time</label>
              <DatePicker
                selected={dateTime}
                onChange={(date: Date) => setDateTime(date)}
                showTimeSelect
                timeIntervals={30}
                minDate={new Date()}
                dateFormat="MM/dd/yyyy h:mm aa"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                placeholderText="Select date & time"
              />
              {!dateTime && <p className="text-xs text-slate-600">Pick a time so we can confirm your booking.</p>}
            </div>
          ) : (
            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-semibold text-amber-800">We’ll dispatch the next available professional.</p>
              <p className="text-xs text-amber-700">If you prefer a specific time, switch to “Schedule for later.”</p>
            </div>
          )}
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-800">Review</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>Service: {service || "—"}</li>
              {subService && <li>Sub-service: {subService}</li>}
              <li>Urgency: {urgency === "emergency" ? "Emergency" : "Scheduled"}</li>
              <li>When: {dateTime ? dateTime.toLocaleString() : urgency === "emergency" ? "ASAP" : "Not set"}</li>
              <li>Address: {address || "—"}</li>
              <li>Contact: {email || phone || "—"}</li>
            </ul>
          </div>
        </div>
      );
    }

    const [min, max] = estimateRange;
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 p-3 space-y-2">
          <p className="text-sm font-semibold text-slate-800">Estimated price</p>
          <p className="text-sm text-slate-700">Estimated price: €{min} – €{max}</p>
          <p className="text-xs text-slate-600">Final price confirmed by the professional before starting work.</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-sm font-semibold text-slate-800">Summary</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            <li>Service: {service || "—"}</li>
            {subService && <li>Sub-service: {subService}</li>}
            <li>Urgency: {urgency === "emergency" ? "Emergency" : "Scheduled"}</li>
            <li>When: {dateTime ? dateTime.toLocaleString() : urgency === "emergency" ? "ASAP" : "Not set"}</li>
            <li>Address: {address || "—"}</li>
            <li>Contact: {email || phone || "—"}</li>
          </ul>
        </div>
        {submitError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</div>}
        {submitSuccess && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {submitSuccess}
            <p className="mt-1 text-xs text-emerald-800">We’re assigning a professional and will confirm the booking.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Book now" subtitle="Full booking wizard with schedule and confirmation." wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <span
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full border",
                  step === num ? "border-blue-500 bg-blue-50 text-blue-700" : num < step ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-slate-600",
                ].join(" ")}
              >
                {num}
              </span>
              <span className={step === num ? "text-blue-700" : "text-slate-600"}>
                {["Service", "Contact", "Schedule", "Estimate"][num - 1]}
              </span>
            </div>
          ))}
        </div>

        {renderStep()}

        <div className="flex justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep((prev) => prev - 1);
              else onClose();
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            {step > 1 ? "Back" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={!stepValid(step) || isSubmitting}
            className={[
              "rounded-lg px-4 py-2 text-sm font-semibold",
              !stepValid(step) || isSubmitting ? "cursor-not-allowed bg-slate-200 text-slate-500" : "bg-emerald-600 text-white hover:bg-emerald-700",
            ].join(" ")}
          >
            {step < 4 ? "Next" : isSubmitting ? "Submitting..." : "Confirm booking"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ProModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const selectedService = useMemo(
    () => (service ? SERVICE_OPTIONS.find((s) => s.label === service) || null : null),
    [service]
  );

  const canSubmit = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email.trim()) && phone.replace(/\D/g, "").length >= 8 && !!service;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await fetch("/api/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, notes }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to submit");
      const first = (name || email || "there").split(" ")[0];
      setSubmitSuccess(`Thanks, ${first}! We’ll review your profile and get in touch.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Become a professional" subtitle="Join our vetted network and receive jobs." wide={false}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            placeholder="email@example.com"
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            placeholder="+353 87 123 4567"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Main service</label>
          <Autocomplete
            options={SERVICE_OPTIONS}
            value={selectedService}
            onChange={(_, val) => setService(val?.label || "")}
            getOptionLabel={(option) => option?.label ?? ""}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderInput={(params) => <TextField {...params} label="Select service" size="small" />}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            placeholder="Experience, coverage area, licenses"
          />
        </div>
        {submitError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</div>}
        {submitSuccess && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {submitSuccess}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={[
              "rounded-lg px-4 py-2 text-sm font-semibold",
              !canSubmit || isSubmitting ? "cursor-not-allowed bg-slate-200 text-slate-500" : "bg-blue-600 text-white hover:bg-blue-700",
            ].join(" ")}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function HomePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [proOpen, setProOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-start px-6 py-20 text-left">
        <h1 className="text-4xl md:text-5xl font-black leading-tight">
          FixEasy: book trusted pros or get quotes instantly
        </h1>
        <p className="mt-3 text-lg text-slate-200">
          Quick requests, verified professionals, secure handling. Choose your path and we’ll do the rest.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              setQuoteOpen(true);
              setBookOpen(false);
              setProOpen(false);
            }}
            className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-600"
          >
            💬 Get Quotes
          </button>
          <button
            onClick={() => {
              setBookOpen(true);
              setQuoteOpen(false);
              setProOpen(false);
            }}
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600"
          >
            🛠 Book Now
          </button>
          <button
            onClick={() => {
              setProOpen(true);
              setBookOpen(false);
              setQuoteOpen(false);
            }}
            className="rounded-full border border-slate-400 px-6 py-3 text-sm font-semibold text-white hover:border-white"
          >
            💼 Become a Professional
          </button>
        </div>
        <TrustIcons />
      </div>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
      <BookModal open={bookOpen} onClose={() => setBookOpen(false)} />
      <ProModal open={proOpen} onClose={() => setProOpen(false)} />
    </main>
  );
}
