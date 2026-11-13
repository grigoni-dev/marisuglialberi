-- 0010 · Merch (vetrina) e la categoria "Grafica e disegni" tra i collaboratori.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0002, la 0003 (bucket "foto") e la 0009 (collab). Si può rieseguire senza danni.

-- Graphic designers and illustrators join the collaborators, so merch can credit them.
alter table collab drop constraint if exists collab_categoria_check;
alter table collab add constraint collab_categoria_check
  check (categoria in ('dj', 'foto_video', 'musicisti', 'locali', 'grafica'));

-- ===========================================================================
-- Articoli. Niente vendita online: si ritira al prossimo live, si spedisce su richiesta.
-- prezzo null = "prezzo in arrivo"; taglie null = taglia unica.
-- ===========================================================================
create table if not exists merch (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 80),
  descrizione text check (char_length(descrizione) <= 400),
  prezzo numeric(6, 2) check (prezzo is null or prezzo >= 0),
  taglie text[],
  esaurito boolean not null default false,
  artista_id uuid references collab on delete set null,   -- chi ha disegnato la grafica
  ordine integer not null default 0,
  pubblicato boolean not null default true,
  created_at timestamptz not null default now()
);
alter table merch enable row level security;
drop policy if exists "pubblico legge merch pubblicato" on merch;
create policy "pubblico legge merch pubblicato" on merch for select to anon, authenticated
  using (pubblicato);
drop policy if exists "admin gestisce il merch" on merch;
create policy "admin gestisce il merch" on merch for all to authenticated
  using (is_admin()) with check (is_admin());

create table if not exists merch_foto (
  id uuid primary key default gen_random_uuid(),
  merch_id uuid not null references merch on delete cascade,
  path text not null,            -- nel bucket "foto", cartella merch/
  thumb_path text not null,
  width integer not null,
  height integer not null,
  ordine integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists merch_foto_merch_idx on merch_foto (merch_id, ordine, created_at);
alter table merch_foto enable row level security;
drop policy if exists "pubblico legge foto del merch pubblicato" on merch_foto;
create policy "pubblico legge foto del merch pubblicato" on merch_foto for select to anon, authenticated
  using (exists (select 1 from merch m where m.id = merch_id and m.pubblicato));
drop policy if exists "admin gestisce le foto del merch" on merch_foto;
create policy "admin gestisce le foto del merch" on merch_foto for all to authenticated
  using (is_admin()) with check (is_admin());

-- I primi quattro articoli, decisi dalla band il 13/11/2026 (solo se la tabella è vuota).
-- Descriptions and prices are left empty on purpose: the band fills them in from the panel.
insert into merch (nome, taglie, ordine)
select n, t, o from (values
  ('Berretto invernale stampato', null::text[], 1),
  ('Berretto invernale ricamato', null::text[], 2),
  ('T-shirt', array['S', 'M', 'L', 'XL'], 3),
  ('Felpa', array['S', 'M', 'L', 'XL'], 4)
) as v(n, t, o)
where not exists (select 1 from merch);
