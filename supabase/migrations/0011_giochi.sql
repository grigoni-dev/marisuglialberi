-- 0011 · Giochi arcade e classifiche.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0001 (limiti) e la 0002 (is_admin). Si può rieseguire senza danni.

-- One row per finished game. Only the API writes here (service role), after checking
-- the start token and that the score is plausible for the time played.
create table if not exists punteggi (
  id uuid primary key default gen_random_uuid(),
  gioco text not null check (gioco in ('tequila', 'ritardo')),
  nome text not null check (char_length(nome) between 2 and 16),
  punti integer not null check (punti between 0 and 1000000),
  personaggio text check (personaggio in ('giova', 'celi', 'coraz')),
  durata_s integer not null check (durata_s between 1 and 7200),
  created_at timestamptz not null default now()
);
create index if not exists punteggi_gioco_punti_idx on punteggi (gioco, punti desc);
create index if not exists punteggi_gioco_data_idx on punteggi (gioco, created_at desc);
alter table punteggi enable row level security;

-- Everyone can read the leaderboards; only the admin can delete (offensive names, cheats).
drop policy if exists "pubblico legge i punteggi" on punteggi;
create policy "pubblico legge i punteggi" on punteggi for select to anon, authenticated using (true);
drop policy if exists "admin cancella i punteggi" on punteggi;
create policy "admin cancella i punteggi" on punteggi for delete to authenticated using (is_admin());

-- Best score per name, all time and this week (the week starts on Monday, Italian time).
drop function if exists classifica(text, boolean, integer);
create or replace function classifica(p_gioco text, p_settimana boolean)
returns table (nome text, punti integer, personaggio text, quando timestamptz)
language sql stable security invoker set search_path = public as $$
  select distinct on (lower(nome)) nome, punti, personaggio, created_at
  from punteggi
  where gioco = p_gioco
    and (not p_settimana or created_at >= date_trunc('week', now() at time zone 'Europe/Rome') at time zone 'Europe/Rome')
  order by lower(nome), punti desc, created_at asc
$$;
-- (the outer ordering and limit are applied by the caller through PostgREST: order=punti.desc&limit=10)
grant execute on function classifica(text, boolean) to anon, authenticated;
