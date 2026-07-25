-- VCE Kids — schema inițial multi-tenant
-- Convenție: org_id NULL pe un rând de conținut = template global (moștenit de toate bisericile).
-- Nicio înregistrare publică: userii sunt creați doar prin invite (vezi tabela `invites`).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- ORGANIZAȚII (biserici din rețea)
-- ─────────────────────────────────────────────────────────────
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text,
  country text,
  status text not null default 'active' check (status in ('active', 'pending', 'archived')),
  logo_url text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- PROFILE (1-1 cu auth.users)
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  is_platform_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- MEMBERSHIPS (rolul unui user într-o biserică)
-- ─────────────────────────────────────────────────────────────
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('org_admin', 'leader', 'volunteer')),
  department text, -- ex: 'receptie', 'predare', 'worship', null = fără departament fix
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

-- ─────────────────────────────────────────────────────────────
-- INVITES (singura cale de a intra în platformă)
-- ─────────────────────────────────────────────────────────────
create table public.invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  code text not null unique default encode(gen_random_bytes(16), 'hex'),
  role text not null check (role in ('org_admin', 'leader', 'volunteer')),
  department text,
  email text, -- opțional: dacă e setat, invitația e legată de un email anume
  created_by uuid references public.profiles (id),
  expires_at timestamptz not null default (now() + interval '14 days'),
  used_at timestamptz,
  used_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- HELPERS pentru RLS
-- ─────────────────────────────────────────────────────────────
create function public.is_platform_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select is_platform_admin from public.profiles where id = auth.uid()), false);
$$;

create function public.is_org_member(target_org_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where org_id = target_org_id and user_id = auth.uid() and status = 'active'
  ) or public.is_platform_admin();
$$;

create function public.org_role(target_org_id uuid)
returns text
language sql stable security definer set search_path = public
as $$
  select role from public.memberships
  where org_id = target_org_id and user_id = auth.uid() and status = 'active'
  limit 1;
$$;

create function public.is_org_admin(target_org_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.org_role(target_org_id) = 'org_admin' or public.is_platform_admin();
$$;

-- ─────────────────────────────────────────────────────────────
-- ORGANIGRAMĂ
-- ─────────────────────────────────────────────────────────────
create table public.org_chart_nodes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  parent_id uuid references public.org_chart_nodes (id) on delete cascade,
  title text not null, -- numele rolului, ex: "Coordonator Vertical Kids"
  membership_id uuid references public.memberships (id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- CONȚINUT (template global când org_id e null, override local altfel)
-- ─────────────────────────────────────────────────────────────
create table public.procedures (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations (id) on delete cascade, -- null = template global
  category text not null, -- 'siguranta', 'urgente', 'receptie', ...
  title text not null,
  body text not null, -- markdown
  version int not null default 1,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.procedure_confirmations (
  id uuid primary key default gen_random_uuid(),
  procedure_id uuid not null references public.procedures (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  version_confirmed int not null,
  confirmed_at timestamptz not null default now(),
  unique (procedure_id, user_id, version_confirmed)
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations (id) on delete cascade, -- null = template global
  category text not null check (category in ('joc', 'craft', 'tehnica_predare', 'altele')),
  title text not null,
  description text,
  file_url text,
  age_group text, -- '0-2', '3-5', '6-9', '10-12', 'toate'
  tags text[] not null default '{}',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.curriculum_lessons (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations (id) on delete cascade, -- null = template global
  age_group text not null,
  week_start_date date not null,
  title text not null,
  description text,
  materials_url text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.book_recommendations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations (id) on delete cascade, -- null = template global
  title text not null,
  author text,
  description text,
  cover_url text,
  link_url text,
  category text, -- 'parenting', 'discipol copii', 'echipare lideri', ...
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- SIM — Serviciu cu Impact Maxim (run-of-show duminical)
-- ─────────────────────────────────────────────────────────────
create table public.sim_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  service_date date not null,
  theme text,
  notes text,
  status text not null default 'planned' check (status in ('planned', 'done', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (org_id, service_date)
);

create table public.sim_slots (
  id uuid primary key default gen_random_uuid(),
  sim_session_id uuid not null references public.sim_sessions (id) on delete cascade,
  department text not null, -- 'receptie', 'predare', 'worship', 'security', ...
  age_group text,
  lesson_id uuid references public.curriculum_lessons (id) on delete set null,
  assigned_membership_id uuid references public.memberships (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- EVENIMENTE
-- ─────────────────────────────────────────────────────────────
create table public.events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  description text,
  location text,
  start_at timestamptz not null,
  end_at timestamptz,
  cover_url text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('going', 'maybe', 'not_going')),
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- ─────────────────────────────────────────────────────────────
-- PRAY WALL
-- ─────────────────────────────────────────────────────────────
create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  content text not null,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.prayer_prayed_for (
  id uuid primary key default gen_random_uuid(),
  prayer_request_id uuid not null references public.prayer_requests (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (prayer_request_id, user_id)
);

-- ─────────────────────────────────────────────────────────────
-- FEEDBACK
-- ─────────────────────────────────────────────────────────────
create table public.feedback_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  category text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'resolved')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- IMPLICĂ-TE
-- ─────────────────────────────────────────────────────────────
create table public.involvement_applications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  desired_role text not null,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- INDUCTION (progres onboarding)
-- ─────────────────────────────────────────────────────────────
create table public.induction_steps (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations (id) on delete cascade, -- null = template global
  title text not null,
  body text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.induction_progress (
  id uuid primary key default gen_random_uuid(),
  step_id uuid not null references public.induction_steps (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (step_id, user_id)
);
