-- 0009 · Collab (i collaboratori della band) e la scelta del DJ nel modulo.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0001, la 0002 (is_admin) e la 0003 (bucket "foto"). Si può rieseguire senza danni.

-- ===========================================================================
-- Collaboratori: DJ, fotografi e videomaker, altri musicisti, locali amici.
-- Pubblicati solo con il loro permesso.
-- ===========================================================================
create table if not exists collab (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('dj', 'foto_video', 'musicisti', 'locali')),
  nome text not null check (char_length(nome) between 2 and 80),
  descrizione text check (char_length(descrizione) <= 280),
  citta text check (char_length(citta) <= 80),
  instagram text check (instagram is null or instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  sito text check (sito is null or sito ~ '^https://'),
  foto_path text,                       -- nel bucket "foto", cartella collab/
  ordine integer not null default 0,
  pubblicato boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists collab_categoria_idx on collab (categoria, ordine, nome);
alter table collab enable row level security;
drop policy if exists "pubblico legge collab pubblicati" on collab;
create policy "pubblico legge collab pubblicati" on collab for select to anon, authenticated
  using (pubblicato);
drop policy if exists "admin gestisce i collab" on collab;
create policy "admin gestisce i collab" on collab for all to authenticated
  using (is_admin()) with check (is_admin());

-- ===========================================================================
-- Richieste: quale DJ si vuole dopo il concerto.
-- dj_tipo: null = nessun DJ, 'chambers' = il DJ set di Chambers,
-- 'collab' = un DJ dei collaboratori (dj_collab = il suo nome, oppure "consigliatemelo voi").
-- La colonna booleana dj resta: vale true quando c'è un DJ.
-- ===========================================================================
alter table richieste add column if not exists dj_tipo text check (dj_tipo in ('chambers', 'collab'));
alter table richieste add column if not exists dj_collab text check (char_length(dj_collab) <= 80);
