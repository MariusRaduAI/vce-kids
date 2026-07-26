-- Evenimente exemplu pentru VK Bucuresti, din vk-team.com (calendarul 2026 original).
-- Nota: multe din aceste date sunt deja trecute fata de azi — sunt utile ca exemplu de structura,
-- nu ca si calendar curent. Le poti edita/sterge din Table Editor.

insert into public.events (org_id, title, description, start_at)
select id, 'Intalnire anuala Vertical Kids 2026', 'Recap viziune, reguli noi de siguranta, rugaciune, provocari, Q&A', '2026-02-15 10:00+02'
from public.organizations where slug = 'vk-bucuresti'
union all
select id, 'Mom''s Day Out / Dad''s Day In', 'Iesire mame fara copii + activitati tati & copii', '2026-03-07 10:00+02'
from public.organizations where slug = 'vk-bucuresti'
union all
select id, 'Inscrieri Scoala de Muzica Vertical Kids', null, '2026-04-19 10:00+03'
from public.organizations where slug = 'vk-bucuresti'
union all
select id, 'Kids Garage Sale', null, '2026-04-26 10:00+03'
from public.organizations where slug = 'vk-bucuresti'
union all
select id, 'Family Trip', 'Comana / Snagov', '2026-05-01 09:00+03'
from public.organizations where slug = 'vk-bucuresti'
union all
select id, 'Parenting Event', null, '2026-05-16 10:00+03'
from public.organizations where slug = 'vk-bucuresti'
union all
select id, 'Ziua Copilului', null, '2026-06-01 10:00+03'
from public.organizations where slug = 'vk-bucuresti'
union all
select id, 'Tabara de copii', null, '2026-07-08 09:00+03'
from public.organizations where slug = 'vk-bucuresti'
union all
select id, 'Dad''s Trip', null, '2026-08-07 09:00+03'
from public.organizations where slug = 'vk-bucuresti'
union all
select id, 'Retreat Kids', null, '2026-09-03 09:00+03'
from public.organizations where slug = 'vk-bucuresti';
