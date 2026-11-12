-- 0004 · "Siamo liberi quella sera?": i giorni già occupati, senza nessun dettaglio.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0002. Si può rieseguire senza danni.

-- Every day with a gig from today on, including private parties and dates not shown on
-- the site (they are busy all the same). Only the day leaves the database: no city,
-- venue, time or note. Owned by postgres, so it reads past RLS on purpose.
create or replace view giorni_occupati as
  select distinct data
  from concerti
  where data >= (now() at time zone 'Europe/Rome')::date;
grant select on giorni_occupati to anon, authenticated;
