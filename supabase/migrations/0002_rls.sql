-- RLS — nimeni din afara rețelei nu are acces la nimic. Fără citire publică nicăieri.

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.invites enable row level security;
alter table public.org_chart_nodes enable row level security;
alter table public.procedures enable row level security;
alter table public.procedure_confirmations enable row level security;
alter table public.resources enable row level security;
alter table public.curriculum_lessons enable row level security;
alter table public.book_recommendations enable row level security;
alter table public.sim_sessions enable row level security;
alter table public.sim_slots enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.prayer_prayed_for enable row level security;
alter table public.feedback_items enable row level security;
alter table public.involvement_applications enable row level security;
alter table public.induction_steps enable row level security;
alter table public.induction_progress enable row level security;

-- organizations: vizibile doar membrilor lor + platform admin
create policy "org: members can read" on public.organizations
  for select using (public.is_org_member(id));
create policy "org: platform admin can manage" on public.organizations
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());

-- profiles: userul își vede propriul profil; colegii de organizație se văd între ei
create policy "profiles: self" on public.profiles
  for select using (id = auth.uid());
create policy "profiles: org peers" on public.profiles
  for select using (
    exists (
      select 1 from public.memberships m1
      join public.memberships m2 on m1.org_id = m2.org_id
      where m1.user_id = auth.uid() and m2.user_id = profiles.id and m1.status = 'active' and m2.status = 'active'
    )
  );
create policy "profiles: self update" on public.profiles
  for update using (id = auth.uid());

-- memberships: vizibile membrilor aceleiași organizații
create policy "memberships: org read" on public.memberships
  for select using (public.is_org_member(org_id));
create policy "memberships: org admin manage" on public.memberships
  for all using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

-- invites: doar adminii organizației (creare/vizualizare); codul e verificat server-side la acceptare
create policy "invites: org admin manage" on public.invites
  for all using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

-- org_chart_nodes
create policy "org_chart: org read" on public.org_chart_nodes
  for select using (public.is_org_member(org_id));
create policy "org_chart: org admin write" on public.org_chart_nodes
  for insert with check (public.is_org_admin(org_id));
create policy "org_chart: org admin update" on public.org_chart_nodes
  for update using (public.is_org_admin(org_id));
create policy "org_chart: org admin delete" on public.org_chart_nodes
  for delete using (public.is_org_admin(org_id));

-- conținut cu pattern global/local: template (org_id null) vizibil tuturor membrilor autentificați ai rețelei;
-- rândurile locale vizibile doar membrilor acelei organizații
create policy "procedures: read" on public.procedures
  for select using (org_id is null or public.is_org_member(org_id));
create policy "procedures: org admin write" on public.procedures
  for insert with check (org_id is not null and public.is_org_admin(org_id));
create policy "procedures: org admin update" on public.procedures
  for update using (org_id is not null and public.is_org_admin(org_id));
create policy "procedures: platform admin manage global" on public.procedures
  for all using (org_id is null and public.is_platform_admin()) with check (org_id is null and public.is_platform_admin());

create policy "procedure_confirmations: own" on public.procedure_confirmations
  for select using (user_id = auth.uid());
create policy "procedure_confirmations: org leaders read" on public.procedure_confirmations
  for select using (
    exists (
      select 1 from public.procedures p
      where p.id = procedure_id and p.org_id is not null and public.is_org_admin(p.org_id)
    )
  );
create policy "procedure_confirmations: self insert" on public.procedure_confirmations
  for insert with check (user_id = auth.uid());

create policy "resources: read" on public.resources
  for select using (org_id is null or public.is_org_member(org_id));
create policy "resources: org write" on public.resources
  for insert with check (org_id is not null and public.is_org_member(org_id));
create policy "resources: org admin update" on public.resources
  for update using (org_id is not null and public.is_org_admin(org_id));
create policy "resources: org admin delete" on public.resources
  for delete using (org_id is not null and public.is_org_admin(org_id));
create policy "resources: platform admin manage global" on public.resources
  for all using (org_id is null and public.is_platform_admin()) with check (org_id is null and public.is_platform_admin());

create policy "curriculum: read" on public.curriculum_lessons
  for select using (org_id is null or public.is_org_member(org_id));
