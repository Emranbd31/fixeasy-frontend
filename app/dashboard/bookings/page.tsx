"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type BookingRow = {
  id: string;
  service: string;
  status: string;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  professional_id?: string | null;
  price_estimate?: number | null;
  cancellation_fee?: number | null;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending acceptance",
  awaiting_confirmation: "Pending acceptance",
  confirmed: "Accepted",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const CUTOFF_HOURS = 24;
const MIN_LATE_FEE = 20;
const LATE_FEE_RATE = 0.1;

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        setError("Please log in to view your bookings.");
        setLoading(false);
        return;
      }
      const { data, error: bErr } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_start", { ascending: true });
      if (bErr) {
        setError(bErr.message);
      } else {
        setBookings((data || []) as BookingRow[]);
      }
      setLoading(false);
    })();
  }, []);

  const upcoming = useMemo(
    () => bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled"),
    [bookings]
  );
  const past = useMemo(
    () => bookings.filter((b) => b.status === "completed" || b.status === "cancelled"),
    [bookings]
  );

  const canChange = (booking: BookingRow) => {
    if (!booking.scheduled_start) return false;
    const start = new Date(booking.scheduled_start);
    const diff = (start.getTime() - Date.now()) / (1000 * 60 * 60);
    return diff >= CUTOFF_HOURS;
  };

  const cancellationFeeEstimate = (booking: BookingRow) => {
    const estimate = Number(booking.price_estimate ?? 0) || 0;
    return Math.max(MIN_LATE_FEE, Math.round(estimate * LATE_FEE_RATE * 100) / 100);
  };

  const handleCancel = async (booking: BookingRow) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to cancel booking");
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled", cancellation_fee: data.cancellation_fee } : b)));
    } catch (e: any) {
      setError(e?.message || "Unable to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async (booking: BookingRow) => {
    if (!newDate || !reschedulingId) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStart: newDate.toISOString() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to reschedule");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: data.status || "pending", scheduled_start: newDate.toISOString() } : b
        )
      );
      setReschedulingId(null);
      setNewDate(null);
    } catch (e: any) {
      setError(e?.message || "Unable to reschedule");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading your bookings…</div>;
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">My Bookings</h1>
        <p className="text-sm text-slate-600 mb-6">Reschedule or cancel up to 24 hours before your appointment. Late cancellations incur a 10% fee (min €20).</p>
        {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.length === 0 && <p className="text-sm text-slate-500">No upcoming bookings.</p>}
            {upcoming.map((b) => {
              const changeAllowed = canChange(b);
              return (
                <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{b.service || "Service"}</p>
                      <p className="text-xs text-slate-600">Status: {STATUS_LABELS[b.status] || b.status}</p>
                      <p className="text-xs text-slate-600">
                        When: {b.scheduled_start ? new Date(b.scheduled_start).toLocaleString() : "TBD"}
                      </p>
                      {b.price_estimate ? <p className="text-xs text-slate-600">Estimate: €{Number(b.price_estimate).toFixed(2)}</p> : null}
                      {!changeAllowed && (
                        <p className="text-xs text-amber-600 mt-1">
                          Within 24h window. Cancelling may incur ~€{cancellationFeeEstimate(b).toFixed(2)} fee (10%, min €20).
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {reschedulingId === b.id ? (
                        <div className="flex flex-col gap-2">
                          <DatePicker
                            selected={newDate}
                            onChange={(d: Date) => setNewDate(d)}
                            showTimeSelect
                            timeIntervals={30}
                            minDate={new Date()}
                            dateFormat="MM/dd/yyyy h:mm aa"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring"
                            placeholderText="Select new date & time"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={actionLoading || !newDate}
                              onClick={() => handleReschedule(b)}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => { setReschedulingId(null); setNewDate(null); }}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={!changeAllowed || actionLoading}
                            onClick={() => setReschedulingId(b.id)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-700 disabled:opacity-50"
                          >
                            Reschedule
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleCancel(b)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Past</h2>
          <div className="space-y-3">
            {past.length === 0 && <p className="text-sm text-slate-500">No past bookings.</p>}
            {past.map((b) => (
              <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{b.service || "Service"}</p>
                <p className="text-xs text-slate-600">Status: {STATUS_LABELS[b.status] || b.status}</p>
                <p className="text-xs text-slate-600">
                  When: {b.scheduled_start ? new Date(b.scheduled_start).toLocaleString() : "TBD"}
                </p>
                {b.cancellation_fee ? (
                  <p className="text-xs text-rose-600">Cancellation fee: €{Number(b.cancellation_fee).toFixed(2)}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
