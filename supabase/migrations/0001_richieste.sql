-- 0001 · Richieste di ingaggio dal modulo "Portaci alla tua festa" e limite di richieste.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Si può rieseguire senza danni.

-- ===========================================================================
-- Limite di richieste per i moduli pubblici.
-- La chiave è un hash con sale dell'IP, mai l'IP in chiaro (src/lib/limiti.ts).
-- ===========================================================================
create table if not exists limiti (
  chiave text not null,
  at timestamptz not null default now()
);
create index if not exists limiti_chiave_at_idx on limiti (chiave, at);
alter table limiti enable row level security; -- nessuna policy: solo service role

create or replace function consuma_limite(p_chiave text, p_max integer, p_finestra_secondi integer)
returns boolean
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  select count(*) into n from limiti
   where chiave = p_chiave and at > now() - make_interval(secs => p_finestra_secondi);
  if n >= p_max then return false; end if;
  insert into limiti (chiave) values (p_chiave);
  return true;
end $$;
revoke execute on function consuma_limite(text, integer, integer) from public, anon, authenticated;

-- ===========================================================================
-- Richieste di ingaggio. Le scrive solo l'API del sito (service role);
-- il pubblico non le legge. La band le riceve per email e le vedrà nel pannello.
-- ===========================================================================
create table if not exists richieste (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('osteria', 'matrimonio', 'aziendale', 'salotto', 'altro')),
  data_evento date,
  luogo text not null check (char_length(luogo) between 2 and 120),
  persone integer check (persone between 1 and 5000),
  nome text not null check (char_length(nome) between 2 and 80),
  contatto text not null check (char_length(contatto) between 5 and 120),
  messaggio text check (char_length(messaggio) <= 2000),
  dj boolean not null default false, -- vuole anche il DJ set dello zio dopo il concerto
  stato text not null default 'nuova' check (stato in ('nuova', 'risposta', 'confermata', 'scartata')),
  email_inviata boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists richieste_created_at_idx on richieste (created_at desc);
alter table richieste enable row level security; -- nessuna policy: solo service role

-- Pulizia: i limiti servono per un'ora, le richieste scartate o chiuse da più di due anni si cancellano.
-- Richiede l'estensione pg_cron (Database > Extensions > pg_cron).
-- select cron.schedule('pulizia-limiti', '17 * * * *', $$delete from limiti where at < now() - interval '1 hour'$$);
-- select cron.schedule('pulizia-richieste', '23 3 * * 0', $$delete from richieste where created_at < now() - interval '2 years'$$);
