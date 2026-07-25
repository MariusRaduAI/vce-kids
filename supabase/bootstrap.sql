-- Rulare unică, manuală, ca să pornești platforma. NU e o migrare automată.
--
-- Pas 1 — Dashboard → SQL Editor → rulează, în ordine:
--   supabase/migrations/0001_init.sql
--   supabase/migrations/0002_rls.sql
--
-- Pas 2 — Dashboard → Authentication → Users → Add user
--   Pune email-ul tău, bifează "Auto Confirm User". Copiază user id-ul generat.
--
-- Pas 3 — înlocuiește <USER_ID> mai jos și rulează în SQL Editor:

insert into public.organizations (name, slug, city, country)
values ('VK București', 'vk-bucuresti', 'București', 'RO');

update public.profiles
set is_platform_admin = true
where id = '<USER_ID>';

insert into public.memberships (org_id, user_id, role)
select id, '<USER_ID>', 'org_admin' from public.organizations where slug = 'vk-bucuresti';

-- Din acest punct: te loghezi pe vce-kids.vercel.app (sau localhost:3900) cu
-- emailul tău prin magic link, ajungi în /dashboard, și din /echipa poți
-- invita restul echipei — fără să mai atingi SQL-ul vreodată.
