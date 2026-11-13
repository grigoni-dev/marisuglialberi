---
name: Mari sugli alberi
description: "Manifesto, ma cool": il sito è il retro di copertina di un 33 giri.
colors:
  carta: "#f3eee4"
  carta-2: "#e8e0d1"
  ink: "#111111"
  ink-2: "#3b3632"
  rosso: "#c8202a"
  rosso-scuro: "#9e151d"
  teal: "#1f6f6a"
  teal-scuro: "#16524e"
  teal-chiaro: "#cfe3df"
typography:
  display:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2.75rem, 2rem + 4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.6vw, 2.75rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  title:
    fontFamily: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "'Atkinson Hyperlegible Next Variable', system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "'Atkinson Hyperlegible Next Variable', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Atkinson Hyperlegible Next Variable', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    letterSpacing: "0.02em"
  small:
    fontFamily: "'Atkinson Hyperlegible Next Variable', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
rounded:
  none: "0"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "clamp(4rem, 3rem + 4vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.rosso}"
    textColor: "{colors.carta}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "58px"
  button-primary-hover:
    backgroundColor: "{colors.rosso-scuro}"
  button-primary-disabled:
    backgroundColor: "{colors.ink-2}"
  track-row:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "0 0.5rem"
    height: "52px"
  track-row-hover:
    backgroundColor: "{colors.carta-2}"
  track-row-pressed:
    backgroundColor: "{colors.rosso}"
    textColor: "{colors.carta}"
  choice-chip:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "48px"
  choice-chip-checked:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.carta}"
  input-field:
    backgroundColor: "{colors.carta-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
    height: "52px"
  search-field-side-b:
    backgroundColor: "{colors.teal-scuro}"
    textColor: "{colors.carta}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "56px"
---

# Design System: Mari sugli alberi

## Overview

**Creative North Star: "Manifesto, ma cool"**

Il sito è il retro di copertina di un disco a 33 giri. C'è una copertina quadrata con la foto della band. Accanto c'è la tracklist, che è già il modo per chiedere una data. Il resto della pagina segue il disco: Lato A per chi organizza una festa, le note di copertina per raccontare chi siamo, Lato B per chi viene ai concerti, e il retro con il modulo per prenotare.

Il materiale è quello di un manifesto stampato: fondo color carta, inchiostro nero, due colori pieni e niente altro. Tutto è piatto, con angoli vivi e filetti neri spessi. I titoli sono grandi, in maiuscolo e stretti, come il logo. Il testo è semplice e molto leggibile, perché si legge spesso dal telefono, in un locale buio e rumoroso.

Il movimento è poco. All'apertura la copertina esce dalla busta una volta sola; su computer esce anche il disco. Poi tutto sta fermo. Chi chiede meno movimento al sistema vede la pagina già ferma.

**Key Characteristics:**
- Fondo carta (`carta`), inchiostro nero (`ink`), rosso per agire, teal per le pause e il Lato B.
- Titoli in Schibsted Grotesk 900, maiuscolo, interlinea 0.9, lettere strette.
- Testo in Atkinson Hyperlegible Next, righe al massimo di 65 caratteri.
- Righe separate da filetti neri da 2px (`--filetto`), angoli sempre vivi.
- Codici A1, A2, B1… per numerare le parti, come i brani di un disco.
- Foto di giorno in bianco e nero, foto con le luci del palco a colori.

## Colors

Due colori pieni su carta e inchiostro: il rosso fa agire, il teal fa respirare.

### Primary
- **Rosso Luce di Scena** (`rosso`): il colore dell'azione. Lo usano il bottone, la voce "Portaci alla tua festa" nel menu, la riga scelta nella tracklist, il contorno di focus, la selezione del testo e il cursore nei campi. È anche il colore delle luci rosse sul palco.
- **Rosso Scuro** (`rosso-scuro`): il bottone quando ci passi sopra, i messaggi di errore, il fondo della copertina mentre la foto carica.

