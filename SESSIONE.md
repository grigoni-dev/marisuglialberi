# Diario di lavoro – sito Mari sugli alberi

## Dove siamo rimasti (12 novembre 2026, sera)

La prima versione della home è costruita: "Il retro del vinile", scelta fra tre bozze sulla pagina di decisione di Impeccable. Ci sono la copertina con la foto davanti al muro rosso e il logo, la tracklist Lato A che compila il modulo, i formati con la bonus track dello spettacolo a tema, le note di copertina, il Lato B (date, "fate anche…?" con ricerca nella scaletta, foto, segnaposto per il video) e il modulo "Portaci alla tua festa".
Il modulo ha la sua API (`/api/richiesta`) e la migrazione `0001_richieste.sql`. In locale risponde "non ancora attivo" perché Supabase e Resend non sono configurati.
Build e `astro check` passano. Il detector di Impeccable non trova problemi. La revisione finale di Impeccable ha chiesto 7 correzioni, tutte applicate e approvate (verdetto: ship). `DESIGN.md` e `.impeccable/design.json` sono scritti a partire dalla home costruita.

## Da qui si riparte

1. Ultima rilettura dei testi con la band: la frase sotto la copertina, Aziendale, la bonus track e la storia del panificio. Gli altri testi li ha già rivisti l'utente.
2. Confermare le regole del modulo in `LOGICHE.md`.
3. Supabase (dev e prod) e la migrazione `0001`; poi Resend. Vedi "Da fare".
4. Le altre feature di Fase 1 nell'ordine, ognuna con il ciclo di Impeccable e `DESIGN.md` come unica fonte di stile: link in bio (`/link`), date con il pannello admin, album foto, kit per gli organizzatori, statistiche.

## Scelte sui testi (12/11/2026)

- "Osteria" diventa "Bar/Osteria".
- Non si scrive "in tutta Italia" ma "dove vuoi tu": veniamo anche nel tuo salotto.
- Il salotto, cioè il concerto a casa, è un formato a sé (A4).
- Testi dei formati e delle note di copertina rivisti dall'utente; nei crediti ci sono i soprannomi e i link Instagram dei tre.
- La band è di quattro persone: c'è anche Chambers, «lo zio» (sul sito si chiama solo Chambers), fonico e service. È nei crediti (@chambers.marco). Fa anche il dj: nel Lato A c'è la "Bonus track 2: Concerto + DJ set" e nel modulo una spunta per aggiungerlo.
- Gli slogan sono il motto in fascia nera sotto la copertina ("Uno spettacolo non richiesto, ma che tutti vogliono") e "Meno male che domani è domenica" nel piè di pagina.
- Sopra la scaletta si legge "Impara quelle che facciamo già, per cantarle con noi", non "Tutte le 43 canzoni".

## Direzione grafica scelta (12/11/2026)

**"Manifesto, ma cool".** La direzione è stata scelta con Taste tra tre proposte; l'utente ha chiesto esplicitamente un sito *cool*.
- Fondo color carta `#F3EEE4`, inchiostro `#111111`. Rosso `#C8202A` (luci di scena, energia, azioni) e teal `#1F6F6A` (pause, frasi celebri), con un teal chiaro `#CFE3DF` per i fondi. Il rosso e il teal a piena forza non stanno mai nella stessa schermata.
- I titoli parlano come il logo: bastone nero pesantissimo, maiuscole, righe impilate e strette. Candidati: Schibsted Grotesk 900 per i titoli e Atkinson Hyperlegible Next per il testo.
- L'attitudine cool: foto in bianco e nero ad alto contrasto (quelle serali con le luci rosse e verdi restano a colori), poche parole, molto spazio. L'occhiolino è affidato alle frasi celebri, ai bollini e al "fate anche…?".
- La pagina "Stasera" (il QR durante il concerto) può avere il fondo scuro.
- Le direzioni scartate erano: "Osteria a tarda sera" (scura e calda), "Sugli alberi" (verde, elegante) e "Occhiali da sole" (tutto nero).

## La band (risposte del passo A)

