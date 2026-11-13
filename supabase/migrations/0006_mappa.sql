-- 0006 · Il giro delle osterie: la posizione di ogni data, per la mappa.
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0002. Si può rieseguire senza danni.

-- Latitude and longitude of the city, filled in by the panel when a date is saved
-- (looked up on OpenStreetMap from the city name). Never the venue's exact address.
alter table concerti add column if not exists lat double precision check (lat between -90 and 90);
alter table concerti add column if not exists lng double precision check (lng between -180 and 180);

-- Same public view as in 0002, with the city coordinates appended at the end.
create or replace view concerti_pubblici as
  select
    id,
    data,
    ora,
    citta,
    case when privato then null else locale end as locale,
    case when privato then null else link end as link,
    privato,
    lat,
    lng
  from concerti
  where pubblicato;
grant select on concerti_pubblici to anon, authenticated;
