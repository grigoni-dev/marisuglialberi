-- 0002 · Pannello admin e date dei concerti.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Si può rieseguire senza danni.

-- ===========================================================================
-- Chi può entrare nel pannello. Per ora un solo ruolo: admin.
-- Le righe si aggiungono a mano dal SQL Editor (vedi SETUP.md).
-- ===========================================================================
create table if not exists staff (
  user_id uuid primary key references auth.users on delete cascade,
  ruolo text not null default 'admin' check (ruolo in ('admin')),
  created_at timestamptz not null default now()
);
alter table staff enable row level security;

drop policy if exists "ognuno vede la propria riga" on staff;
create policy "ognuno vede la propria riga" on staff for select to authenticated
  using (user_id = auth.uid());

create or replace function is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff where user_id = auth.uid() and ruolo = 'admin');
$$;
revoke execute on function is_admin() from public, anon;
grant execute on function is_admin() to authenticated;

-- ===========================================================================
-- Date dei concerti. Il pubblico non legge questa tabella: legge la vista
-- concerti_pubblici qui sotto, che toglie locale, link e note alle feste private.
-- ===========================================================================
create table if not exists concerti (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  ora time,
  citta text not null check (char_length(citta) between 2 and 80),
  locale text check (char_length(locale) <= 120),
  link text check (link is null or link ~ '^https://'),
  privato boolean not null default false,
  pubblicato boolean not null default true,
  note text check (char_length(note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists concerti_data_idx on concerti (data);
alter table concerti enable row level security;

drop policy if exists "admin gestisce i concerti" on concerti;
create policy "admin gestisce i concerti" on concerti for all to authenticated
  using (is_admin()) with check (is_admin());

create or replace function tocca_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists concerti_updated_at on concerti;
create trigger concerti_updated_at before update on concerti
  for each row execute function tocca_updated_at();

-- What the public site may see. Owned by postgres, so it reads past RLS,
-- but only exposes published rows and never private details or notes.
create or replace view concerti_pubblici as
  select
    id,
    data,
    ora,
    citta,
    case when privato then null else locale end as locale,
    case when privato then null else link end as link,
    privato
  from concerti
  where pubblicato;
grant select on concerti_pubblici to anon, authenticated;

-- ===========================================================================
-- Richieste di ingaggio: l'admin le legge e ne cambia lo stato dal pannello.
-- ===========================================================================
drop policy if exists "admin legge le richieste" on richieste;
create policy "admin legge le richieste" on richieste for select to authenticated
  using (is_admin());
drop policy if exists "admin aggiorna le richieste" on richieste;
create policy "admin aggiorna le richieste" on richieste for update to authenticated
  using (is_admin()) with check (is_admin());