- **Mari sugli alberi**: un trio. Giova suona la chitarra acustica ed è la prima voce, Celi suona la prima chitarra acustica ed è la seconda voce, Coraz suona percussioni e batteria.
- La band esiste da ottobre 2023, quando erano in due (Giova e Coraz). Il primo concerto è stato in un panificio: 4 ore di musica, con tanti ospiti saliti sul palco a suonare con loro.
- Il set è acustico ma molto energico e coinvolgente. Giocano con il pubblico e spesso bevono con lui. Lo spettacolo somiglia quasi a un cabaret.
- Il loro posto naturale sono le osterie. Hanno anche un "animo corporate": hanno già suonato a matrimoni ed eventi aziendali, e chi c'era è rimasto molto contento.
- **Repertorio**: cover, soprattutto in italiano. La scaletta arriverà.
- **Atmosfera**: gioviale, energica, autoironica. Interessanti, coinvolgenti, riconosciuti.
- **Cosa non devono sembrare**: saccenti, distaccati dal pubblico.
- **A cosa serve il sito**: è una vetrina, con foto, video, chi siamo, prossime date e merch. Soprattutto serve a **trovare nuovi ingaggi**.
- **Da dove arrivano le persone**: QR code e Instagram, quindi quasi sempre dal telefono.
- **Materiale che c'è già**: logo (forse da aggiornare insieme), foto, video, musica e profili social. I testi si scrivono insieme.
- **Dominio**: per ora nessuno. Il sito starà su `marisuglialberi.vercel.app`, e il dominio si potrà aggiungere più avanti.

## Feature: priorità e stato

Si fanno tutte. L'ordine dice cosa viene prima. Il numero tra parentesi è quello della proposta originale.

Stati: ⚪ da fare · 🟠 bloccata (manca materiale) · 🔵 in corso · ✅ fatta. Il 🔵 nella colonna "Peso" vuol dire invece "servizio esterno".
Peso: 🟢 statica · 🟡 con pannello · 🔵 servizio esterno

### Fase 1: prima uscita (il sito serve a trovare ingaggi)

| # | Feature | Peso | Stato | Cosa serve |
|---|---|---|---|---|
| 1 | "Portaci alla tua festa": modulo guidato con notifica sulla Gmail (3) | 🟡🔵 | 🔵 | Modulo e API fatti, nella home. Servizio email scelto: Resend. Mancano Supabase, Resend e la conferma di `LOGICHE.md` |
| 2 | Formati per gli eventi: bar/osteria, matrimonio, aziendale, salotto (9) | 🟢 | 🔵 | Nella home (Lato A), con la bonus track dello spettacolo a tema. Il salotto è stato aggiunto dall'utente il 12/11. Testi provvisori da rivedere con la band |
| 3 | Chi siamo: il trio e la storia del panificio (1) | 🟢 | 🔵 | Nella home (Note di copertina). Testo provvisorio da rivedere |
| 4 | Link in bio per Instagram e per i QR (6) | 🟢 | ⚪ | Instagram: https://www.instagram.com/marisuglialberi/ (YouTube non c'è ancora) |
| 5 | Prossime date con .ics e archivio (2) | 🟡 | ⚪ | Pannello admin. Elenco delle date, passate e future |
| 6 | Foto (album con visore) e video (4) | 🟡 | 🟠 | Foto e link dei video. Permesso per le foto del pubblico |
| 7 | Kit per gli organizzatori (11) | 🟢 | 🟠 | Foto in alta risoluzione, logo, bio, scheda tecnica |
| 8 | Anteprime per la condivisione, Open Graph (7) | 🟢 | 🔵 | Fatti i meta tag e `public/condivisione.jpg`. Da provare con un link vero dopo la messa online |
| 9 | Statistiche senza cookie (12) | 🟢 | ⚪ | Proposta: Vercel Web Analytics, gratis su Hobby |

### Fase 2: subito dopo

