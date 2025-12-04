"use client";

import React, { useMemo, useState } from "react";
import { MAIN_SERVICES, SUB_SERVICES } from "@/lib/service-options";

type Step = 1 | 2 | 3 | 4;

type EmergencyResponse =
  | "under_1_hour"
  | "1_3_hours"
  | "same_day"
  | "next_day"
  | "scheduled_only";
const WORKING_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const isPositiveNumber = (value: string, { allowZero = false } = {}) => {
  const num = Number(value);
  if (Number.isNaN(num)) return false;
  return allowZero ? num >= 0 : num > 0;
};

type FormState = {
  // Step 1
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2
  mainServices: string[];
  subServices: Record<string, string[]>;
  yearsOfExperience: string;
  hourlyRate: string;
  minCalloutFee: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  eircode: string;
  serviceAreas: string[];
  workingDays: string[];
  workingHours: string;
  offersEmergency: boolean;
  emergencyResponse: EmergencyResponse | "";
  emergencyCalloutFee: string;
  // Step 3
  qualificationSummary: string;
  tradeCertifications: string;
  hasInsurance: boolean;
  insuranceDetails: string;
  // Step 4
  termsAccepted: boolean;
  acceptedTerms: boolean;
};

type FileState = {
  idDocument?: File | null;
  proofOfAddress?: File | null;
  insuranceDocument?: File | null;
  otherDocument?: File | null;
};

const IRISH_COUNTIES = [
  "Dublin",
  "Kildare",
  "Meath",
  "Wicklow",
  "Louth",
  "Limerick",
  "Cork",
  "Galway",
  "Waterford",
  "Donegal",
  "Mayo",
  "Kerry",
  "Clare",
  "Kilkenny",
  "Wexford",
  "Laois",
  "Offaly",
  "Westmeath",
  "Roscommon",
  "Sligo",
  "Leitrim",
  "Monaghan",
  "Cavan",
  "Tipperary",
  "Longford",
  "Carlow",
];

const INITIAL_FORM: FormState = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  mainServices: [],
  subServices: {},
  yearsOfExperience: "",
  hourlyRate: "",
  minCalloutFee: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
  eircode: "",
  serviceAreas: [],
  workingDays: [],
  workingHours: "",
  offersEmergency: false,
  emergencyResponse: "",
  emergencyCalloutFee: "",
  qualificationSummary: "",
  tradeCertifications: "",
  hasInsurance: false,
  insuranceDetails: "",
  termsAccepted: false,
  acceptedTerms: false,
};