### Secondary
- **Teal Lato B** (`teal`): il colore delle pause. È il fondo di tutta la sezione Lato B. Fuori dal Lato B compare solo in piccolo, come nella scritta "Tocca e scegli".
- **Teal Scuro** (`teal-scuro`): il fondo del campo di ricerca nel Lato B e la barra di scorrimento delle foto.
- **Teal Chiaro** (`teal-chiaro`): testo secondario sul fondo teal (suggerimenti, nomi degli artisti nella scaletta).

### Neutral
- **Carta da Manifesto** (`carta`): il fondo di tutta la pagina. Anche il testo sopra i fondi scuri (rosso, teal, nero).
- **Carta Ingiallita** (`carta-2`): il fondo delle note di copertina, dei campi del modulo e delle righe quando ci passi sopra.
- **Inchiostro** (`ink`): testo, titoli, filetti, fondo del piè di pagina e della scelta attiva nel modulo.
- **Inchiostro Sbiadito** (`ink-2`): testo secondario, descrizioni, note piccole.

### Named Rules
**La Regola dei Due Colori.** Rosso e teal non sono mai tutti e due pieni nella stessa schermata. Se c'è un fondo teal, il rosso non c'è. Se c'è un blocco rosso, il teal resta piccolo (una parola, mai un fondo).

**La Regola del Rosso che Agisce.** Il rosso serve per fare qualcosa: chiedere una data, scegliere una festa. Non si usa come decorazione.

## Typography

**Display Font:** Schibsted Grotesk Variable (con Helvetica Neue, Arial)
**Body Font:** Atkinson Hyperlegible Next Variable (con system-ui)

**Character:** Un bastone nero pesantissimo, come le lettere di un manifesto, accanto a un testo pensato per essere letto da tutti, anche male illuminato.

### Hierarchy
- **Display** (900, `--t-xxl`, interlinea 0.9, maiuscolo): i grandi titoli di sezione, come "Lato A", "Note di copertina", "Portaci alla tua festa".
- **Headline** (900, `--t-xl`, interlinea 0.9, maiuscolo): i titoli dei formati (Bar/Osteria, Matrimonio, Aziendale, Salotto) e dei blocchi del Lato B.
- **Title** (900, misura dei brani, interlinea 1, maiuscolo): i nomi dei brani nella tracklist. Lo stesso carattere in maiuscolo serve anche per il bottone, le scelte del modulo e le voci dei crediti.
- **Lead** (700, `--t-l`, interlinea 1.3): la frase di apertura sotto la copertina e all'inizio delle sezioni.
- **Body** (400, `--t-m`, interlinea 1.5): il testo normale. Massimo 65 caratteri per riga.
- **Label** (700, `--t-s`, spaziatura 0.02em): i codici A1/B1, le etichette dei campi, il menu.
- **Small** (400, `--t-xs`): note sulla privacy e note del piè di pagina.

### Named Rules
**La Regola dell'Impilato.** I titoli sono sempre in maiuscolo, stretti (-0.04em) e con righe vicine (0.9), come il logo. Mai titoli in minuscolo o leggeri.

**La Regola del Codice in Riga.** I codici A1, B1, "Bonus track" stanno dentro il titolo, sulla stessa riga, prima del nome. Non stanno mai sopra il titolo come una scritta piccola a parte.

## Layout

Un'unica colonna larga al massimo 1240px (`--larghezza`), con un margine di 16px sul telefono e 32px da 768px in su (`--margine`).

Sul telefono tutto sta in una colonna: barra in alto, copertina quadrata a tutta larghezza, frase, tracklist e bottone rosso a tutta larghezza. Da 1024px la copertina va a sinistra e la tracklist con il bottone a destra, come sul retro di un disco. I tre formati del Lato A diventano tre colonne da 900px, separate da filetti verticali.

Lo spazio segue la scala da `s-1` a `s-8`. Tra una sezione e l'altra c'è sempre `s-8`. La barra in alto resta ferma mentre scorri, con un filetto sotto.

