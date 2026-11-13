-- 0013 · Terzo gioco: "In Caddy fino in Toscana".
-- Si esegue nel SQL Editor di Supabase: prima sul progetto dev, poi su prod.
-- Richiede la 0011 (punteggi). Si può rieseguire senza danni.

-- The leaderboard accepts the new game.
alter table punteggi drop constraint if exists punteggi_gioco_check;
alter table punteggi add constraint punteggi_gioco_check check (gioco in ('tequila', 'ritardo', 'caddy'));