export default function ProfessionalRegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [files, setFiles] = useState<FileState>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const activeSubServices = useMemo(() => {
    return form.mainServices.flatMap((svc) =>
      (SUB_SERVICES[svc] || []).map((label) => ({ svc, label }))
    );
  }, [form.mainServices]);

  const smoothToTop = () => {
    if (typeof window === "undefined") return;
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const toggleArrayValue = (key: keyof FormState, value: string) => {
    setForm((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: next };
    });
    if (key === "mainServices") setError(null);
  };

  const toggleSubService = (service: string, sub: string) => {
    setForm((prev) => {
      const current = prev.subServices[service] || [];
      const next = current.includes(sub) ? current.filter((s) => s !== sub) : [...current, sub];
      return { ...prev, subServices: { ...prev.subServices, [service]: next } };
    });
  };

  const handleChange =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleFileChange =
    (key: keyof FileState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setFiles((prev) => ({ ...prev, [key]: file }));
    };

  const validateStep = (current: Step) => {
    if (current === 1) {
      if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim()) {
        return "Please complete your name, phone, and email.";
      }
      if (!form.password.trim() || !form.confirmPassword.trim()) {
        return "Please create and confirm your password.";
      }
      if (form.password !== form.confirmPassword) {
        return "Passwords must match.";
      }
      if (form.password.length < 6) {
        return "Password must be at least 6 characters.";
      }
    }
    if (current === 2) {
      if (!form.mainServices.length) return "Select at least one main service.";
      const years = Number(form.yearsOfExperience);
      if (!Number.isInteger(years) || years <= 0 || years > 80) {
        return "Years of experience must be between 1 and 80.";
      }
      if (!isPositiveNumber(form.hourlyRate) || !isPositiveNumber(form.minCalloutFee)) {
        return "Hourly rate and minimum call-out fee must be positive numbers.";
      }
      if (form.offersEmergency && !isPositiveNumber(form.emergencyCalloutFee || "0")) {
        return "Emergency call-out fee must be a positive number.";
      }
      if (!form.addressLine1.trim() || !form.city.trim() || !form.county.trim()) {
        return "Please complete your address.";
      }
      if (!form.serviceAreas.length) return "Select at least one service area.";
    }
    if (current === 3) {
      if (!form.qualificationSummary.trim()) return "Add a short qualification summary.";
    }
    if (current === 4) {
      if (!form.termsAccepted && !form.acceptedTerms) return "Please accept the terms to continue.";
    }
    return null;
  };

  const goToStep = (target: Step) => {
    const movingForward = target > step;
    if (movingForward) {
      const err = validateStep(step);
      if (err) {
        setError(err);
        return;
      }
    }
    setError(null);
    setStep(target);
    smoothToTop();
  };

  const handleSubmit = async () => {
    const err = validateStep(4);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("mainServices", JSON.stringify(form.mainServices));
      fd.append("subServices", JSON.stringify(form.subServices));
      fd.append("yearsOfExperience", form.yearsOfExperience);
      fd.append("hourlyRate", form.hourlyRate);
      fd.append("minCalloutFee", form.minCalloutFee);
      fd.append("addressLine1", form.addressLine1);
      fd.append("addressLine2", form.addressLine2);
      fd.append("city", form.city);
      fd.append("county", form.county);
      fd.append("eircode", form.eircode);
      fd.append("serviceAreas", JSON.stringify(form.serviceAreas));
      fd.append("workingDays", JSON.stringify(form.workingDays));
      fd.append("workingHours", form.workingHours);
      fd.append("offersEmergency", String(form.offersEmergency));
      fd.append("emergencyResponse", form.emergencyResponse || "scheduled_only");
      fd.append("emergencyCalloutFee", form.emergencyCalloutFee);
      fd.append("qualificationSummary", form.qualificationSummary);
      fd.append("tradeCertifications", form.tradeCertifications);
      fd.append("hasInsurance", String(form.hasInsurance));
      fd.append("insuranceDetails", form.insuranceDetails);
      fd.append("acceptedTerms", String(form.termsAccepted || form.acceptedTerms));
      if (files.idDocument) fd.append("idDocument", files.idDocument);
      if (files.proofOfAddress) fd.append("proofOfAddress", files.proofOfAddress);
      if (files.insuranceDocument) fd.append("insuranceDocument", files.insuranceDocument);
      if (files.otherDocument) fd.append("otherDocument", files.otherDocument);

      const res = await fetch("/api/pro/signup", { method: "POST", body: fd });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to submit application.");
      }

      setSuccess("Thanks for registering! Our team will review your profile and documents shortly.");
      setForm(INITIAL_FORM);
      setFiles({});
      setStep(1);
    } catch (err: any) {
      setError(err?.message || "Something went wrong while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10" id="top">
      <div className="mx-auto max-w-5xl px-4">
        <div className="sticky top-0 z-20 mb-6 bg-gradient-to-b from-slate-50/95 to-slate-100/95 backdrop-blur">
          <div className="flex flex-col gap-2 pb-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Professional registration</p>
              <h1 className="text-2xl font-semibold text-slate-900">Become a FixEasy Professional</h1>
              <p className="text-sm text-slate-600">Complete the 4-step wizard to join our vetted network.</p>
            </div>
            <div className="text-sm text-slate-500">Step {step} of 4</div>
          </div>
          <div className="flex items-center gap-3 pb-3">
            {[1, 2, 3, 4].map((s) => {
              const active = step === s;
              const done = step > s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => goToStep(s as Step)}
                  className={[
                    "flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs sm:text-sm transition",
                    active
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : done
                      ? "border-emerald-500/70 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      active
                        ? "bg-sky-500 text-white"
                        : done
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-700",
                    ].join(" ")}
                  >
                    {s}
                  </span>
                  <span>
                    {s === 1 && "Personal"}
                    {s === 2 && "Services & Areas"}
                    {s === 3 && "Qualifications"}
                    {s === 4 && "Docs & Review"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {step === 1 && <StepPersonal form={form} handleChange={handleChange} />}
          {step === 2 && (
            <StepServices
              form={form}
              toggleArrayValue={toggleArrayValue}
              toggleSubService={toggleSubService}
              handleChange={handleChange}
              activeSubServices={activeSubServices}
            />
          )}
          {step === 3 && <StepQualifications form={form} handleChange={handleChange} />}
          {step === 4 && (
            <StepDocumentsReview
              form={form}
              files={files}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
            />
          )}

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              onClick={() => goToStep(Math.max((step - 1) as number, 1) as Step)}
              disabled={step === 1 || submitting}
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              {step < 4 && (
                <button
                  type="button"
                  className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-50"
                  onClick={() => goToStep((step + 1) as Step)}
                  disabled={submitting}
                >
                  Continue
                </button>
              )}
              {step === 4 && (
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit application"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Step Components ----------------------------- */

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
      <span>
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function StepPersonal({
  form,
  handleChange,
}: {
  form: FormState;
  handleChange: (key: keyof FormState) => any;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Why we ask for this</p>
        <p>We use your contact details to create your pro account and send job leads to your dashboard and email.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input
            value={form.fullName}
            onChange={handleChange("fullName")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="e.g. John Murphy"
            type="text"
          />
        </Field>
        <Field label="Phone number" required>
          <input
            value={form.phone}
            onChange={handleChange("phone")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="+353 8X XXX XXXX"
            type="tel"
          />
        </Field>
        <Field label="Email" required>
          <input
            value={form.email}
            onChange={handleChange("email")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="you@example.com"
            type="email"
          />
        </Field>
        <Field label="Password" required>
          <input
            value={form.password}
            onChange={handleChange("password")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Create a strong password"
            type="password"
          />
        </Field>
        <Field label="Confirm password" required>
          <input
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            type="password"
          />
        </Field>
      </div>
    </div>
  );
}

function StepServices({
  form,
  toggleArrayValue,
  toggleSubService,
  handleChange,
  activeSubServices,
}: {
  form: FormState;
  toggleArrayValue: (key: keyof FormState, value: string) => void;
  toggleSubService: (svc: string, sub: string) => void;
  handleChange: (key: keyof FormState) => any;
  activeSubServices: { svc: string; label: string }[];
}) {
  return (
    <div className="space-y-6">
      <Section title="Main services" description="Select all services you want to offer.">
        <div className="flex flex-wrap gap-2">
          {MAIN_SERVICES.map((svc) => {
            const selected = form.mainServices.includes(svc);
            return (
              <button
                key={svc}
                type="button"
                onClick={() => toggleArrayValue("mainServices", svc)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  selected
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white",
                ].join(" ")}
              >
                {svc}
              </button>
            );
          })}
        </div>
      </Section>

      {activeSubServices.length > 0 && (
        <Section
          title="Sub-services"
          description="Highlight specific tasks you handle. This helps us match you to the right jobs."
        >
          <div className="flex flex-wrap gap-2">
            {activeSubServices.map(({ svc, label }) => {
              const selected = (form.subServices[svc] || []).includes(label);
              return (
                <button
                  key={`${svc}-${label}`}
                  type="button"
                  onClick={() => toggleSubService(svc, label)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    selected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white",
                  ].join(" ")}
                >
                  {svc}: {label}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      <Section
        title="Professional details"
        description="Share your experience and typical rates. Customers will see these details."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Years of experience" required>
            <input
              type="number"
              min={0}
              value={form.yearsOfExperience}
              onChange={handleChange("yearsOfExperience")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="e.g. 5"
            />
          </Field>
          <Field label="Typical hourly rate (€)" required>
            <input
              type="number"
              min={0}
              value={form.hourlyRate}
              onChange={handleChange("hourlyRate")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="e.g. 60"
            />
          </Field>
          <Field label="Minimum call-out fee (€)" required>
            <input
              type="number"
              min={0}
              value={form.minCalloutFee}
              onChange={handleChange("minCalloutFee")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="e.g. 80"
            />
          </Field>
        </div>
      </Section>

      <Section title="Base address" description="Used to calculate travel time and show nearby jobs.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Address line 1" required>
            <input
              type="text"
              value={form.addressLine1}
              onChange={handleChange("addressLine1")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="House / apartment, street"
            />
          </Field>
          <Field label="Address line 2 (optional)">
            <input
              type="text"
              value={form.addressLine2}
              onChange={handleChange("addressLine2")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Estate, building, etc."
            />
          </Field>
          <Field label="City / town" required>
            <input
              type="text"
              value={form.city}
              onChange={handleChange("city")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="e.g. Dublin"
            />
          </Field>
          <Field label="County" required>
            <select
              value={form.county}
              onChange={handleChange("county")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Select county</option>
              {IRISH_COUNTIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Eircode (optional)">
            <input
              type="text"
              value={form.eircode}
              onChange={handleChange("eircode")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="D02 X285"
            />
          </Field>
        </div>
      </Section>

      <Section title="Service areas" description="Where are you happy to work?">
        <div className="flex flex-wrap gap-2">
          {IRISH_COUNTIES.map((c) => {
            const selected = form.serviceAreas.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleArrayValue("serviceAreas", c)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs transition",
                  selected
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white",
                ].join(" ")}
              >
                {c}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Working days & hours" description="Let customers know your availability.">
        <div className="flex flex-wrap gap-2">
          {WORKING_DAYS.map((day) => {
            const selected = form.workingDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleArrayValue("workingDays", day)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs transition",
                  selected
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white",
                ].join(" ")}
              >
                {day}
              </button>
            );
          })}
        </div>
        <Field label="Typical working hours (optional)">
          <input
            type="text"
            value={form.workingHours}
            onChange={handleChange("workingHours")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="e.g. 8am - 6pm, Mon-Sat"
          />
        </Field>
      </Section>

      <Section
        title="Emergency jobs"
        description="Let customers know if you can take urgent call-outs (nights, weekends, leaks, outages)."
      >
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            checked={form.offersEmergency}
            onChange={handleChange("offersEmergency")}
          />
          <span className="text-sm text-slate-700">I offer emergency / out-of-hours jobs</span>
        </div>
        {form.offersEmergency && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Typical response time" required>
              <select
                value={form.emergencyResponse}
                onChange={handleChange("emergencyResponse")}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Select</option>
                <option value="under_1_hour">Under 1 hour</option>
                <option value="1_3_hours">1–3 hours</option>
                <option value="same_day">Same day</option>
                <option value="next_day">Next day</option>
                <option value="scheduled_only">Scheduled only</option>
              </select>
            </Field>
            <Field label="Emergency call-out fee (€)" required>
              <input
                type="number"
                min={0}
                value={form.emergencyCalloutFee}
                onChange={handleChange("emergencyCalloutFee")}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g. 150"
              />
            </Field>
          </div>
        )}
      </Section>
    </div>
  );
}

function StepQualifications({
  form,
  handleChange,
}: {
  form: FormState;
  handleChange: (key: keyof FormState) => any;
}) {
  return (
    <div className="space-y-4">
      <Section
        title="Qualification or trade certification"
        description="Share your trade background, tickets, or memberships. This helps us verify your profile faster."
      >
        <Field label="Qualification summary" required>
          <textarea
            value={form.qualificationSummary}
            onChange={handleChange("qualificationSummary")}
            className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="E.g. Registered electrician (RECI), 8+ years in domestic and light commercial work…"
          />
        </Field>
        <Field label="Trade certifications (optional)">
          <textarea
            value={form.tradeCertifications}
            onChange={handleChange("tradeCertifications")}
            className="min-h-[90px] rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Safe Electric, RGII, F-Gas, Safe Pass, Manual Handling…"
          />
        </Field>
      </Section>
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        Tip: For regulated trades (electrician, gas/boiler, CCTV/PSA), add your registration number and upload proof in the next step.
      </div>
    </div>
  );
}

function StepDocumentsReview({
  form,
  files,
  handleChange,
  handleFileChange,
}: {
  form: FormState;
  files: FileState;
  handleChange: (key: keyof FormState) => any;
  handleFileChange: (key: keyof FileState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const summaryItems = [
    { label: "Name", value: form.fullName },
    { label: "Email", value: form.email },
    { label: "Phone", value: form.phone },
    { label: "Main services", value: form.mainServices.join(", ") || "Not selected" },
    {
      label: "Sub-services",
      value:
        Object.entries(form.subServices)
          .map(([svc, subs]) => `${svc}: ${subs.join(", ")}`)
          .join(" | ") || "None",
    },
    { label: "Service areas", value: form.serviceAreas.join(", ") || "Not selected" },
    { label: "Working days", value: form.workingDays.join(", ") || "Not provided" },
    { label: "Working hours", value: form.workingHours || "Not provided" },
    {
      label: "Emergency",
      value: form.offersEmergency
        ? `Yes – ${(form.emergencyResponse || "").replace(/_/g, " ")}${form.emergencyCalloutFee ? ` (€${form.emergencyCalloutFee})` : ""}`
        : "No",
    },
  ];

  return (
    <div className="space-y-6">
      <Section title="Verification documents" description="Helps keep the platform safe for customers and pros.">
        <Field label="Photo ID (passport / driving licence)">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange("idDocument")}
            className="w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
          {files.idDocument && <p className="text-xs text-emerald-700 mt-1">Selected: {files.idDocument.name}</p>}
        </Field>
        <Field label="Proof of address (utility bill, bank statement)">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange("proofOfAddress")}
            className="w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
          {files.proofOfAddress && <p className="text-xs text-emerald-700 mt-1">Selected: {files.proofOfAddress.name}</p>}
        </Field>
        <Field label="Public liability / trade insurance (if available)">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange("insuranceDocument")}
            className="w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
          <label className="mt-2 flex items-start gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              checked={form.hasInsurance}
              onChange={handleChange("hasInsurance")}
            />
            <span>I currently hold active trade insurance</span>
          </label>
          <textarea
            value={form.insuranceDetails}
            onChange={handleChange("insuranceDetails")}
            className="mt-2 min-h-[70px] rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Insurer, policy number, or any extra notes…"
          />
        </Field>
        <Field label="Other supporting document (optional)">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange("otherDocument")}
            className="w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
          {files.otherDocument && <p className="text-xs text-emerald-700 mt-1">Selected: {files.otherDocument.name}</p>}
        </Field>
      </Section>

      <Section title="Review your application" description="Quick check before you submit.">
        <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-700">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex justify-between gap-3">
              <span className="font-medium">{item.label}</span>
              <span className="text-right">{item.value || <span className="text-slate-400">—</span>}</span>
            </div>
          ))}
        </div>
        <label className="flex items-start gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            checked={form.termsAccepted || form.acceptedTerms}
            onChange={(e) => {
              handleChange("termsAccepted")(e as any);
              handleChange("acceptedTerms")(e as any);
            }}
          />
          <span>
            I confirm the information is accurate and I agree to FixEasy&apos;s{" "}
            <span className="cursor-pointer text-sky-600 underline">Terms of Service</span> and{" "}
            <span className="cursor-pointer text-sky-600 underline">Privacy Policy</span>.
          </span>
        </label>
      </Section>
    </div>
  );
}

/* ----------------------------- Helpers ----------------------------- */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {description && <p className="text-xs text-slate-600">{description}</p>}
      </div>
      {children}
    </section>
  );
}
