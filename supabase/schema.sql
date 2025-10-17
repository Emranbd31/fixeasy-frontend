create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  role text not null default 'client' check (role in ('client', 'pro', 'admin')),
  created_at timestamp with time zone not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references public.users(id) on delete cascade,
  full_name text,
  phone text,
  address jsonb default '{}'::jsonb,
  created_at timestamp with time zone not null default timezone('utc', now()),
  updated_at timestamp with time zone not null default timezone('utc', now())
);

create table if not exists public.professionals (
  id uuid primary key references public.users(id) on delete cascade,
  company_name text,
  verified boolean not null default false,
  documents jsonb not null default '[]'::jsonb,
  hourly_rate numeric(10, 2),
  service_area text[],
  created_at timestamp with time zone not null default timezone('utc', now()),
  updated_at timestamp with time zone not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  base_price numeric(10, 2),
  is_active boolean not null default true,
  created_at timestamp with time zone not null default timezone('utc', now())
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.users(id) on delete cascade,
  professional_id uuid references public.users(id) on delete set null,
  service_id uuid not null references public.services(id),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  scheduled_for timestamp with time zone not null,
  duration_minutes integer,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default timezone('utc', now()),
  updated_at timestamp with time zone not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id bigserial primary key,
  actor_id uuid,
  action text not null,
  resource_type text not null,
  resource_id text,
  previous_values jsonb,
  new_values jsonb,
  metadata jsonb default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone not null default timezone('utc', now())
);

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.professionals enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.audit_logs enable row level security;
