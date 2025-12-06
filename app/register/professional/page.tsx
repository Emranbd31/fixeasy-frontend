"use client";

import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { MAIN_SERVICES, SUB_SERVICES } from "@/lib/service-options";

type ServiceOption = {
  label: string;
  subServices: string[];
};

const SERVICE_OPTIONS: ServiceOption[] = MAIN_SERVICES.map((label) => ({
  label,
  subServices: SUB_SERVICES[label] || [],
}));

export default function ProfessionalRegisterPage() {
  const [open, setOpen] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [subService, setSubService] = useState("");
  const [experience, setExperience] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const modalScrollRef = useRef<HTMLDivElement | null>(null);

  const selectedServiceOption = useMemo(
    () => (service ? SERVICE_OPTIONS.find((s) => s.label === service) || null : null),
    [service]
  );
  const currentSubServices = selectedServiceOption?.subServices || [];

  useEffect(() => {
    if (open && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => modalScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 0);
    }
  }, [open]);

  const canSubmit =
    fullName.trim().length > 1 &&
    email.trim().length > 3 &&
    phone.trim().length > 5 &&
    service.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const payload = {
        fullName,
        email,
        phone,
        service,
        subService,
        experience,
        notes,
      };
      const res = await fetch("/api/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to submit your application");
      setSubmitSuccess("Thanks! We received your details. Our team will be in touch shortly.");
      setOpen(false);
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
        <h1 className="text-3xl font-bold text-slate-900">Become a FixEasy Professional</h1>
        <p className="mt-2 text-slate-600">Quick intake — we’ll review and invite you to the platform.</p>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setTimeout(() => modalScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 0);
          }}
          className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
        >
          Apply now
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Quick application</h2>
            <p className="text-sm text-slate-600">Tell us your trade and contact. We’ll follow up to finalize.</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div ref={modalScrollRef} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Full name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                      placeholder="e.g. John Murphy"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                      placeholder="+353 8X XXX XXXX"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Years of experience (optional)</label>
                    <input
                      type="number"
                      min={0}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Main service</label>
                  <Autocomplete
                    options={SERVICE_OPTIONS}
                    value={selectedServiceOption}
                    onChange={(_, val) => {
                      setService(val?.label || "");
                      setSubService("");
                    }}
                    getOptionLabel={(option) => option?.label ?? ""}
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    renderInput={(params) => <TextField {...params} label="Search trades" size="small" />}
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
                  <label className="text-xs font-semibold text-slate-700">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Tell us about your qualifications or areas served."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>

                {submitError && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {submitSuccess}
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
                    {isSubmitting ? "Submitting..." : "Submit application"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