| # | Feature | Peso | Stato | Cosa serve |
|---|---|---|---|---|
| 10 | Repertorio con ricerca, "fate anche…?" (8) | 🟡 | 🔵 | Nella home (Lato B): ricerca e scaletta completa da `src/data/repertorio.json`. Manca la gestione dal pannello |
| 11 | Dicono di noi: testimonianze (10) | 🟡 | 🟠 | Testimonianze da matrimoni ed eventi aziendali, con il permesso di pubblicarle |
| 12 | "Siamo liberi quella sera?" nel booking (16) | 🟡 | ⚪ | Dipende da 1 e 5 |
| 13 | Merch con link PayPal (5) | 🟢🔵 | 🟠 | Elenco del merch, foto, prezzi, link PayPal |
| 14 | Le frasi celebri: cose dette dalla band o dai fan (19, aggiunta dall'utente) | 🟡 | 🟠 | Raccogliere le frasi, con chi le ha dette e il permesso dei fan. Possono comparire anche sparse nelle altre pagine |

### Fase 3: idee in più

| # | Feature | Peso | Stato | Cosa serve |
|---|---|---|---|---|
| 15 | "Stasera": richieste dal pubblico con classifica dal vivo (13) | 🟡 | ⚪ | Dipende da 10 |
| 16 | Mancia digitale via PayPal (18) | 🔵 | 🟠 | Link PayPal.me |
| 17 | Gli ospiti sul palco: albo d'oro (15) | 🟡 | 🟠 | Elenco degli ospiti, con il loro permesso |
| 18 | Il giro delle osterie: mappa (14) | 🟢 | 🟠 | Elenco dei posti dove avete suonato |
| 19 | "Avvisami quando suonate vicino a me" (17) | 🟡🔵 | ⚪ | Servizio email (lo stesso della 1) e regole privacy |

## Il tono della scaletta

Sono 43 cover, quasi tutte italiane, che vanno dagli anni Sessanta (Mina, Caselli, Pavone) all'indie di oggi (Fulminacci, Calcutta, Coma_Cose, Baustelle). In mezzo ci sono classici da cantare tutti insieme (Battisti, Rino Gaetano, Negrita) e scelte apertamente ironiche (Sex Bomb, Geghege, Maniac, Me so' 'mbriacato).
Ne viene fuori un tono da festa trasversale, che piace a più generazioni. Il pubblico canta, nessuno si prende troppo sul serio, e l'ironia è affettuosa, non snob. Per il sito questo vuol dire: popolare, caldo, un po' da balera e da osteria, e mai "cool" in modo distaccato.

Nella scaletta ho sistemato alcuni titoli. Da confermare con la band:
- "Me so imbriagato" è diventato "Me so' 'mbriacato".
- "Time of your life" è diventato "Good Riddance (Time of Your Life)".
- "Cuccuruccucù Paloma" è diventato "Cuccurucucù" (il titolo del brano di Battiato).

## Fatto

- Feature scelte e messe in ordine di priorità (12/11/2026).
- Scaletta salvata in `src/data/repertorio.json`.
- `PRODUCT.md` scritto con `/impeccable init` e confermato. Aggiunte le frasi celebri; la voce è "cool, ma mai distaccati".
- Logo e 14 foto caricati in `assets/` (esclusi da git).
- Direzione grafica scelta: "Manifesto, ma cool".
- Logo convertito in SVG (`src/assets/logo.svg`) dal PDF. Favicon rossa con il logo.
- `DESIGN.md` scritto da Impeccable a partire dalla home. Piccoli valori da trasformare in token: il fondo rosato degli errori `#f5e1dd` e il grigio della nota nel piè di pagina `#bdb6aa`.
- Home "Il retro del vinile" costruita, con il modulo e l'API (`src/pages/api/richiesta.ts`, `supabase/migrations/0001_richieste.sql`).
- Il logo si ricava dal PDF. Per le foto non serve il credito. Instagram: https://www.instagram.com/marisuglialberi/.
- Ossatura: Astro 7.4, `@astrojs/vercel`, `@supabase/supabase-js`, `env.schema`, `vercel.json` (`dub1`), `.env.example`, `.gitignore`, `CLAUDE.md`, `src/lib/supabase.ts`. Build e check passano.

- Installati Impeccable (plugin), Playwright MCP, la CLI di Vercel, awesome-design-md (in `~/Development/riferimenti/`) e Taste.
- `gh` ha il login come `grigoni-dev`.

## Da fare

- `vercel login` con l'account del progetto, quando si arriva alla messa online.
- Creare su Supabase i progetti `marisuglialberi-dev` e `marisuglialberi-prod`, in Europa (Irlanda).

## Materiale che manca

- Le frasi celebri della band e dei fan.
- Elenco delle date, passate e future.
- I video: per ora non c'è un canale YouTube. Al suo posto c'è un segnaposto.
- I testi, da scrivere insieme.
- I dati del titolare per la pagina privacy.
- Il permesso di pubblicare le foto del pubblico.

## Idee per dopo

Nessuna: tutte le feature sono in programma (vedi "Feature: priorità e stato").

## Archivio foto (originali in `assets/images/`)

**Già usate nella home:** WA0033 (copertina), WA0029 (risate, note di copertina), CAR04986 (nocche, bonus track), CAR04995 (completo b/n, video), `_aphafotografa_` -2/-5/-18/-34, WA0044, WA0020, CAR05378, `6030…771` (Giova che urla, fisheye), `6030…774` (il trio sul palco all'aperto), `6030…775` (Giova e Celi a letto, nel piè di pagina con "Meno male che domani è domenica").

**Da usare man mano:**
- `6030…769`: i tre in tenuta sportiva (fascia, guantoni da boxe, casacca) davanti agli alberi. Autoironica: va bene per la pagina Chi siamo, il kit stampa o un 404.
- `6030…777`: Celi sorride con gli occhiali da sole e la camicia rosa, all'aperto. È un ritratto: crediti, Chi siamo, kit.
- `6030…776`: Coraz sdraiato in una carriola. Per il ritratto di Coraz o una pagina d'errore.
- `CAR04983`, `CAR04997`: la posa da Blues Brothers. Per la pagina dello spettacolo a tema.
- `IMG-20240415-WA0006`: il selfie in cantina, per il link in bio.

**Con Chambers «lo zio»** (fonico, fa parte della band, quindi si possono usare):
- `6030…773`: Giova e lo zio urlano insieme, in fisheye. È già nella striscia "Dal vivo".
- `6030…772`: lo zio balla con il cappello in mezzo al pubblico. Per "Stasera" o per il suo ritratto; sullo sfondo c'è il pubblico.
- `6030…778`: lo zio vestito da arbitro fluo e Coraz in pelliccia e cappello, in uno spogliatoio. Per Chi siamo o per la pagina d'errore.

- `6030…779`: il santino di Chambers vestito da papa. È già nei crediti, in piccolo, dentro una cornice e ingrandibile.
- `6030…780`: disegno a mano "Del nostro peggio col poco che abbiamo". Non va nella home (scelta dell'utente); è per le pagine dedicate (date, kit). Le locandine della band sono sempre i tre stilizzati.
- `6030…781`: i tre eleganti appoggiati a una Lancia. Per la pagina dedicata al matrimonio, non per la home.
- Nella home i formati restano senza foto: le foto andranno nelle pagine dedicate a ciascun formato.

**Da usare solo con il permesso di chi c'è nella foto:**
- `IMG-20240528-WA0013`, `_aphafotografa_-153`: il pubblico.

## Note tecniche

- Le note riservate (account, soldi, piano Vercel) stanno in `NOTE-PRIVATE.md`, che è escluso da git perché il repository è pubblico.

- **Foto.** Gli originali stanno in `assets/images/` (fuori da git). Le versioni usate dal sito sono in `src/assets/foto/`, ridotte a 1800 px; Astro le converte in AVIF e WebP. Le foto di giorno sono mostrate in bianco e nero (classe `.bn`), quelle con le luci di scena a colori. Le foto del pubblico (`IMG-20240528-WA0013`, `_aphafotografa_-153`) per ora non si usano: manca il permesso.
- **Caratteri** ospitati in locale con Fontsource: Schibsted Grotesk (titoli) e Atkinson Hyperlegible Next (testo).
- **Dev server**: `npx astro dev --background`. Sul Mac la porta 4321 è spesso occupata da un altro progetto, quindi il server parte sulla 4322.

- Sul Mac c'è Node 25. Il progetto userà `engines: node 24.x` per Vercel.