Le sezioni cambiano fondo come cambiano le facce del disco: carta per il Lato A, carta ingiallita per le note di copertina, teal pieno per il Lato B, carta per il retro, nero per il piè di pagina. Sul fondo teal i filetti diventano color carta.

Le foto del Lato B scorrono in orizzontale, una alla volta, e su schermi larghi partono allineate al bordo della colonna.

## Elevation & Depth

La pagina è piatta, come carta stampata. La profondità viene dai fondi pieni e dai filetti, non dalle ombre. Ci sono solo due ombre morbide, e servono a far sembrare reali gli oggetti del disco.

### Shadow Vocabulary
- **Ombra del disco** (`box-shadow: 0 10px 30px rgb(0 0 0 / 0.25)`): solo sotto il disco che esce dalla busta, su computer.
- **Ombra del nome in copertina** (`filter: drop-shadow(0 2px 14px rgb(0 0 0 / 0.35))`): solo dietro il nome della band sulla foto, per leggerlo meglio.

### Named Rules
**La Regola della Carta Piatta.** Bottoni, righe, campi e riquadri non hanno ombre. Si stacca una cosa dall'altra con un filetto o con un fondo pieno.

## Shapes

Angoli sempre vivi (0). L'unica forma rotonda è il disco. Le linee sono filetti neri da 2px (`--filetto`); dentro i crediti e le date si usa una linea più sottile da 1px. Le immagini hanno proporzioni fisse: copertina quadrata (1:1), foto delle note 4:3, foto del bonus 3:2, striscia di foto 4:5, video 16:9 (21:9 su schermi larghi). La freccia (`Freccia.astro`) è disegnata a mano con un tratto spesso, a punta quadrata, per stare insieme ai titoli. Il triangolo "play" è fatto con il CSS, non con un'icona.

## Components

### Buttons
Un solo bottone, deciso: un blocco rosso.
- **Shape:** angoli vivi (0), alto almeno 58px, testo a sinistra e freccia a destra.
- **Primary:** fondo `rosso`, testo `carta`, titolo in Schibsted 900 maiuscolo. Sul telefono è largo come lo schermo.
- **Hover / Focus:** il fondo diventa `rosso-scuro` e la freccia si sposta di 4px a destra. Quando lo premi scende di 2px. Il focus è un contorno rosso da 3px staccato di 3px.
- **Disabled:** fondo `ink-2` mentre il modulo si invia.
- **Link con freccia:** per le azioni secondarie si usa un link sottolineato in grassetto con la stessa freccia, mai un secondo bottone.

### Tracklist (componente firma)
La tracklist è il cuore del sito: scegli che festa è, e il modulo si compila da solo.
- **Righe:** ogni brano sta tra due filetti da 2px. Tre colonne: codice (A1), nome in maiuscolo, nota breve con un triangolino rosso.
- **Hover:** il fondo diventa `carta-2`.
- **Scelto:** la riga diventa rossa con il testo carta, e al posto del codice compare un triangolo "play".

### Chips (scelte del modulo)
- **Style:** riquadro con filetto da 2px, testo in Schibsted 900 maiuscolo, alto almeno 48px.
- **State:** hover con fondo `carta-2`; scelta attiva con fondo `ink` e testo `carta`.

### Spunta (checkbox)
Un quadrato di 28 px con il filetto nero. Quando è spuntato diventa nero con il segno di spunta disegnato in carta. L'etichetta è in grassetto e va a capo. Si usa per le aggiunte facoltative, come il DJ set dello zio.

### Inputs / Fields
- **Style:** fondo `carta-2`, solo un filetto sotto, angoli vivi, alti almeno 52px, cursore rosso.
- **Focus:** contorno rosso da 3px.
- **Error:** il filetto sotto diventa rosso e il messaggio è in `rosso-scuro`, in grassetto.
- **Nel Lato B:** il campo di ricerca ha fondo `teal-scuro`, bordo color carta e focus color carta.

