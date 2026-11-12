# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, statico di default, con l'adattatore Vercel. Supabase (regione Europa, Irlanda) per i dati vivi e il pannello admin. CSS scritto a mano con variabili, meno JavaScript possibile, niente framework lato client se non servono davvero. Vedi `CLAUDE.md`.

## Users

- **Chi organizza eventi** (pubblico principale): gestori di osterie e locali, coppie che si sposano, aziende che preparano una festa o un evento. Vogliono capire in fretta se la band fa al caso loro, che atmosfera porta e come prenotarla. Il sito esiste soprattutto per loro: **serve a trovare nuovi ingaggi**.
- **Il pubblico e i fan**: arrivano da un QR code a un concerto o dal profilo Instagram, quasi sempre dal telefono, spesso la sera stessa. Cercano le prossime date, le foto e i video, il merch, e vogliono sentirsi parte della festa.

## Product Purpose

È la vetrina della band: chi siamo, prossime date, foto e video, merch. Lo scopo principale è **trasformare chi ci ha visto, o ha sentito parlare di noi, in un nuovo ingaggio**. Ha successo se arrivano richieste di booking dal modulo e se gli organizzatori trovano da soli quello che serve per decidere (formati, repertorio, kit, testimonianze).

## Positioning

Mari sugli alberi è un trio acustico di cover, quasi tutte italiane, con uno spettacolo che somiglia a un cabaret. Si gioca con il pubblico, si brinda con lui e si invitano gli ospiti a salire sul palco. Il primo concerto, in un panificio, è durato quattro ore, con tanti ospiti a suonare.

Cosa li distingue:
1. **Lo spettacolo con il pubblico.** Non suonano soltanto: coinvolgono, giocano, bevono con la gente.
2. **Un repertorio per tutte le età.** Da Mina, Caselli e Rita Pavone a Fulminacci, Calcutta e Coma_Cose: i nonni e i ventenni cantano insieme.
3. **Chi li ha visto li richiama.** Gli osti, le coppie e le aziende per cui hanno già suonato ne sono rimasti molto contenti.

## Operating Context

- Si arriva da un QR code durante o dopo un concerto, o dal "link in bio" di Instagram: quasi sempre dal telefono, spesso in un locale rumoroso e poco illuminato.
- Il posto naturale della band sono le osterie, ma suona anche a matrimoni ed eventi aziendali.
- **Suona dove vuoi tu**, anche in un salotto di casa. Sul sito non si dice "in tutta Italia" ma "dove vuoi tu". La trasferta si concorda caso per caso.
- I pagamenti (merch, mance) passano da un servizio esterno, per ora PayPal: il sito non incassa direttamente.
- Il sito lo gestiscono i membri della band dal pannello admin: date, foto, repertorio, testimonianze.

## Capabilities and Constraints

Tutte le 19 feature sono in programma. L'ordine e lo stato sono in `SESSIONE.md`, sezione "Feature: priorità e stato".

**Fase 1, prima uscita:**
1. Ingaggiaci: modulo guidato (tipo di evento, data, luogo, persone), con notifica sulla Gmail del progetto.
2. Formati per gli eventi: bar/osteria, matrimonio, aziendale, salotto (il concerto a casa), più lo spettacolo a tema su richiesta.
3. Chi siamo: il trio e la storia del panificio.
4. Link in bio per Instagram e per i QR.
5. Prossime date con "aggiungi al calendario" (.ics) e archivio dei concerti passati.
6. Foto (album con visore) e video incorporati.
7. Kit per gli organizzatori: foto in alta risoluzione, logo, bio, scheda tecnica.
8. Anteprime curate quando il link si condivide (Open Graph).
9. Statistiche senza cookie.

