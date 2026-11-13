-- 0012 · La gara dei giochi va da un live al successivo (non più settimanale).
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0002 (concerti) e la 0011 (punteggi). Si può rieseguire senza danni.
--
-- A round opens when a public gig starts and closes when the next public gig starts
-- (its time, or 21:00 when it has none). Private parties don't count: the winner must be
-- able to come and collect the prize. Only dates shown on the site count.

create or replace function inizio_live(d date, o time)
returns timestamptz language sql immutable as $$
  select (d + coalesce(o, time '21:00')) at time zone 'Europe/Rome'
$$;

-- The rounds around now: the current one and the previous one, with the gig that closes each.
create or replace function gare()
returns table (gara text, inizio timestamptz, fine timestamptz, live_data date, live_citta text, live_locale text)
language sql stable security definer set search_path = public as $$
  with live as (
    select inizio_live(data, ora) as t, data, citta, locale
    from concerti
    where pubblicato and not privato
  ),
  passati as (select t, data, citta, locale, row_number() over (order by t desc) as n from live where t <= now()),
  prossimo as (select t, data, citta, locale from live where t > now() order by t limit 1)
  select 'corrente', (select t from passati where n = 1), p.t, p.data, p.citta, p.locale
  from (select 1) uno left join prossimo p on true
  union all
  select 'precedente', (select t from passati where n = 2), u.t, u.data, u.citta, u.locale
  from passati u where u.n = 1
$$;
grant execute on function gare() to anon, authenticated;

-- Best score per nickname for a game: in the current round ('gara'), the previous one
-- ('precedente', to know who won) or all time ('sempre').
drop function if exists classifica(text, boolean);
create or replace function classifica(p_gioco text, p_periodo text)
returns table (nome text, punti integer, personaggio text, quando timestamptz)
language sql stable security invoker set search_path = public as $$
  with g as (
    select coalesce(inizio, '-infinity'::timestamptz) as dal, coalesce(fine, 'infinity'::timestamptz) as al
    from gare() where gara = case p_periodo when 'precedente' then 'precedente' else 'corrente' end
  )
  select distinct on (lower(p.nome)) p.nome, p.punti, p.personaggio, p.created_at
  from punteggi p
  where p.gioco = p_gioco
    and (p_periodo = 'sempre' or exists (select 1 from g where p.created_at >= g.dal and p.created_at < g.al))
  order by lower(p.nome), p.punti desc, p.created_at asc
$$;
grant execute on function classifica(text, text) to anon, authenticated;