create policy "curriculum: org admin write" on public.curriculum_lessons
  for insert with check (org_id is not null and public.is_org_admin(org_id));
create policy "curriculum: org admin update" on public.curriculum_lessons
  for update using (org_id is not null and public.is_org_admin(org_id));
create policy "curriculum: platform admin manage global" on public.curriculum_lessons
  for all using (org_id is null and public.is_platform_admin()) with check (org_id is null and public.is_platform_admin());

create policy "books: read" on public.book_recommendations
  for select using (org_id is null or public.is_org_member(org_id));
create policy "books: org admin write" on public.book_recommendations
  for insert with check (org_id is not null and public.is_org_admin(org_id));
create policy "books: platform admin manage global" on public.book_recommendations
  for all using (org_id is null and public.is_platform_admin()) with check (org_id is null and public.is_platform_admin());

-- SIM
create policy "sim_sessions: org read" on public.sim_sessions
  for select using (public.is_org_member(org_id));
create policy "sim_sessions: org admin manage" on public.sim_sessions
  for all using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create policy "sim_slots: org read" on public.sim_slots
  for select using (
    exists (select 1 from public.sim_sessions s where s.id = sim_session_id and public.is_org_member(s.org_id))
  );
create policy "sim_slots: org admin manage" on public.sim_slots
  for all using (
    exists (select 1 from public.sim_sessions s where s.id = sim_session_id and public.is_org_admin(s.org_id))
  ) with check (
    exists (select 1 from public.sim_sessions s where s.id = sim_session_id and public.is_org_admin(s.org_id))
  );

-- events
create policy "events: org read" on public.events
  for select using (public.is_org_member(org_id));
create policy "events: org admin manage" on public.events
  for all using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create policy "event_rsvps: org read" on public.event_rsvps
  for select using (
    exists (select 1 from public.events e where e.id = event_id and public.is_org_member(e.org_id))
  );
create policy "event_rsvps: self manage" on public.event_rsvps
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- prayer wall
create policy "prayer_requests: org read" on public.prayer_requests
  for select using (public.is_org_member(org_id));
create policy "prayer_requests: self insert" on public.prayer_requests
  for insert with check (org_id is not null and public.is_org_member(org_id) and (user_id = auth.uid() or user_id is null));
create policy "prayer_requests: self delete" on public.prayer_requests
  for delete using (user_id = auth.uid());

create policy "prayer_prayed_for: org read" on public.prayer_prayed_for
  for select using (
    exists (select 1 from public.prayer_requests r where r.id = prayer_request_id and public.is_org_member(r.org_id))
  );
create policy "prayer_prayed_for: self insert" on public.prayer_prayed_for
  for insert with check (user_id = auth.uid());

-- feedback
create policy "feedback: org admin read" on public.feedback_items
  for select using (public.is_org_admin(org_id));
create policy "feedback: self read" on public.feedback_items
  for select using (user_id = auth.uid());
create policy "feedback: member insert" on public.feedback_items
  for insert with check (public.is_org_member(org_id));
create policy "feedback: org admin update" on public.feedback_items
  for update using (public.is_org_admin(org_id));

-- involvement applications
create policy "involvement: self read" on public.involvement_applications
  for select using (user_id = auth.uid());
create policy "involvement: org admin read" on public.involvement_applications
  for select using (public.is_org_admin(org_id));
create policy "involvement: self insert" on public.involvement_applications
  for insert with check (user_id = auth.uid() and public.is_org_member(org_id));
create policy "involvement: org admin update" on public.involvement_applications
  for update using (public.is_org_admin(org_id));

-- induction
create policy "induction_steps: read" on public.induction_steps
  for select using (org_id is null or public.is_org_member(org_id));
create policy "induction_steps: org admin write" on public.induction_steps
  for insert with check (org_id is not null and public.is_org_admin(org_id));
create policy "induction_steps: platform admin manage global" on public.induction_steps
  for all using (org_id is null and public.is_platform_admin()) with check (org_id is null and public.is_platform_admin());

create policy "induction_progress: self" on public.induction_progress
  for select using (user_id = auth.uid());
create policy "induction_progress: self insert" on public.induction_progress
  for insert with check (user_id = auth.uid());
