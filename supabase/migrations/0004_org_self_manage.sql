-- Org admin poate sa isi gestioneze propria biserica (nume, oras, tara, curriculum),
-- dar nu poate schimba biserica mentora sau statusul — alea raman doar la super-admin.

create policy "org: org admin update own" on public.organizations
  for update using (public.is_org_admin(id)) with check (public.is_org_admin(id));

create function public.protect_org_admin_only_fields()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    new.mentor_org_id := old.mentor_org_id;
    new.status := old.status;
  end if;
  return new;
end;
$$;

create trigger protect_org_admin_only_fields
  before update on public.organizations
  for each row execute procedure public.protect_org_admin_only_fields();
