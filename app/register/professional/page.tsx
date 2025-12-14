"use client";

import { useEffect, useMemo, useRef, useState, FormEvent, ChangeEvent } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { MAIN_SERVICES, SUB_SERVICES } from "@/lib/service-options";

type ServiceOption = { label: string; subServices: string[] };
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const SERVICE_OPTIONS: ServiceOption[] = MAIN_SERVICES.map((label) => ({
  label,
  subServices: SUB_SERVICES[label] || [],
}));

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const dynamic = "force-dynamic";

const toBase64Files = async (files: File[]) => {
  const limited = files.slice(0, MAX_FILES);
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

export default function ProfessionalRegisterPage() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState<Step>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);

  const [eircode, setEircode] = useState("");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState("");
  const countyOptions = useMemo(
    () => ["Dublin", "Cork", "Galway", "Limerick", "Waterford", "Kilkenny", "Wexford", "Kildare", "Meath", "Wicklow", "Westmeath"],
    []
  );

  const [experience, setExperience] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [notes, setNotes] = useState("");

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [idDocs, setIdDocs] = useState<File[]>([]);
  const [insuranceDocs, setInsuranceDocs] = useState<File[]>([]);
  const [certDocs, setCertDocs] = useState<File[]>([]);

  const [emergencyJobs, setEmergencyJobs] = useState(true);
  const [scheduledJobs, setScheduledJobs] = useState(true);
  const [workingHours, setWorkingHours] = useState("Mon-Fri, 8am-6pm");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const modalScrollRef = useRef<HTMLDivElement | null>(null);

  const selectedServiceOptions = useMemo(
    () => SERVICE_OPTIONS.filter((s) => selectedServices.includes(s.label)),
    [selectedServices]
  );
  const allSubServices = useMemo(
    () => selectedServiceOptions.flatMap((s) => s.subServices),
    [selectedServiceOptions]
  );

  useEffect(() => {
    if (open && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => modalScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 0);
    }
  }, [open, step]);

  const canAdvance = (currentStep: Step) => {
    if (currentStep === 1) {
      return (
        fullName.trim().length > 1 &&
        /\S+@\S+\.\S+/.test(email.trim()) &&
        phone.replace(/\D/g, "").length >= 8 &&
        password.trim().length >= 8 &&
        verified
      );
    }
    if (currentStep === 2) return selectedServices.length > 0;
    if (currentStep === 3) return address.trim().length > 3 && eircode.trim().length > 2;
    return true;
  };

  const handleFileSelect = (setter: (files: File[]) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    const limited = list.filter((f) => f.size <= MAX_FILE_SIZE).slice(0, MAX_FILES);
    setter(limited);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < 7) {
      if (!canAdvance(step)) return;
      setStep((prev) => (prev + 1) as Step);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const payload = {
        fullName,
        email,
        phone,
        password,
        services: selectedServices,
        subServices: selectedSubServices,
        address,
        eircode,
        radius,
        experience,
        businessName,
        bio,
        notes,
        emergencyJobs,
        scheduledJobs,
        workingHours,
        profilePhoto: profilePhoto ? (await toBase64Files([profilePhoto]))[0] : null,
        idDocs: await toBase64Files(idDocs),
        insuranceDocs: await toBase64Files(insuranceDocs),
        certDocs: await toBase64Files(certDocs),
      };
      const res = await fetch("/api/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to submit your application");
      setSubmitSuccess("Thanks! Application submitted. Our team reviews applications within a few days.");
      setOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitle =
    ["Basic Details", "Services", "Service Area", "Profile", "Documents", "Preferences", "Review & Submit"][step - 1] ??
    "Review & Submit";

  const progress = Math.round(((step - 1) / 7) * 100);

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="space-y-3">
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
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Min 8 characters"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setVerified(true)}
              className="rounded-lg border border-blue-500 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
            >
              Send verification code
            </button>
            {verified && <span className="text-xs text-emerald-700 font-semibold">Verified</span>}
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700">Services and sub-services</label>
          <Autocomplete
            multiple
            options={SERVICE_OPTIONS}
            value={selectedServiceOptions}
            onChange={(_, vals) => {
              setSelectedServices(vals.map((v) => v.label));
              setSelectedSubServices([]);
            }}
            getOptionLabel={(option) => option?.label ?? ""}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderInput={(params) => <TextField {...params} label="Select services" size="small" />}
          />
          {selectedServiceOptions.length > 0 && allSubServices.length > 0 && (
            <Autocomplete
              multiple
              options={allSubServices}
              value={selectedSubServices}
              onChange={(_, vals) => setSelectedSubServices(vals)}
              renderInput={(params) => <TextField {...params} label="Select sub-services (optional)" size="small" />}
            />
          )}
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Eircode</label>
            <input
              value={eircode}
              onChange={(e) => setEircode(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="e.g. D02 X285"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Street, city"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Radius / service regions</label>
            <input
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="e.g. 20km or Dublin 1,2,4"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {countyOptions.map((county) => (
                <button
                  type="button"
                  key={county}
                  onClick={() => setRadius((prev) => (prev ? `${prev}, ${county}` : county))}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:border-blue-400 hover:text-blue-700"
                >
                  {county}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Years of experience</label>
              <input
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="e.g. 5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Business name (optional)</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Company or trading name"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Short bio / intro</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Tell customers about your expertise."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Profile photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProfilePhoto(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
        </div>
      );
    }

    if (step === 5) {
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">ID (passport/driver license)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleFileSelect(setIdDocs)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Insurance / liability</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleFileSelect(setInsuranceDocs)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Certificates</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleFileSelect(setCertDocs)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <p className="text-xs text-slate-600">Optional now, but helps us verify your profile and show trust badges.</p>
        </div>
      );
    }

    if (step === 6) {
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEmergencyJobs(!emergencyJobs)}
              className={[
                "rounded-lg border px-3 py-2 text-xs font-semibold transition",
                emergencyJobs ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              Emergency jobs: {emergencyJobs ? "Yes" : "No"}
            </button>
            <button
              type="button"
              onClick={() => setScheduledJobs(!scheduledJobs)}
              className={[
                "rounded-lg border px-3 py-2 text-xs font-semibold transition",
                scheduledJobs ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              Scheduled jobs: {scheduledJobs ? "Yes" : "No"}
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Working hours</label>
            <input
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="e.g. Mon-Fri, 8am-6pm"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-700">Review and submit. Our team reviews applications within a few days.</p>
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
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Get local jobs. Get paid weekly.</h1>
        <ul className="mt-4 list-disc list-inside space-y-1 text-left text-sm text-slate-700">
          <li>Work in your area</li>
          <li>Flexible schedule</li>
          <li>Secure payments via FixEasy</li>
          <li>No marketing or advertising needed</li>
        </ul>
        <p className="mt-4 text-sm text-slate-600">
          Registration takes about 5–10 minutes. Our team reviews applications within a few days.
        </p>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setStep(1);
            setTimeout(() => modalScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 0);
          }}
          className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
        >
          Start registration
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 px-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Get local jobs. Get paid weekly.</h2>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                <li>Work in your area</li>
                <li>Flexible schedule</li>
                <li>Secure payments via FixEasy</li>
                <li>No marketing or advertising needed</li>
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                Registration takes about 5–10 minutes. Our team reviews applications within a few days.
              </p>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div ref={modalScrollRef} className="space-y-4">
                <p className="text-sm font-semibold text-slate-800">
                  Step {step} of 7 – {stepTitle}
                </p>
                {renderStep()}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (step > 1) setStep((prev) => (prev - 1) as Step);
                      else setOpen(false);
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {step > 1 ? "Back" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={!canAdvance(step) || isSubmitting}
                    className={[
                      "rounded-lg px-4 py-2 text-sm font-semibold",
                      !canAdvance(step) || isSubmitting
                        ? "cursor-not-allowed bg-slate-200 text-slate-500"
                        : "bg-blue-600 text-white hover:bg-blue-700",
                    ].join(" ")}
                  >
                    {step < 7 ? "Next" : isSubmitting ? "Submitting..." : "Finish"}
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
