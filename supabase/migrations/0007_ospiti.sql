-- 0007 · Albo d'oro: chi è salito sul palco a suonare o cantare con la band.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0002 (is_admin) e la 0003 (bucket "foto"). Si può rieseguire senza danni.

create table if not exists ospiti (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 80),          -- nome o soprannome
  cosa text check (char_length(cosa) <= 80),                               -- es. "armonica", "seconda voce su Battisti"
  quando text check (char_length(quando) <= 80),                           -- es. "Panificio, ottobre 2023"
  instagram text check (instagram is null or instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  foto_path text,                                                          -- nel bucket "foto", cartella ospiti/
  pubblicato boolean not null default true,
  created_at timestamptz not null default now()
);
alter table ospiti enable row level security;
drop policy if exists "pubblico legge ospiti pubblicati" on ospiti;
create policy "pubblico legge ospiti pubblicati" on ospiti for select to anon, authenticated
  using (pubblicato);
drop policy if exists "admin gestisce gli ospiti" on ospiti;
create policy "admin gestisce gli ospiti" on ospiti for all to authenticated
  using (is_admin()) with check (is_admin());
