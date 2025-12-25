"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Booking = {
  id: string;
  service?: string;
  subservice?: string;
  summary?: string;
  description?: string;
  address?: string;
  eircode?: string;
  date?: string;
  time?: string;
  status?: string;
  photo_urls?: string[];
  budget_range?: string;
  price_estimate_min?: number;
  price_estimate_max?: number;
  professional_id?: string | null;
  accepted_by?: string | null;
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
      {children}
    </span>
  );
}

function JobCard({
  job,
  onAccept,
  onDecline,
  mine,
}: {
  job: Booking;
  onAccept?: () => void;
  onDecline?: () => void;
  mine?: boolean;
}) {
  const isTaken = job.status && job.status !== "pending" && job.status !== "awaiting_confirmation";
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{job.service || "Service"}</p>
          {job.subservice && <p className="text-xs text-slate-600">Sub-service: {job.subservice}</p>}
        </div>
        <Badge>{job.status || "pending"}</Badge>
      </div>
      {job.summary && <p className="mt-2 text-sm text-slate-700">{job.summary}</p>}
      {job.description && <p className="mt-1 text-xs text-slate-600">{job.description}</p>}
      <div className="mt-2 space-y-1 text-xs text-slate-700">
        {job.address && <p>📍 {job.address}</p>}
        {job.eircode && <p>🏷️ {job.eircode}</p>}
        {(job.date || job.time) && <p>🕑 {job.date || ""} {job.time || ""}</p>}
        {job.budget_range && <p>💶 Budget: {job.budget_range}</p>}
        {(job.price_estimate_min || job.price_estimate_max) && (
          <p>
            💡 Estimate: €
            {job.price_estimate_min ?? "—"}–€
            {job.price_estimate_max ?? "—"}
          </p>
        )}
      </div>
      {job.photo_urls && job.photo_urls.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.photo_urls.slice(0, 3).map((url) => (
            <div key={url} className="h-16 w-16 overflow-hidden rounded border border-slate-200 bg-slate-100">
              <img src={url} alt="job photo" className="h-full w-full object-cover" />
            </div>
          ))}
          {job.photo_urls.length > 3 && <span className="text-xs text-slate-500">+{job.photo_urls.length - 3} more</span>}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {!isTaken && onAccept && (
          <button
            onClick={onAccept}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Accept
          </button>
        )}
        {!isTaken && onDecline && (
          <button
            onClick={onDecline}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Decline
          </button>
        )}
        {isTaken && !mine && <Badge>Taken / Assigned</Badge>}
        {mine && isTaken && <Badge>Assigned to you</Badge>}
      </div>
    </div>
  );
}

function ProDashboardPage() {
  const sb = supabase;
  const [status, setStatus] = useState<"loading" | "ok" | "unauth">("loading");
  const [verified, setVerified] = useState<boolean | null>(null);
  const [name, setName] = useState<string>("");
  const [proId, setProId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [openJobs, setOpenJobs] = useState<Booking[]>([]);
  const [myJobs, setMyJobs] = useState<Booking[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const unread = useMemo(() => openJobs.length, [openJobs]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!user) {
        setStatus("unauth");
        return;
      }
      setCurrentUserId(user.id);

      const { data, error } = await sb
        .from("professionals")
        .select("id, name, verified")
        .eq("user_id", user.id)
        .single();
      const row: any = data as any;
      if (!error && row) {
        setName(row.name as string);
        setVerified(!!row.verified);
        setProId(row.id as string);
        setStatus("ok");
      } else {
        setStatus("ok");
      }
    })();
  }, []);

  useEffect(() => {
    if (!status || status !== "ok") return;
    if (!proId && !currentUserId) return;
    (async () => {
      setLoadingJobs(true);
      try {
        const unassigned = await fetch(`/api/bookings?unassigned=true`).then((r) => r.json());
        const mineQuery = currentUserId
          ? `/api/bookings?acceptedBy=${encodeURIComponent(currentUserId)}`
          : `/api/bookings?professionalId=${encodeURIComponent(proId as string)}`;
        const mine = await fetch(mineQuery).then((r) => r.json());
        setOpenJobs(unassigned.bookings || []);
        setMyJobs(mine.bookings || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingJobs(false);
      }
    })();
  }, [proId, currentUserId, status]);

  const handleAccept = async (jobId: string) => {
    if (!currentUserId) return;
    await fetch("/api/jobs/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, proId: currentUserId }),
    });
    // refresh lists
    const unassigned = await fetch(`/api/bookings?unassigned=true`).then((r) => r.json());
    const mineQuery = currentUserId
      ? `/api/bookings?acceptedBy=${encodeURIComponent(currentUserId)}`
      : `/api/bookings?professionalId=${encodeURIComponent(proId as string)}`;
    const mine = await fetch(mineQuery).then((r) => r.json());
    setOpenJobs(unassigned.bookings || []);
    setMyJobs(mine.bookings || []);
  };

  const handleDecline = async (jobId: string) => {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: jobId, action: "decline" }),
    });
    const unassigned = await fetch(`/api/bookings?unassigned=true`).then((r) => r.json());
    setOpenJobs(unassigned.bookings || []);
  };

  if (status === "loading") return <div className="p-10">Loading…</div>;
  if (status === "unauth")
    return (
      <main className="p-10">
        <p>
          Please{" "}
          <Link className="text-blue-600" href="/login">
            login
          </Link>{" "}
          to access your dashboard.
        </p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Professional Dashboard</h1>
          {unread > 0 && <Badge>{unread} new</Badge>}
        </div>
        {verified === false && (
          <div className="mb-6 p-4 rounded-xl border-2 border-yellow-300 bg-yellow-50 text-yellow-800">
            Waiting for verification – your documents are under review. ✅ We&apos;ll email you when you&apos;re approved.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">New quotes & bookings</h2>
              {loadingJobs && <span className="text-xs text-slate-500">Refreshing…</span>}
            </div>
            {openJobs.length === 0 ? (
              <p className="text-gray-500 text-sm">No new jobs right now.</p>
            ) : (
              <div className="space-y-3">
                {openJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onAccept={() => handleAccept(job.id)}
                    onDecline={() => handleDecline(job.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow">
            <h2 className="font-bold text-lg mb-4">Your accepted jobs</h2>
            {myJobs.length === 0 ? (
              <p className="text-gray-500 text-sm">No assigned jobs yet.</p>
            ) : (
              <div className="space-y-3">
                {myJobs.map((job) => (
                  <JobCard key={job.id} job={job} mine />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow">
            <h2 className="font-bold text-lg mb-3">Profile Status</h2>
            <div className="mb-2">
              <span className="font-semibold">Name:</span> {name || "—"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Verification:</span> {verified ? "Verified" : "Pending"}
            </div>
            <Link href="/register/professional" className="text-blue-600 text-xs">
              Update Documents
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow">
            <h2 className="font-bold text-lg mb-3">Support</h2>
            <p className="text-sm text-slate-700">Need help with a job or payout?</p>
            <Link href="/support" className="mt-2 inline-block text-blue-600 text-sm">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProDashboardPage;
