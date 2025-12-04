'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Booking, BookingStatus } from '@/types/models';
import ChatLauncher from '@/components/chat/ChatLauncher';
import { getOrCreateBookingConversation, getOrCreateSupportConversation } from '@/lib/chat/router';

type Tab = 'new' | 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

const TAB_STATUS: Record<Tab, BookingStatus[]> = {
  new: ['pending', 'awaiting_confirmation'],
  upcoming: ['confirmed'],
  in_progress: ['in_progress'],
  completed: ['completed'],
  cancelled: ['cancelled'],
};

const formatEuro = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  return `€${Number(value).toFixed(2)}`;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const normalizeBooking = (raw: any): Booking => {
  const scheduled =
    raw?.scheduledAt ||
    raw?.scheduled_at ||
    raw?.appointmentStart ||
    raw?.appointment_start ||
    raw?.date ||
    null;

  const normalized: any = {
    id: raw?.id,
    customerId: raw?.customerId ?? raw?.customer_id ?? '',
    professionalId: raw?.professionalId ?? raw?.professional_id ?? undefined,
    serviceCategory: raw?.serviceCategory ?? raw?.service_category ?? raw?.service ?? 'Service',
    problemType: raw?.problemType ?? raw?.problem_type ?? raw?.summary ?? raw?.subService ?? raw?.sub_service ?? '',
    county: raw?.county ?? raw?.location ?? '',
    areas: raw?.areas ?? raw?.serviceAreas ?? raw?.service_areas ?? [],
    travelRadiusKm: raw?.travelRadiusKm ?? raw?.travel_radius_km ?? null,
    eircode: raw?.eircode ?? raw?.eir_code ?? '',
    latitude: raw?.latitude ?? null,
    longitude: raw?.longitude ?? null,
    scheduleType: raw?.scheduleType ?? raw?.schedule_type ?? (scheduled ? 'scheduled' : 'now'),
    scheduledAt: scheduled ?? undefined,
    description: raw?.description ?? raw?.details ?? '',
    imageUrls: raw?.imageUrls ?? raw?.image_urls ?? [],
    status: raw?.status ?? 'pending',
    priceEstimate: raw?.priceEstimate ?? raw?.price_estimate ?? null,
    estimatedHours: raw?.estimatedHours ?? raw?.estimated_hours ?? null,
    rating: raw?.rating ?? null,
    review: raw?.review ?? null,
    completedAt: raw?.completedAt ?? raw?.completed_at ?? null,
    receipt: raw?.receipt ?? null,
    paymentIntentId: raw?.paymentIntentId ?? raw?.payment_intent_id ?? null,
    createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? new Date().toISOString(),
  };
  normalized.address = raw?.address ?? raw?.location ?? '';
  normalized.summary = raw?.summary ?? '';
  normalized.service = raw?.service ?? '';
  normalized.subService = raw?.subService ?? raw?.sub_service ?? '';
  return normalized as Booking;
};

const displayService = (b: Booking) => b.serviceCategory || 'Service';
const displayProblem = (b: Booking) => b.problemType || 'General';
const displayLocation = (b: Booking) => {
  const county = b.county;
  const areas = Array.isArray((b as any).areas) ? (b as any).areas.join(', ') : '';
  const address = (b as any).address;
  const eircode = (b as any).eircode;
  return address || [county, areas].filter(Boolean).join(' • ') || eircode || 'Location TBD';
};

function calculateCompletion(p: any): number {
  let score = 0;
  if (p) score += 20; // signup
  const hasBasics = p?.county && Array.isArray(p?.areas) && p.areas.length && p?.daysAvailable?.length;
  if (hasBasics) score += 20;
  const hasService = p?.yearsExperience && p?.hourlyRate && p?.skills?.length;
  if (hasService) score += 20;
  const hasDocs = p?.photoIdUrl;
  if (hasDocs) score += 30;
  const hasPortfolio = p?.portfolioUrls?.length;
  if (hasPortfolio) score += 10;
  return Math.min(100, score);
}

