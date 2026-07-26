-- Model de guvernanta: VCE (super-admin) tine fix viziunea/principiile/siguranta la nivel de retea;
-- fiecare biserica isi configureaza grupele, curriculum-ul si echipa; checklist minim de "lucrare
-- functionala" vizibil la nivel de retea; resurse cu aprobare; zona doar pentru coordonatori.

-- ─────────────────────────────────────────────────────────────
-- ORGANIZATII: biserica mentora + curriculum folosit
-- ─────────────────────────────────────────────────────────────
alter table public.organizations add column mentor_org_id uuid references public.organizations (id);
alter table public.organizations add column curriculum_name text;

-- ─────────────────────────────────────────────────────────────
-- GRUPE DE VARSTA — fiecare biserica isi defineste propriile grupe
-- ─────────────────────────────────────────────────────────────
create table public.org_age_groups (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  label text not null,
  min_age int,
  max_age int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.org_age_groups enable row level security;

create policy "org_age_groups: org read" on public.org_age_groups
  for select using (public.is_org_member(org_id));
create policy "org_age_groups: org admin manage" on public.org_age_groups
  for all using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

-- ─────────────────────────────────────────────────────────────
-- CHECKLIST "LUCRARE FUNCTIONALA" — definit de VCE, urmarit per biserica
-- ─────────────────────────────────────────────────────────────
create table public.org_readiness_checks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.org_readiness_checks enable row level security;

create policy "readiness_checks: network read" on public.org_readiness_checks
  for select using (
    public.is_platform_admin() or exists (
      select 1 from public.memberships where user_id = auth.uid() and status = 'active'
    )
  );
create policy "readiness_checks: platform admin manage" on public.org_readiness_checks
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());

create table public.org_readiness_status (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  check_id uuid not null references public.org_readiness_checks (id) on delete cascade,
  is_complete boolean not null default false,
  completed_by uuid references public.profiles (id),
  completed_at timestamptz,
  note text,
  unique (org_id, check_id)
);

alter table public.org_readiness_status enable row level security;

create policy "readiness_status: org read" on public.org_readiness_status
  for select using (public.is_org_member(org_id));
create policy "readiness_status: platform admin read all" on public.org_readiness_status
  for select using (public.is_platform_admin());
create policy "readiness_status: org admin manage" on public.org_readiness_status
  for all using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

-- ─────────────────────────────────────────────────────────────
-- CURSURI VCE — catalog la nivel de retea, stabilit de super-admin, vizibil tuturor
-- ─────────────────────────────────────────────────────────────
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  category text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "courses: network read" on public.courses
  for select using (
    public.is_platform_admin() or exists (
      select 1 from public.memberships where user_id = auth.uid() and status = 'active'
    )
  );
create policy "courses: platform admin manage" on public.courses
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());

-- ─────────────────────────────────────────────────────────────
-- ZONA COORDONATORILOR — vizibila doar adminilor (din orice biserica) + super-admin
-- ─────────────────────────────────────────────────────────────
create table public.coordinator_hub_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.coordinator_hub_posts enable row level security;

create function public.is_any_org_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_platform_admin() or exists (
    select 1 from public.memberships
    where user_id = auth.uid() and role = 'org_admin' and status = 'active'
  );
$$;

create policy "coordinator_hub: admins read" on public.coordinator_hub_posts
  for select using (public.is_any_org_admin());
create policy "coordinator_hub: admins write" on public.coordinator_hub_posts
  for insert with check (public.is_any_org_admin());
create policy "coordinator_hub: author or platform admin update" on public.coordinator_hub_posts
  for update using (created_by = auth.uid() or public.is_platform_admin());
create policy "coordinator_hub: author or platform admin delete" on public.coordinator_hub_posts
  for delete using (created_by = auth.uid() or public.is_platform_admin());

-- ─────────────────────────────────────────────────────────────
-- RESURSE — flux de aprobare (oricine propune, super-admin aproba) + categorii libere
-- ─────────────────────────────────────────────────────────────
alter table public.resources drop constraint resources_category_check;
alter table public.resources add column status text not null default 'approved'
  check (status in ('pending', 'approved', 'rejected'));
alter table public.resources add column submitted_by uuid references public.profiles (id);

drop policy "resources: read" on public.resources;
create policy "resources: read approved" on public.resources
  for select using (
    status = 'approved' and (org_id is null or public.is_org_member(org_id))
  );
create policy "resources: read own submissions" on public.resources
  for select using (submitted_by = auth.uid());
create policy "resources: platform admin read all" on public.resources
  for select using (public.is_platform_admin());

create policy "resources: platform admin moderate" on public.resources
  for update using (public.is_platform_admin()) with check (public.is_platform_admin());

-- ─────────────────────────────────────────────────────────────
-- PROCEDURI — "siguranta" si "urgente" raman fixe la nivel de retea (doar VCE le editeaza)
-- ─────────────────────────────────────────────────────────────
drop policy "procedures: org admin write" on public.procedures;
create policy "procedures: org admin write" on public.procedures
  for insert with check (
    org_id is not null and public.is_org_admin(org_id)
    and category not in ('siguranta', 'urgente')
  );

drop policy "procedures: org admin update" on public.procedures;
create policy "procedures: org admin update" on public.procedures
  for update using (
    org_id is not null and public.is_org_admin(org_id)
    and category not in ('siguranta', 'urgente')
  );
