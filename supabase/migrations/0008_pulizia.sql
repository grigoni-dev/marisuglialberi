-- 0008 · Pulizia automatica dei dati che la pagina /privacy promette di cancellare.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Si può rieseguire senza danni (cron.schedule con lo stesso nome aggiorna il job).

create extension if not exists pg_cron;

-- Ogni ora: le impronte del limite di richieste più vecchie di un'ora.
select cron.schedule('pulizia-limiti', '17 * * * *', $$
  delete from public.limiti where at < now() - interval '1 hour';
$$);

-- Ogni domenica notte: le richieste di ingaggio più vecchie di due anni.
select cron.schedule('pulizia-richieste', '23 3 * * 0', $$
  delete from public.richieste where created_at < now() - interval '2 years';
$$);