export default function ProDashboardPage() {
  const sb = supabase;
  const [status, setStatus] = useState<'loading' | 'ok' | 'unauth'>('loading');
  const [name, setName] = useState<string>('');
  const [completion, setCompletion] = useState<number>(0);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('new');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [incomingBookings, setIncomingBookings] = useState<Booking[]>([]);
  const [incomingLoading, setIncomingLoading] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState<string>("");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { setStatus('unauth'); return; }
      setCurrentUserId(user.id);

      const { data, error: fetchErr } = await sb
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      const profileRow = data as any;
      if (!fetchErr && profileRow) {
        setName(profileRow.name as string);
        setProfile(profileRow);
        setCompletion(calculateCompletion(profileRow));
      }
      setStatus('ok');
    })();
  }, [sb]);

  useEffect(() => {
    if (!profile?.id) return;
    (async () => {
      try {
        const res = await fetch(`/api/bookings?professionalId=${profile.id}`);
        const j = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(j?.error || 'Failed to load bookings');
        setBookings(Array.isArray(j.bookings) ? j.bookings.map(normalizeBooking) : []);
      } catch (e: any) {
        setError(e?.message || 'Unable to load jobs');
      }
    })();
  }, [profile?.id]);

  useEffect(() => {
    (async () => {
      try {
        setIncomingLoading(true);
        const res = await fetch('/api/bookings?unassigned=true');
        const j = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(j?.error || 'Failed to load incoming jobs');
        setIncomingBookings(Array.isArray(j.bookings) ? j.bookings.map(normalizeBooking) : []);
      } catch (e: any) {
        setError(e?.message || 'Unable to load incoming jobs');
      } finally {
        setIncomingLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      const { data, error: convErr } = await supabase
        .from("conversation_participants")
        .select("conversation_id, conversation:conversations(*)")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });
      if (!convErr && Array.isArray(data)) {
        const mapped = data
          .map((row: any) => ({
            id: row.conversation_id,
            type: row.conversation?.type,
            booking_id: row.conversation?.booking_id,
            created_at: row.conversation?.created_at,
          }))
          .filter((c: any) => c.id);
        setConversations(mapped);
      }
    })();
  }, [currentUserId]);

  useEffect(() => {
    if (selected) {
      const est = (selected.priceEstimate ?? (selected as any).price_estimate ?? 0) as number;
      setQuoteAmount(est ? String(est) : "");
      setQuoteError(null);
    }
  }, [selected]);

  const filtered = useMemo(() => {
    const statuses = TAB_STATUS[activeTab];
    const now = new Date();
    return bookings.filter((b) => {
      if (!statuses.includes(b.status)) return false;
      if (activeTab === 'upcoming') {
        if (!b.scheduledAt) return true;
        return new Date(b.scheduledAt) >= now;
      }
      return true;
    });
  }, [bookings, activeTab]);

  const groupedSchedule = useMemo(() => {
    const today = new Date();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const addDays = (d: Date, days: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
    const isSameDay = (d1: Date, d2: Date) => startOfDay(d1).getTime() === startOfDay(d2).getTime();

    const buckets: Record<string, Booking[]> = {
      Today: [],
      Tomorrow: [],
      'This Week': [],
      'Next Week': [],
      Later: [],
      Unscheduled: [],
    };

    bookings.forEach((b) => {
      if (!b.scheduledAt) {
        buckets['Unscheduled'].push(b);
        return;
      }
      const date = new Date(b.scheduledAt);
      if (isSameDay(date, today)) {
        buckets['Today'].push(b);
      } else if (isSameDay(date, addDays(today, 1))) {
        buckets['Tomorrow'].push(b);
      } else {
        const dayOfWeek = today.getDay();
        const startOfThisWeek = addDays(today, -dayOfWeek);
        const startOfNextWeek = addDays(startOfThisWeek, 7);
        const startOfFollowingWeek = addDays(startOfThisWeek, 14);
        if (date >= startOfThisWeek && date < startOfNextWeek) {
          buckets['This Week'].push(b);
        } else if (date >= startOfNextWeek && date < startOfFollowingWeek) {
          buckets['Next Week'].push(b);
        } else {
          buckets['Later'].push(b);
        }
      }
    });

    return buckets;
  }, [bookings]);

  const earnings = useMemo(() => {
    const weekSum = bookings
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.priceEstimate ?? (b as any).price_estimate ?? 0), 0);
    const monthSum = weekSum; // stub
    return { weekSum, monthSum };
  }, [bookings]);

  const toggleAvailability = async () => {
    if (!profile?.id || availabilitySaving) return;
    try {
      setAvailabilitySaving(true);
      const next = !profile.isAvailable;
      const res = await fetch('/api/pro/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.user_id, isAvailable: next }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || 'Failed to update availability');
      setProfile((prev: any) => ({ ...prev, isAvailable: next }));
    } catch (e: any) {
      setError(e?.message || 'Unable to update availability');
    } finally {
      setAvailabilitySaving(false);
    }
  };

  const handleAction = async (
    bookingId: string,
    action: 'accept' | 'decline' | 'start' | 'complete',
    source: 'incoming' | 'assigned' = 'assigned'
  ) => {
    if (action === 'accept' && !profile?.id) {
      setError('You need a professional profile to accept jobs.');
      return;
    }
    try {
      setActionBookingId(bookingId);
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, action, professionalId: action === 'accept' ? profile?.id : undefined }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || 'Action failed');
      const updated = j.booking ? normalizeBooking(j.booking) : null;
      if (source === 'incoming') {
        setIncomingBookings((prev) => prev.filter((b) => b.id !== bookingId));
        if (action === 'accept' && updated) {
          setBookings((prev) => [updated, ...prev]);
        }
      } else if (updated) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, ...updated } : b)));
      }
      if (selected?.id === bookingId && updated) {
        setSelected({ ...(selected as Booking), ...updated });
      }
    } catch (e: any) {
      setError(e?.message || 'Action failed');
    } finally {
      setActionBookingId(null);
    }
  };

  const handleQuoteUpdate = async (booking: Booking, amount: number, acceptAfter = false) => {
    if (!booking?.id) return;
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setQuoteError("Enter a valid amount greater than 0.");
      return;
    }
    setQuoteSubmitting(true);
    setQuoteError(null);
    try {
      const res = await fetch("/api/payments/update-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          amount,
          paymentIntentId: (booking as any).paymentIntentId ?? (booking as any).payment_intent_id,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to update quote");

      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? { ...b, priceEstimate: amount, paymentIntentId: data.paymentIntentId || b.paymentIntentId }
            : b
        )
      );
      if (selected?.id === booking.id) {
        setSelected((prev) =>
          prev
            ? { ...prev, priceEstimate: amount, paymentIntentId: data.paymentIntentId || (prev as any).paymentIntentId }
            : prev
        );
      }
      if (acceptAfter) {
        await handleAction(booking.id, 'accept');
      }
    } catch (e: any) {
      setQuoteError(e?.message || "Unable to update quote");
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const resolveConversation = async () => {
    if (!currentUserId) throw new Error("Not logged in");
    const priorityBooking = selected || bookings.find((b) => {
      const statuses: BookingStatus[] = ['in_progress', 'confirmed', 'pending', 'awaiting_confirmation'];
      const customerId = b.customerId || (b as any).customer_id;
      return statuses.includes(b.status) && Boolean(customerId);
    });
    if (priorityBooking) {
      const customerId = priorityBooking.customerId || (priorityBooking as any).customer_id;
      const professionalId =
        priorityBooking.professionalId ||
        (priorityBooking as any).professional_id ||
        profile?.user_id ||
        profile?.id ||
        currentUserId;
      if (customerId && professionalId) {
        return await getOrCreateBookingConversation(
          supabase,
          customerId,
          priorityBooking.id,
          professionalId
        );
      }
    }
    if (conversations.length) return conversations[0].id;
    return await getOrCreateSupportConversation(supabase, currentUserId);
  };

  if (status === 'loading') return <div className="p-10">Loading</div>;
  if (status === 'unauth') return (
    <main className="p-10">
      <p>Please <Link className="text-blue-600" href="/login">login</Link> to access your dashboard.</p>
    </main>
  );

  return (
    <>
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome back, {name || 'Pro'}</h1>
            <p className="text-sm text-gray-600">Manage your jobs and earnings</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Availability</span>
              <button
                type="button"
                onClick={toggleAvailability}
                disabled={availabilitySaving}
                className={`px-3 py-1 rounded-full border text-sm ${profile?.isAvailable ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-gray-100 border-gray-300 text-gray-700'} disabled:opacity-60`}
              >
                {availabilitySaving ? 'Saving...' : profile?.isAvailable ? 'Available' : 'Offline'}
              </button>
            </div>
            <Link href="/pro/onboarding" className="text-blue-600 text-sm font-semibold">Edit profile</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg">Profile completeness</h2>
            <span className="text-sm text-gray-600">{completion}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: `${completion}%` }} />
          </div>
          {completion < 100 && (
            <p className="text-sm text-gray-700 mt-2">
              Complete your profile to get more jobs. <Link href="/pro/onboarding" className="text-blue-600 font-semibold">Continue onboarding</Link>
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Jobs today</p>
            <p className="text-2xl font-bold">{bookings.filter((b) => b.scheduledAt && new Date(b.scheduledAt).toDateString() === new Date().toDateString()).length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Earnings this week</p>
            <p className="text-2xl font-bold">{formatEuro(earnings.weekSum) ?? '€0.00'}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Earnings this month</p>
            <p className="text-2xl font-bold">{formatEuro(earnings.monthSum) ?? '€0.00'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-lg">Incoming job requests</h2>
              <p className="text-sm text-gray-600">Accept to claim a job. Once accepted, it is removed from other pros.</p>
            </div>
            {incomingLoading && <span className="text-xs text-gray-500">Loading…</span>}
          </div>
          {incomingBookings.length === 0 && !incomingLoading ? (
            <p className="text-sm text-gray-600">No new job requests right now.</p>
          ) : (
            <div className="space-y-3">
              {incomingBookings.map((job) => (
                <div key={job.id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{displayService(job)} <span className="text-gray-500">— {displayProblem(job)}</span></p>
                    <p className="text-xs text-gray-600">Location: {displayLocation(job)}</p>
                    <p className="text-xs text-gray-600">When: {formatDateTime(job.scheduledAt) || 'Emergency / ASAP'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAction(job.id, 'accept', 'incoming')}
                      disabled={actionBookingId === job.id}
                      className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60"
                    >
                      {actionBookingId === job.id ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(job.id, 'decline', 'incoming')}
                      disabled={actionBookingId === job.id}
                      className="px-4 py-2 rounded-lg bg-rose-100 text-rose-700 text-sm font-semibold disabled:opacity-60"
                    >
                      {actionBookingId === job.id ? 'Declining...' : 'Decline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          {(['new','upcoming','in_progress','completed','cancelled'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg border ${activeTab === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700'}`}
            >
              {t.replace('_',' ').toUpperCase()}
            </button>
          ))}
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>}

        {filtered.length === 0 ? (
          <div className="text-gray-600 text-sm mb-6">No jobs in this tab.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {filtered.map((b) => {
              const estimatedHours = b.estimatedHours ?? (b as any).estimated_hours;
              const estimatedPrice = b.priceEstimate ?? (b as any).price_estimate;
              const ratingValue = b.rating ?? (b as any).rating ?? null;
              const reviewText = b.review ?? (b as any).review ?? null;
              return (
                <div key={b.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm text-gray-500">Job</p>
                      <p className="font-semibold text-gray-900">{b.serviceCategory}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">Problem: {b.problemType}</p>
                  <p className="text-sm text-gray-600">
                    {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : 'Emergency / ASAP'}
                  </p>
                  <p className="text-sm text-gray-600">Location: {b.county} {b.areas?.join(', ')}</p>
                  {estimatedHours ? <p className="text-sm text-gray-600">Est. Hours: {estimatedHours}</p> : null}
                  {estimatedPrice ? <p className="text-sm text-gray-700">Est. Price: {formatEuro(estimatedPrice)}</p> : null}
                  {b.status === 'completed' && (
                    <p className="text-sm text-gray-700 mt-1">
                      {ratingValue !== null ? `Rating: ${ratingValue}/5` : 'Awaiting client review'}
                      {reviewText ? ` - "${reviewText}"` : ''}
                    </p>
                  )}
                  <div className="mt-3 flex justify-between items-center">
                    <button className="text-blue-600 text-sm font-semibold" onClick={() => setSelected(b)}>View details</button>
                    {b.status === 'pending' || b.status === 'awaiting_confirmation' ? (
                      <div className="flex gap-2">
                        <button disabled={actionBookingId === b.id} className="text-emerald-600 text-sm font-semibold disabled:opacity-50" onClick={() => handleAction(b.id, 'accept')}>
                          {actionBookingId === b.id ? 'Accepting...' : 'Accept'}
                        </button>
                        <button disabled={actionBookingId === b.id} className="text-red-600 text-sm font-semibold disabled:opacity-50" onClick={() => handleAction(b.id, 'decline')}>
                          {actionBookingId === b.id ? 'Declining...' : 'Decline'}
                        </button>
                      </div>
                    ) : b.status === 'confirmed' ? (
                      <button disabled={actionBookingId === b.id} className="text-emerald-600 text-sm font-semibold disabled:opacity-50" onClick={() => handleAction(b.id, 'start')}>
                        {actionBookingId === b.id ? 'Starting...' : 'Start'}
                      </button>
                    ) : b.status === 'in_progress' ? (
                      <button disabled={actionBookingId === b.id} className="text-emerald-600 text-sm font-semibold disabled:opacity-50" onClick={() => handleAction(b.id, 'complete')}>
                        {actionBookingId === b.id ? 'Completing...' : 'Complete'}
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold mb-3">Schedule</h3>
          <div className="space-y-3">
            {Object.entries(groupedSchedule).map(([label, list]) => (
              <div key={label} className="border border-gray-100 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
                {list.length === 0 ? (
                  <p className="text-xs text-gray-500">No jobs.</p>
                ) : (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {list.map((b) => (
                      <li key={b.id} className="flex justify-between">
                        <span>{b.serviceCategory} - {b.problemType}</span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(b.scheduledAt) || 'ASAP'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={() => setSelected(null)}>x</button>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Job Details</h3>
              {(() => {
                const selectedHours = selected.estimatedHours ?? (selected as any).estimated_hours;
                const selectedPrice = selected.priceEstimate ?? (selected as any).price_estimate;
                const receipt = (selected as any).receipt ?? selected.receipt;
                return (
                  <>
                    <ul className="text-sm text-gray-700 space-y-1 mb-4">
                      <li><strong>ID:</strong> {selected.id}</li>
                      <li><strong>Service:</strong> {selected.serviceCategory} - {selected.problemType}</li>
                      <li><strong>Status:</strong> {selected.status}</li>
                      <li><strong>Schedule:</strong> {selected.scheduledAt ? new Date(selected.scheduledAt).toLocaleString() : 'Emergency / ASAP'}</li>
                      <li><strong>Description:</strong> {selected.description || '-'}</li>
                      <li><strong>Location:</strong> {selected.county} {selected.areas?.join(', ')}</li>
                      <li><strong>Eircode:</strong> {selected.eircode || '-'}</li>
                      <li><strong>Assigned Pro (you):</strong> {profile?.id}</li>
                      {selectedHours ? <li><strong>Estimated Duration:</strong> {selectedHours} hours</li> : null}
                      {selectedPrice ? <li><strong>Estimated Price:</strong> {formatEuro(selectedPrice)}</li> : null}
                      {selected.rating ? <li><strong>Rating:</strong> {selected.rating}/5</li> : selected.status === 'completed' ? <li><strong>Rating:</strong> Awaiting client review</li> : null}
                      {selected.review ? <li><strong>Review:</strong> {selected.review}</li> : null}
                    </ul>
                    {receipt && (
                      <div className="mb-4 border-t pt-3 text-sm text-gray-700">
                        <p className="font-semibold mb-1">Receipt</p>
                        {receipt.priceEstimate !== undefined && receipt.priceEstimate !== null && (
                          <p>Estimated Price: {formatEuro(receipt.priceEstimate) ?? '-'}</p>
                        )}
                        {receipt.finalPrice !== undefined && receipt.finalPrice !== null && (
                          <p>Final Price: {formatEuro(receipt.finalPrice) ?? '-'}</p>
                        )}
                        <p>Completed At: {formatDateTime(receipt.completedAt) || '-'}</p>
                      </div>
                    )}
                  </>
                );
              })()}
              {selected.imageUrls && selected.imageUrls.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-1">Photos</p>
                  <div className="flex gap-2 flex-wrap">
                    {selected.imageUrls.map((url, idx) => (
                      <img key={idx} src={url} alt={`photo-${idx}`} className="w-16 h-16 object-cover rounded" />
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-4 space-y-2">
                <p className="text-sm font-semibold text-gray-800">Quote</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Estimate (€)"
                  />
                  <span className="text-xs text-gray-500">EUR</span>
                </div>
                {quoteError && <p className="text-xs text-rose-600">{quoteError}</p>}
                <p className="text-xs text-gray-500">
                  Adjust the quote before accepting. We will update the held payment amount.
                </p>
              </div>
              <div className="text-right">
                {selected.status === 'pending' || selected.status === 'awaiting_confirmation' ? (
                  <div className="flex flex-col gap-2 justify-end">
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        disabled={quoteSubmitting}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg disabled:opacity-60"
                        onClick={() => handleQuoteUpdate(selected, Number(quoteAmount || 0), false)}
                      >
                        {quoteSubmitting ? 'Updating…' : 'Submit revised quote'}
                      </button>
                      <button
                        disabled={actionBookingId === selected.id || quoteSubmitting}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-60"
                        onClick={() => handleQuoteUpdate(selected, Number(quoteAmount || 0) || 0, true)}
                      >
                        {actionBookingId === selected.id ? 'Accepting...' : 'Accept & claim'}
                      </button>
                    </div>
                    <button disabled={actionBookingId === selected.id} className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-60" onClick={() => handleAction(selected.id, 'decline')}>
                      {actionBookingId === selected.id ? 'Declining...' : 'Decline'}
                    </button>
                  </div>
                ) : selected.status === 'confirmed' ? (
                  <button disabled={actionBookingId === selected.id} className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-60" onClick={() => handleAction(selected.id, 'start')}>
                    {actionBookingId === selected.id ? 'Starting...' : 'Start Job'}
                  </button>
                ) : selected.status === 'in_progress' ? (
                  <button disabled={actionBookingId === selected.id} className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-60" onClick={() => handleAction(selected.id, 'complete')}>
                    {actionBookingId === selected.id ? 'Completing...' : 'Complete Job'}
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => setSelected(null)}>Close</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
    {currentUserId && (
      <ChatLauncher
        currentUserId={currentUserId}
        currentUserRole="professional"
        resolveConversation={resolveConversation}
        label="Chats"
      />
    )}
    </>
  );
}
