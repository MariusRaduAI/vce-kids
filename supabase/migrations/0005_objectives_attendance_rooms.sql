-- Obiective (urmarite si de biserica mentora), prezenta, si sali — pentru pagina de
-- Coordonare (admin local + pastor) si modulul VCE (super-admin, status pe toata reteaua).
-- Toate folosesc is_org_member/is_org_admin, care deja includ platform_admin automat.

create table public.org_objectives (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  description text,
  target_date date,
  status text not null default 'in_progress' check (status in ('in_progress', 'achieved', 'missed')),
  set_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.org_objectives enable row level security;

create policy "objectives: org read" on public.org_objectives
  for select using (public.is_org_member(org_id));
create policy "objectives: org admin manage" on public.org_objectives
  for all using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  record_date date not null,
  age_group text not null,
  member_count int not null default 0,
  non_member_count int not null default 0,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.attendance_records enable row level security;

create policy "attendance: org read" on public.attendance_records
  for select using (public.is_org_member(org_id));
create policy "attendance: org admin manage" on public.attendance_records
  for all using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create table public.org_rooms (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  age_group text,
  capacity int,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.org_rooms enable row level security;

create policy "rooms: org read" on public.org_rooms
  for select using (public.is_org_member(org_id));
create policy "rooms: org admin manage" on public.org_rooms
  for all using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));