### Navigation
Barra ferma in alto, fondo carta, filetto sotto. Logo MSA a sinistra (64px), voci in grassetto a destra. Passandoci sopra, sotto la voce cresce una riga da 2px. "Portaci alla tua festa" è l'unica voce rossa. Sotto i 1024px le voci lasciano il posto al tasto **"Menu"** (bordo nero, tre linee disegnate): apre un pannello a tutto schermo color carta, con una voce per riga tra filetti neri (nome in display maiuscolo, nota breve a destra), che diventa rossa al passaggio, e il bottone rosso "Portaci alla tua festa" in fondo. Si chiude con "Chiudi", con Esc o scegliendo una voce.

### Copertina
Foto quadrata con il logo "MARI / SUGLI / ALBERI" in carta in basso a sinistra. All'apertura sale di 14px in 900ms, una volta. Su computer, dietro, esce un disco nero con l'etichetta rossa e il logo, che ruota e scivola in 1400ms. Con il movimento ridotto tutto è già fermo.

### Immagini da ingrandire
- **Le immagini da ingrandire** (per ora il santino di Chambers) sono bottoni con il cursore a lente. Si aprono in un `<dialog>` nativo con il fondo carta, il filetto nero e il bottone "Chiudi". Il dialog si chiude anche con Esc o toccando fuori.

### Il fondo notte (pagina /link)
La pagina che si apre dal QR e dal link in bio usa il fondo `--ink`, con il testo in `--carta` e quello secondario in `--carta-tenue`. I filetti sono color carta. Le righe dei link seguono la grammatica della tracklist: icona, nome in display maiuscolo, nota a destra, freccia. Passandoci sopra diventano teal. Il motto è in `--t-xl`, con la seconda metà in rosso. Il bottone rosso resta quello di sempre. La colonna è larga al massimo 560 px, centrata. Il campo della ricerca usa `--ink-3`.

### Motto e slogan
- **Il motto** "Uno spettacolo non richiesto, ma che tutti vogliono." è l'unico momento tipografico della pagina. Sta in una fascia nera a tutta larghezza fra la copertina e il Lato A, in `--t-xxl`. La seconda metà della frase è in rosso.
- **"Meno male che domani è domenica."** chiude il sito nel piè di pagina, in `--t-xl`, seguito da "(Di solito è lunedì.)" in testo normale.
- Gli slogan si usano così come sono: non si inventano altri motti.

### Crediti della band
Nelle note di copertina, per ogni membro: il nome in display; poi, uno sotto l'altro, il soprannome in grassetto, lo strumento e il link a Instagram in teal.

### Foto
- **Bianco e nero (`.bn`):** le foto di giorno sono in bianco e nero con contrasto alto.
- **A colori:** le foto con le luci del palco (rosse, verdi) restano a colori, come la copertina.

## Do's and Don'ts

### Do:
- **Do** numerare le parti con codici da disco (A1, A2, B1…) dentro il titolo, sulla stessa riga.
- **Do** separare le righe con filetti da 2px (`--filetto`) e lasciare gli angoli vivi.
- **Do** usare il blocco rosso solo per l'azione principale: chiedere una data.
- **Do** mettere le foto di giorno in bianco e nero (`.bn`) e lasciare a colori quelle con le luci del palco.
- **Do** usare il teal come fondo del Lato B e il colore carta per testo e filetti sopra di esso.
- **Do** far muovere le cose una volta sola all'apertura, e lasciarle ferme con il movimento ridotto.

### Don't:
- **Don't** mettere rosso e teal tutti e due pieni nella stessa schermata.
- **Don't** mettere scritte piccole sopra i titoli (occhielli): il codice va nella stessa riga del titolo.
- **Don't** inventare frasi, citazioni o testimonianze. Si pubblicano solo cose vere, dette davvero.
- **Don't** arrotondare gli angoli o aggiungere ombre a bottoni, campi e riquadri.
- **Don't** usare icone fatte con caratteri o emoji: frecce e triangoli sono disegnati.
- **Don't** aggiungere un secondo stile di bottone: le azioni secondarie sono link sottolineati con la freccia.
