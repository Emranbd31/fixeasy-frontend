"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase, createSupabaseBrowserClient } from "@/lib/supabaseClient";

type Step = 1 | 2 | 3;

const categories = [
  "Cleaning","Handyman","Plumbing","Electrical","Painting","Gardening","Moving","Carpentry","Appliance Repair","HVAC","Pest Control","Locksmith","Welding","CCTV Installation","Solar Panels","Builder","Roofing","Flooring","Tiling","Plastering","Window Cleaning","Pressure Washing","Chimney Sweep","Gutter Cleaning","Air Conditioning","Roof Cleaning","Carpet Cleaning"
];

export default function ProfessionalRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sb = createSupabaseBrowserClient();

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  // Step 2
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [serviceArea, setServiceArea] = useState("");

  // Step 3 (uploads)
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [qualificationFile, setQualificationFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);

  const validateStep = (s: Step) => {
    if (s === 1) {
      if (!name || !email || !phone || !password || !profilePhoto) {
        setError("Please complete all fields and add a profile photo.");
        return false;
      }
    }
    if (s === 2) {
      if (!category || !experience || !rate || !serviceArea) {
        setError("Please complete your service details.");
        return false;
      }
    }
    if (s === 3) {
      if (!idDocument) {
        setError("Photo ID is required.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const onNext = () => {
    if (validateStep(step)) setStep((prev) => (prev === 3 ? 3 : ((prev + 1) as Step)));
  };
  const onBack = () => setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as Step)));

  async function handleSubmit() {
    if (!validateStep(3)) return;
    setLoading(true);
    setError(null);
    try {
      // 1) Create auth user with role metadata
      const { data: signUpData, error: signUpError } = await sb.auth.signUp({
        email,
        password,
        options: { data: { role: "professional", name, phone } },
      });
      if (signUpError) throw signUpError;
      const user = signUpData.user;
      if (!user) throw new Error("Sign up failed. No user returned.");

      const userId = user.id;
      const bucket = "pro-uploads"; // This bucket must exist in Supabase and be private.
      const timestamp = Date.now();

      async function uploadOne(file: File | null, key: string): Promise<string | null> {
        if (!file) return null;
        const path = `pros/${userId}/${key}-${timestamp}-${file.name}`;
        const { error: upErr } = await sb.storage.from(bucket).upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        });
        if (upErr) throw upErr;
        return path; // keep private path, do not make public URL
      }

      // 2) Upload required/optional files
      const profile_photo = await uploadOne(profilePhoto, "profile-photo");
      const id_document_path = await uploadOne(idDocument, "id-document");
      const address_proof_path = await uploadOne(addressProof, "address-proof");
      const qualification_file_path = await uploadOne(qualificationFile, "qualification");
      const insurance_file_path = await uploadOne(insuranceFile, "insurance");

      const portfolio_paths: string[] = [];
      for (const [i, f] of portfolioFiles.entries()) {
        const p = await uploadOne(f, `portfolio-${i + 1}`);
        if (p) portfolio_paths.push(p);
      }

      // 3) Call server API to write DB row
      const res = await fetch("/api/register/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name,
          email,
          phone,
          category,
          experience: Number(experience),
          rate: Number(rate),
          service_area: serviceArea,
          id_document: id_document_path,
          address_proof: address_proof_path,
          qualification_file: qualification_file_path,
          insurance_file: insurance_file_path,
          portfolio_files: portfolio_paths,
          profile_photo,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Registration failed (${res.status})`);
      }

      // 4) Done -> route to pro dashboard
      router.push("/pro-dashboard?status=pending");
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Become a FixEasy Professional</h1>
          <p className="text-gray-600">Complete your profile to get verified and start receiving jobs.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1,2,3].map((n) => (
            <div key={n} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= n ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}>{n}</div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700">{error}</div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Step 1 – Personal Info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input className="input" placeholder="Full legal name" value={name} onChange={(e)=>setName(e.target.value)} />
              <input className="input" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <input className="input" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Profile photo (required)</label>
                <input type="file" accept="image/*" onChange={(e)=>setProfilePhoto(e.target.files?.[0]??null)} />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Link href="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Login</Link>
              <button onClick={onNext} className="btn-primary">Next →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Step 2 – Service Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Profession (category)</label>
                <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}>
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Years of experience</label>
                <input className="input" type="number" min={0} value={experience} onChange={(e)=>setExperience(Number(e.target.value))} />
              </div>
              <div>
                <label className="label">Hourly / fixed rate (€)</label>
                <input className="input" type="number" min={0} value={rate} onChange={(e)=>setRate(Number(e.target.value))} />
              </div>
              <div>
                <label className="label">Service area (Eircode or County)</label>
                <input className="input" value={serviceArea} onChange={(e)=>setServiceArea(e.target.value)} placeholder="e.g., D04 / Dublin" />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={onBack} className="btn-secondary">← Back</button>
              <button onClick={onNext} className="btn-primary">Next →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Step 3 – Required Documents</h2>
            <div className="space-y-4">
              <div>
                <label className="label">🪪 Photo ID (required)</label>
                <input type="file" onChange={(e)=>setIdDocument(e.target.files?.[0]??null)} />
                <p className="hint">Passport / Irish Driving Licence / GNIB / National ID</p>
              </div>
              <div>
                <label className="label">🏠 Proof of Address (optional)</label>
                <input type="file" onChange={(e)=>setAddressProof(e.target.files?.[0]??null)} />
              </div>
              <div>
                <label className="label">🧰 Qualification / Licence (optional)</label>
                <input type="file" onChange={(e)=>setQualificationFile(e.target.files?.[0]??null)} />
              </div>
              <div>
                <label className="label">🧾 Insurance certificate (optional)</label>
                <input type="file" onChange={(e)=>setInsuranceFile(e.target.files?.[0]??null)} />
              </div>
              <div>
                <label className="label">📷 Portfolio (optional, multiple)</label>
                <input type="file" multiple onChange={(e)=>setPortfolioFiles(Array.from(e.target.files ?? []))} />
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button onClick={onBack} className="btn-secondary">← Back</button>
              <button disabled={loading} onClick={handleSubmit} className="btn-primary">
                {loading ? "Submitting…" : "Submit & Create Account"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">All documents are stored securely. Only you and FixEasy admins can access them.</p>
          </div>
        )}

        <style jsx global>{`
          .input { @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none transition; }
          .label { @apply block text-sm font-semibold mb-1; }
          .hint { @apply text-xs text-gray-500 mt-1; }
          .btn-primary { @apply px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60; }
          .btn-secondary { @apply px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-900 font-semibold hover:border-blue-400 transition; }
        `}</style>
      </div>
    </main>
  );
}
