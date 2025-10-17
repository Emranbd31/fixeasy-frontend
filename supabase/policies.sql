create policy "Clients can view own user record" on public.users
  for select
  using (auth.uid() = id);

create policy "Clients manage own user record" on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins full access to users" on public.users
  for all
  using (auth.jwt()->> 'role' = 'admin')
  with check (auth.jwt()->> 'role' = 'admin');

create policy "Profiles accessible by owner" on public.profiles
  for select
  using (auth.uid() = id);

create policy "Profiles update by owner" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins full access to profiles" on public.profiles
  for all
  using (auth.jwt()->> 'role' = 'admin')
  with check (auth.jwt()->> 'role' = 'admin');

create policy "Professionals manage their record" on public.professionals
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins manage professionals" on public.professionals
  for all
  using (auth.jwt()->> 'role' = 'admin')
  with check (auth.jwt()->> 'role' = 'admin');

create policy "Services available to authenticated users" on public.services
  for select
  using (auth.role() = 'authenticated');

create policy "Admins manage services" on public.services
  for all
  using (auth.jwt()->> 'role' = 'admin')
  with check (auth.jwt()->> 'role' = 'admin');

create policy "Clients manage their bookings" on public.bookings
  for select
  using (auth.uid() = client_id);

create policy "Clients create bookings for themselves" on public.bookings
  for insert
  with check (auth.uid() = client_id);

create policy "Clients update own bookings" on public.bookings
  for update
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

create policy "Professionals see assigned bookings" on public.bookings
  for select
  using (auth.uid() = professional_id);

create policy "Professionals update assigned bookings" on public.bookings
  for update
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

create policy "Admins full access to bookings" on public.bookings
  for all
  using (auth.jwt()->> 'role' = 'admin')
  with check (auth.jwt()->> 'role' = 'admin');

create policy "Admins full access to audit logs" on public.audit_logs
  for all
  using (auth.jwt()->> 'role' = 'admin')
  with check (auth.jwt()->> 'role' = 'admin');

create policy "Actors can view their audit entries" on public.audit_logs
  for select
  using (auth.uid() = actor_id);
