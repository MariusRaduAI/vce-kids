-- Ordinea activitatilor in SIM (Serviciu cu Impact Maxim)
alter table public.sim_slots add column sort_order int not null default 0;
