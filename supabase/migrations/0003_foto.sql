-- 0003 · Galleria foto (un'unica galleria, le più recenti in alto).
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0002 (is_admin). Si può rieseguire senza danni.

create table if not exists foto (
  id uuid primary key default gen_random_uuid(),
  path text not null,            -- versione grande nel bucket "foto"
  thumb_path text not null,      -- miniatura nel bucket "foto"
  width integer not null,
  height integer not null,
  thumb_width integer not null,
  thumb_height integer not null,
  alt text check (char_length(alt) <= 300),
  pubblicata boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists foto_created_at_idx on foto (created_at desc);
alter table foto enable row level security;

-- Il pubblico vede solo le foto pubblicate; l'admin vede e gestisce tutto
-- (anche quelle nascoste) con la policy "admin gestisce le foto" qui sotto.
-- Nota: qui non si chiama is_admin(), che il ruolo anon non può eseguire.
drop policy if exists "pubblico legge foto pubblicate" on foto;
create policy "pubblico legge foto pubblicate" on foto for select to anon, authenticated
  using (pubblicata);
drop policy if exists "admin gestisce le foto" on foto;
create policy "admin gestisce le foto" on foto for all to authenticated
  using (is_admin()) with check (is_admin());

-- Storage: bucket pubblico in lettura, scritto solo dall'admin. Massimo 10 MB a file,
-- ma il pannello ridimensiona prima di caricare (circa 300 KB + miniatura).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('foto', 'foto', true, 10485760, array['image/webp', 'image/jpeg'])
on conflict (id) do nothing;

drop policy if exists "admin carica foto" on storage.objects;
create policy "admin carica foto" on storage.objects for insert to authenticated
  with check (bucket_id = 'foto' and public.is_admin());
drop policy if exists "admin aggiorna foto" on storage.objects;
create policy "admin aggiorna foto" on storage.objects for update to authenticated
  using (bucket_id = 'foto' and public.is_admin());
drop policy if exists "admin cancella foto" on storage.objects;
create policy "admin cancella foto" on storage.objects for delete to authenticated
  using (bucket_id = 'foto' and public.is_admin());
