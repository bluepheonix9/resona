-- Auto-create a public.profiles row for every new auth user.
--
-- Every profiles column except `id` has a sane default (empty strings, empty
-- array, 'beginner' skill), so a bare insert of the id is enough. The Profile
-- tab later UPDATEs this row via the existing upsert in src/lib/profileSync.ts.
--
-- SECURITY DEFINER + empty search_path is the Supabase-recommended pattern:
-- the function runs with the owner's privileges (bypassing the caller's RLS on
-- insert) and must therefore fully-qualify every object it touches.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- The function is only ever invoked by the trigger below (triggers do not
-- check EXECUTE), so revoke the default grant that would otherwise expose it as
-- a callable PostgREST RPC on a SECURITY DEFINER function.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: give existing auth users a profile row so none are orphaned.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;