**Fase 2:** repertorio con ricerca ("fate anche…?"), testimonianze, le frasi celebri (cose dette dalla band o dai fan, durante i concerti e non solo, con chi l'ha detta), "siamo liberi quella sera?" nel booking, merch con link PayPal.

**Fase 3:** "Stasera" (richieste delle canzoni dal pubblico con classifica dal vivo), mancia via PayPal, albo d'oro degli ospiti sul palco, mappa delle osterie, "avvisami quando suonate vicino a me".

Vincoli:
- Si parte con Vercel Hobby, senza dominio: `marisuglialberi.vercel.app`.
- Il repository è pubblico: niente dati personali né note interne nei file versionati.
- Il sito deve funzionare anche se un servizio non è ancora configurato.
- Ancora da decidere: il servizio email per le notifiche del booking.

## Brand Commitments

- **Nome:** Mari sugli alberi.
- **Formazione:** Giova (chitarra acustica, prima voce), Celi (prima chitarra acustica, seconda voce), Coraz (percussioni e batteria). La band esiste da ottobre 2023, quando erano in due (Giova e Coraz).
- **Voce:** scrive la band, in prima persona plurale ("noi"), e dà del tu a tutti, anche alle aziende e agli sposi. È calda, diretta e autoironica, come sul palco.
- **Atmosfera:** gioviale, energica, autoironica. Interessanti, coinvolgenti, riconosciuti.
- **Cool, ma mai distaccati.** La posa (occhiali da sole, completi neri, i Blues Brothers) è un gioco che fanno con il pubblico, non un muro: poi scendono a brindare. Non devono mai sembrare saccenti, né usare il linguaggio aziendale, nemmeno nelle pagine per le aziende.
- **Slogan della band:** "Uno spettacolo non richiesto, ma che tutti vogliono" li rappresenta. "Meno male che domani è domenica" racconta il suonare la domenica sera sperando che il giorno dopo sia ancora domenica, quando invece è lunedì e si lavora.
- **La band è di quattro persone:** tre sul palco più Chambers, «lo zio» (@chambers.marco). Sul sito si chiama sempre Chambers, mai con il nome di battesimo. Fa il fonico, il service e il dj: spesso la band si propone in coppia, concerto più DJ set. Segue ogni data ed è il più responsabile della band: tiene a freno le marachelle degli altri. Sul palco però sono un trio.
- **I membri e i loro soprannomi:** Giova "buongiornista" (@giorigoni), Celi "primo scalettista" (@f.c.elia), Coraz "manager delle pentole" (@matteo_coraz_corazza). Gli indirizzi Instagram si pubblicano su richiesta della band.
- **Illustrazioni:** le locandine della band sono sempre i tre disegnati a mano, stilizzati, a pennarello nero. Nella home non vanno: troveranno posto nelle pagine dedicate (date, kit). Sul sito i disegni si usano così come sono, senza ridisegnarli né imitarli.
- **Logo:** si tiene. È un blocco nero di maiuscole bastone pesantissime, impilate e strette ("MARI / SUGLI / ALBERI"). L'originale è in `assets/docs/LOGO_MSA.pdf` (fuori da git). Servono le varianti in negativo e una compatta "MSA" per l'icona del sito.
- **Colori della band:** rosso e teal, presi dalle luci di scena e dal portone verde-acqua delle foto. Il nero è la base, come le magliette e i completi.

## Evidence on Hand

- La scaletta: 43 cover, in `src/data/repertorio.json`.
- Le frasi celebri della band e dei fan: esistono, ma vanno raccolte. Si pubblicano solo frasi vere, e quelle dei fan solo con il loro permesso (o senza nome).
- La storia del primo concerto nel panificio: quattro ore, con tanti ospiti sul palco.
- 14 foto in `assets/images/` (fuori da git, originali pesanti): concerti all'aperto sotto gli alberi, serate in osteria con luci rosse e verdi, il pubblico attaccato al palco, la posa in completo nero e cappello.
- Instagram: https://www.instagram.com/marisuglialberi/.
- Spotify, profilo artista: https://open.spotify.com/artist/03b8QmCN0Z7MMAYlQXRnoC. Per ora non c'è un canale YouTube: i video hanno un segnaposto.
- **Non ci sono ancora** testimonianze scritte, l'elenco delle date, la scheda tecnica, il merch né gli indirizzi social. Non vanno inventati: finché mancano, le sezioni restano vuote o dicono "in arrivo".
- Manca il permesso di pubblicare le foto del pubblico.

## Product Principles

1. **Ogni pagina porta al booking.** Chi organizza un evento deve poter chiedere una data da qualsiasi pagina, in pochi tocchi, dal telefono.
2. **Far sentire la festa, non descriverla.** Foto, video, repertorio e storie vere valgono più degli aggettivi.
3. **Dalla parte del pubblico.** Il sito parla come la band sul palco: vicino, ironico, mai dall'alto.
4. **Prima il telefono, in una sala rumorosa.** Le cose si leggono al volo, con il pollice e con poca luce.
5. **Niente di finto.** Niente testimonianze, numeri o date inventati: se manca il materiale, la sezione aspetta.

## Accessibility & Inclusion

Obiettivo WCAG 2.2 AA. Il pubblico va da chi ha vent'anni ai nonni, quindi testo leggibile, buon contrasto anche con poca luce, bersagli comodi per il pollice, e rispetto di `prefers-reduced-motion`.
