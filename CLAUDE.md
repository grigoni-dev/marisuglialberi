# Mari sugli alberi – sito della band

Sito del trio acustico Mari sugli alberi. Astro + Supabase + Vercel, costruito con la skill `/indie-website-setup`.

## Documenti

- `SESSIONE.md`: diario di lavoro. **A inizio sessione si riparte da "Da qui si riparte".** Contiene anche le feature in ordine di priorità, con il loro stato.
- `PRODUCT.md`: il progetto, il pubblico, la voce, le feature scelte.
- `DESIGN.md`: l'unica fonte per lo stile.
- `LOGICHE.md`: le regole di funzionamento confermate.
- `SETUP.md`: messa online e gestione.
- `src/data/repertorio.json`: la scaletta.

## Regole

- Il sito, i documenti e i commit sono in italiano. I commenti nel codice sono in inglese.
- Il repository è pubblico: niente segreti, `.env`, dati personali o note interne del gruppo.
- Il sito è statico di default. Le pagine con dati vivi usano `export const prerender = false`. Si manda meno JavaScript possibile e il CSS si scrive a mano, con le variabili.
- Il sito funziona anche senza chiavi: se manca un servizio, la pagina degrada con garbo (`NonConfigurato` in `src/lib/supabase.ts`).
- Il `.env` locale punta a Supabase **dev**. Le migrazioni si eseguono prima su dev, poi su prod, e su prod prima del push.
- Si progetta prima per il telefono: le persone arrivano da QR e Instagram.
- Prima di dire "fatto": `npm run build`, `npx astro check`, `/impeccable audit`, e gli screenshot con Playwright a 390 e 1440 px con la console senza errori.
- Commit e push solo quando l'utente lo chiede. Push su `main` = pubblicazione.
