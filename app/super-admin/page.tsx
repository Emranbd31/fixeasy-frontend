import type { ReactNode } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LogOut, Users, Briefcase, Book, CreditCard, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  type Database,
} from '@/lib/supabaseServerClient';

export const revalidate = 120;

type AdminProfile = {
  id: string;
  role: string | null;
  full_name: string | null;
  email: string | null;
};

type DashboardData = {
  stats: {
    totalUsers: number;
    totalProfessionals: number;
    totalBookings: number;
    totalPayments: number;
    totalRevenue: number;
  };
  professionals: Database['public']['Tables']['professionals']['Row'][];
  clients: Database['public']['Tables']['profiles']['Row'][];
  bookings: Database['public']['Tables']['bookings']['Row'][];
  payments: Database['public']['Tables']['payments']['Row'][];
  logs: Database['public']['Tables']['activity_logs']['Row'][];
};

const EMPTY_DASHBOARD: DashboardData = {
  stats: {
    totalUsers: 0,
    totalProfessionals: 0,
    totalBookings: 0,
    totalPayments: 0,
    totalRevenue: 0,
  },
  professionals: [],
  clients: [],
  bookings: [],
  payments: [],
  logs: [],
};

async function signOut() {
  'use server';

  const cookieStore = cookies();
  cookieStore.delete('sb-access-token');
  cookieStore.delete('sb-refresh-token');
  redirect('/login');
}

