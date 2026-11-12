---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Home

Mode: persuade. Visitor: chi organizza (osti, sposi, aziende), dal telefono. Azione: chiedere una data ("Portaci alla tua festa"). QR e Instagram vanno su /link, non qui.

Contenuto: copertina con foto dei tre (muro rosso, IMG-20240812-WA0033) a colori, nome impilato, nessun bollino; tracklist Lato A (A1 Osteria, A2 Matrimonio, A3 Aziendale); note di copertina (chi siamo, panificio, foto WA0029); formati (foto nocche CAR04986 per lo spettacolo a tema); Lato B (date o "arrivano presto", striscia foto, video segnaposto, "fate anche…?" verso il repertorio, frase celebre solo se vera); retro = modulo booking (tipo, data, luogo, persone, contatto). Niente testimonianze o frasi inventate.

Da evitare: band da matrimoni come tante, troppo seri, troppa roba, locale notturno.

Aperto: servizio email (Resend) si attiva alla messa online; le richieste si salvano su Supabase.

## Direction contract

THESIS: La home è il retro di copertina di un 33 giri. Rifiuta l'hero con headline, sottotitolo e bottone sopra una griglia di card: qui c'è una copertina quadrata e una tracklist che è già il modulo.

OWN-WORLD: Carta da manifesto #F3EEE4, inchiostro #111, rosso #C8202A per l'azione e le luci, teal #1F6F6A per le pause e il Lato B, teal chiaro #CFE3DF per i fondi. Titoli in bastone nero pesantissimo, maiuscolo, impilato e stretto come il logo. Righe di tracklist tra filetti neri da 2px, codici A1/B1 come numerazione dei brani, foto in b/n ad alto contrasto, tranne quelle con la luce rossa.

STORY: Capisco in un colpo d'occhio chi sono (tre ragazzi cool davanti a un muro rosso), che festa portano e che vengono ovunque. Scelgo il mio "brano" (che festa è), scorro il Lato A e il Lato B, e chiedo una data dal retro.

FIRST VIEWPORT: A 390 px: una barra con il wordmark MSA e il menu. Poi la copertina quadrata, a tutta larghezza meno il margine di 16 px, con la foto a colori e "MARI / SUGLI / ALBERI" impilato in carta in basso a sinistra. Sotto, una frase in grassetto, l'etichetta "Lato A · Che festa è?" e tre righe A1–A3. Il bottone rosso a tutta larghezza "Portaci alla tua festa →" chiude lo schermo. Su desktop la copertina sta a sinistra e la tracklist con il bottone a destra, come sul retro di un disco.

FORM: Il retro del vinile, numero 7 della mia lista, assegnato dal tiro. seed:afda9f41a9a0e203. Interazione firma: toccando un brano, la riga si accende (▶, fondo rosso) e il modulo nel retro si compila con quel tipo di festa. Movimento: all'apertura la copertina scivola fuori dalla busta una volta sola; il resto è fermo.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
