-- RLS hardening for MVP loop
-- Assumptions:
-- - Guest booking allowed: anon can INSERT bookings.
-- - Client direct reads are locked down; professional reads via authenticated user.
-- - Server routes use service role for writes and bypass RLS (FORCE RLS is NOT enabled).

begin;

-- Enable RLS
alter table public.bookings enable row level security;
alter table public.professionals enable row level security;

-- BOOKINGS POLICIES
-- Allow anonymous and authenticated users to create bookings (guest booking).
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='bookings' and policyname='bookings_insert_anyone'
  ) then
    create policy bookings_insert_anyone
      on public.bookings
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;

-- Allow professionals to read only their accepted bookings.
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='bookings' and policyname='bookings_select_own'
  ) then
    create policy bookings_select_own
      on public.bookings
      for select
      to authenticated
      using (accepted_by = auth.uid());
  end if;
end $$;

-- Allow professionals to update only their accepted bookings.
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='bookings' and policyname='bookings_update_own'
  ) then
    create policy bookings_update_own
      on public.bookings
      for update
      to authenticated
      using (accepted_by = auth.uid())
      with check (accepted_by = auth.uid());
  end if;
end $$;

-- PROFESSIONALS POLICIES
-- Allow authenticated users to create their professional profile row.
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='professionals' and policyname='professionals_insert_self'
  ) then
    create policy professionals_insert_self
      on public.professionals
      for insert
      to authenticated
      with check (user_id = auth.uid());
  end if;
end $$;

-- Allow users to read their own professional profile.
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='professionals' and policyname='professionals_select_self'
  ) then
    create policy professionals_select_self
      on public.professionals
      for select
      to authenticated
      using (user_id = auth.uid());
  end if;
end $$;

-- Allow users to update their own professional profile.
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='professionals' and policyname='professionals_update_self'
  ) then
    create policy professionals_update_self
      on public.professionals
      for update
      to authenticated
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end $$;

commit;