async function getDashboardData(): Promise<DashboardData> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return EMPTY_DASHBOARD;
  }

  const [
    totalUsersResponse,
    professionalsResponse,
    clientsResponse,
    bookingsResponse,
    paymentsResponse,
    paymentsRevenueResponse,
    logsResponse,
  ] = await Promise.all([
    adminClient.from('profiles').select('id', { count: 'exact', head: true }),
    adminClient
      .from('professionals')
      .select(
        'id, user_id, full_name, email, trade, speciality, status, verified, created_at',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .limit(25),
    adminClient
      .from('profiles')
      .select('id, user_id, full_name, email, active, created_at, role', { count: 'exact' })
      .eq('role', 'client')
      .order('created_at', { ascending: false })
      .limit(25),
    adminClient
      .from('bookings')
      .select(
        'id, service, status, amount, client_email, client_name, professional_email, professional_name, created_at',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .limit(25),
    adminClient
      .from('payments')
      .select('id, booking_id, amount, status, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(25),
    adminClient.from('payments').select('amount'),
    adminClient
      .from('activity_logs')
      .select('id, action, user_email, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const stats = {
    totalUsers:
      totalUsersResponse.error || typeof totalUsersResponse.count !== 'number'
        ? 0
        : totalUsersResponse.count,
    totalProfessionals:
      professionalsResponse.error || typeof professionalsResponse.count !== 'number'
        ? professionalsResponse.data?.length ?? 0
        : professionalsResponse.count,
    totalBookings:
      bookingsResponse.error || typeof bookingsResponse.count !== 'number'
        ? bookingsResponse.data?.length ?? 0
        : bookingsResponse.count,
    totalPayments:
      paymentsResponse.error || typeof paymentsResponse.count !== 'number'
        ? paymentsResponse.data?.length ?? 0
        : paymentsResponse.count,
    totalRevenue: Array.isArray(paymentsRevenueResponse.data)
      ? paymentsRevenueResponse.data.reduce((sum: number, row: Record<string, any>) => {
          const amount = row?.amount;
          if (typeof amount === 'number') return sum + amount;
          const parsed = Number(amount ?? 0);
          return Number.isNaN(parsed) ? sum : sum + parsed;
        }, 0)
      : 0,
  } satisfies DashboardData['stats'];

  const professionals = professionalsResponse.error
    ? []
    : professionalsResponse.data ?? [];
  const clients = clientsResponse.error ? [] : clientsResponse.data ?? [];
  const bookings = bookingsResponse.error ? [] : bookingsResponse.data ?? [];
  const payments = paymentsResponse.error ? [] : paymentsResponse.data ?? [];
  const logs = logsResponse.error ? [] : logsResponse.data ?? [];

  return {
    stats,
    professionals,
    clients,
    bookings,
    payments,
    logs,
  };
}

function resolveName(entity: Record<string, any>): string {
  return (
    entity?.full_name ??
    entity?.name ??
    entity?.client_name ??
    entity?.professional_name ??
    entity?.title ??
    '—'
  );
}

function resolveEmail(entity: Record<string, any>): string {
  return (
    entity?.email ??
    entity?.user_email ??
    entity?.client_email ??
    entity?.professional_email ??
    '—'
  );
}

function resolveStatus(entity: Record<string, any>): string {
  if (typeof entity?.status === 'string' && entity.status.trim().length) {
    return entity.status;
  }
  if (typeof entity?.verified === 'boolean') {
    return entity.verified ? 'approved' : 'pending';
  }
  if (typeof entity?.active === 'boolean') {
    return entity.active ? 'active' : 'inactive';
  }
  return '—';
}

export default async function SuperAdminPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, role, full_name, email')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load admin profile', error.message);
  }

  if (!profile || profile.role !== 'admin') {
    redirect('/403');
  }

  const dashboard = await getDashboardData();

  return <DashboardShell profile={profile as AdminProfile} dashboard={dashboard} />;
}

function DashboardShell({
  profile,
  dashboard,
}: {
  profile: AdminProfile;
  dashboard: DashboardData;
}) {
  const summaryCards = [
    {
      label: 'Total Users',
      value: dashboard.stats.totalUsers.toLocaleString(),
      icon: <Users className="w-5 h-5 text-blue-500" aria-hidden="true" />,
    },
    {
      label: 'Total Professionals',
      value: dashboard.stats.totalProfessionals.toLocaleString(),
      icon: <Briefcase className="w-5 h-5 text-green-500" aria-hidden="true" />,
    },
    {
      label: 'Total Bookings',
      value: dashboard.stats.totalBookings.toLocaleString(),
      icon: <Book className="w-5 h-5 text-yellow-500" aria-hidden="true" />,
    },
    {
      label: 'Total Payments',
      value: dashboard.stats.totalPayments.toLocaleString(),
      icon: <CreditCard className="w-5 h-5 text-purple-500" aria-hidden="true" />,
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(dashboard.stats.totalRevenue),
      icon: <TrendingUp className="w-5 h-5 text-rose-500" aria-hidden="true" />,
    },
  ];

  const sections: Array<{
    key: string;
    title: string;
    description?: string;
    headers: string[];
    rows: ReactNode[][];
    rowKeys: (string | number)[];
    emptyMessage: string;
  }> = [
    {
      key: 'professionals',
      title: 'Professionals',
      description: 'Latest tradespeople pending review or recently approved.',
      headers: ['Name', 'Email', 'Trade', 'Status', 'Joined'],
      rows: dashboard.professionals.map((pro) => [
        resolveName(pro),
        resolveEmail(pro),
        pro.trade ?? pro.speciality ?? '—',
        resolveStatus(pro),
        pro.created_at ? formatDate(pro.created_at) : '—',
      ]),
      rowKeys: dashboard.professionals.map((pro, index) => pro.id ?? pro.user_id ?? index),
      emptyMessage: 'No professionals found.',
    },
    {
      key: 'clients',
      title: 'Clients',
      description: 'Recent client sign-ups across the marketplace.',
      headers: ['Name', 'Email', 'Status', 'Joined'],
      rows: dashboard.clients.map((client) => [
        resolveName(client),
        resolveEmail(client),
        resolveStatus(client),
        client.created_at ? formatDate(client.created_at) : '—',
      ]),
      rowKeys: dashboard.clients.map((client, index) => client.id ?? client.user_id ?? index),
      emptyMessage: 'No clients found.',
    },
    {
      key: 'bookings',
      title: 'Bookings',
      description: 'Most recent service bookings and their current status.',
      headers: ['Service', 'Client', 'Professional', 'Status', 'Created'],
      rows: dashboard.bookings.map((booking) => [
        booking.service ?? '—',
        booking.client_name ?? resolveEmail({ client_email: booking.client_email }),
        booking.professional_name ?? resolveEmail({ professional_email: booking.professional_email }),
        resolveStatus(booking),
        booking.created_at ? formatDate(booking.created_at) : '—',
      ]),
      rowKeys: dashboard.bookings.map((booking, index) => booking.id ?? index),
      emptyMessage: 'No bookings recorded.',
    },
    {
      key: 'payments',
      title: 'Payments',
      description: 'Latest payment attempts and reconciliation progress.',
      headers: ['Booking', 'Amount', 'Status', 'Processed'],
      rows: dashboard.payments.map((payment) => {
        const rawAmount = payment.amount;
        const numericAmount = typeof rawAmount === 'number' ? rawAmount : Number(rawAmount ?? 0);
        return [
          payment.booking_id ?? '—',
          Number.isNaN(numericAmount) ? '—' : formatCurrency(numericAmount),
          resolveStatus(payment),
          payment.created_at ? formatDate(payment.created_at) : '—',
        ];
      }),
      rowKeys: dashboard.payments.map((payment, index) => payment.id ?? payment.booking_id ?? index),
      emptyMessage: 'No payments processed yet.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex flex-col gap-4 bg-white px-6 py-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-500">FixEasy</p>
          <h1 className="text-2xl font-semibold text-gray-900">Super Admin Overview</h1>
          <p className="text-sm text-gray-500">Monitor supply, demand, and platform health in real time.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{profile.full_name ?? 'Super Admin'}</p>
            <p className="text-xs text-gray-500">{profile.email ?? ''}</p>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="icon" aria-label="Sign out">
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </header>

      <main className="px-6 pb-12">
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((card) => (
            <Card key={card.label} className="flex flex-col justify-between">
              <CardHeader className="flex items-center gap-3 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  {card.icon}
                </div>
                <CardTitle className="text-sm font-medium text-gray-500">{card.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold text-gray-900">{card.value}</CardContent>
            </Card>
          ))}
        </section>

        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          {sections.map((section) => (
            <DataSection
              key={section.key}
              title={section.title}
              description={section.description}
              headers={section.headers}
              rows={section.rows}
              rowKeys={section.rowKeys}
              emptyMessage={section.emptyMessage}
            />
          ))}
        </div>

        <section className="mt-10">
          <DataSection
            title="Activity Logs"
            description="High-level audit trail for sensitive admin operations."
            headers={['Action', 'Actor', 'Timestamp']}
            rows={dashboard.logs.map((log) => [
              log.action ?? '—',
              resolveEmail(log),
              log.created_at ? formatDate(log.created_at) : '—',
            ])}
            rowKeys={dashboard.logs.map((log, index) => log.id ?? index)}
            emptyMessage="No activity recorded."
          />
        </section>

        <section className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Need deeper insights? Export data directly from Supabase for ad-hoc analysis.
          </p>
          <Link
            href="https://app.supabase.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Open Supabase project →
          </Link>
        </section>
      </main>
    </div>
  );
}

function DataSection({
  title,
  description,
  headers,
  rows,
  emptyMessage,
  rowKeys,
}: {
  title: string;
  description?: string;
  headers: string[];
  rows: ReactNode[][];
  emptyMessage: string;
  rowKeys: (string | number)[];
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        {description ? <p className="text-sm text-gray-500">{description}</p> : null}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {headers.map((header) => (
                  <th key={header} className="py-2 pr-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="py-6 text-center text-gray-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={rowKeys[index] ?? index} className="border-b last:border-0">
                    {row.map((cell, cellIndex) => (
                      <td key={`${rowKeys[index] ?? index}-${cellIndex}`} className="py-2 pr-4">
                        {cell ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
