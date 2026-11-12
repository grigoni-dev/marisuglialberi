-- 0005 · Frasi celebri e testimonianze, gestite dal pannello.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0002 (is_admin). Si può rieseguire senza danni.

-- ===========================================================================
-- Frasi celebri: cose dette dalla band o dai fan. "chi" è facoltativo
-- (vuoto = la band). Quelle dei fan solo con il loro permesso, o senza nome.
-- ===========================================================================
create table if not exists frasi (
  id uuid primary key default gen_random_uuid(),
  testo text not null check (char_length(testo) between 2 and 280),
  chi text check (char_length(chi) <= 80),
  pubblicata boolean not null default true,
  created_at timestamptz not null default now()
);
alter table frasi enable row level security;
drop policy if exists "pubblico legge frasi pubblicate" on frasi;
create policy "pubblico legge frasi pubblicate" on frasi for select to anon, authenticated
  using (pubblicata);
drop policy if exists "admin gestisce le frasi" on frasi;
create policy "admin gestisce le frasi" on frasi for all to authenticated
  using (is_admin()) with check (is_admin());

-- Le prime frasi, date dalla band il 13/11/2026 (solo se la tabella è vuota).
insert into frasi (testo)
select t from (values
  ('Per fortuna che domani è domenica.'),
  ('L''intelligenza artificiale non ha ancora battuto la deficienza umana.'),
  ('Più la gente beve e più siamo bravi.'),
  ('Suoniamo meglio sobri: FALSO!'),
  ('Non ho problemi di orari, arrivo comunque in ritardo!'),
  ('È un progetto light.'),
  ('3 tequila sul palco, grazie.')
) as v(t)
where not exists (select 1 from frasi);

-- ===========================================================================
-- Testimonianze: parole vere di chi vi ha ingaggiato, con il loro permesso.
-- Restano nascoste sul sito finché non ce n'è almeno una pubblicata.
-- ===========================================================================
create table if not exists testimonianze (
  id uuid primary key default gen_random_uuid(),
  testo text not null check (char_length(testo) between 10 and 600),
  chi text not null check (char_length(chi) between 2 and 80),       -- es. "Giulia e Marco"
  occasione text check (char_length(occasione) <= 80),                -- es. "Matrimonio, giugno 2025"
  pubblicata boolean not null default true,
  created_at timestamptz not null default now()
);
alter table testimonianze enable row level security;
drop policy if exists "pubblico legge testimonianze pubblicate" on testimonianze;
create policy "pubblico legge testimonianze pubblicate" on testimonianze for select to anon, authenticated
  using (pubblicata);
drop policy if exists "admin gestisce le testimonianze" on testimonianze;
create policy "admin gestisce le testimonianze" on testimonianze for all to authenticated
  using (is_admin()) with check (is_admin());
