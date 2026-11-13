# Regole di funzionamento

Ogni regola va confermata dalla band. Accanto c'è la data della conferma; "da confermare" vuol dire che è una proposta.

## Modulo "Portaci alla tua festa" (in uso dal 12/11/2026)

- **Chi lo usa:** chiunque, senza registrarsi.
- **Cosa chiede:** che festa è (bar/osteria, matrimonio, aziendale, salotto, altra festa), dove, il nome e un contatto (email o telefono). La data, il numero di persone e il messaggio sono facoltativi. Con una spunta si può aggiungere il DJ set dello zio dopo il concerto.
- **Data:** può essere vuota ("non lo so ancora"). Se c'è, non può essere già passata.
- **Dove va la richiesta:** si salva nella tabella `richieste` su Supabase e arriva per email alla Gmail del progetto. Se l'email non parte, la richiesta resta comunque salvata; se il salvataggio non va, basta che parta l'email. Se non riesce nessuna delle due, chi scrive vede un errore e il suggerimento di scrivere su Instagram.
- **Rispondere:** risponde la band, a mano. Se il contatto è un'email, nella notifica basta premere "Rispondi".
- **Stato della richiesta:** nuova → risposta → confermata, oppure scartata. Si gestirà dal pannello admin.
- **Contro lo spam:** un campo nascosto che le persone non vedono, e al massimo 5 richieste all'ora dallo stesso indirizzo. L'indirizzo IP non si salva mai in chiaro, solo un'impronta con il sale.
- **Quanto teniamo i dati:** le richieste si cancellano dopo due anni (pulizia automatica con `pg_cron`, da attivare). I dati del limite di richieste si cancellano dopo un'ora.
- **Tracklist in home:** toccando "Bar/Osteria", "Matrimonio", "Aziendale" o "Salotto" sotto la copertina, nel modulo si seleziona quel tipo di festa. Si può cambiare sempre.

## Date dei concerti (12/11/2026, scelte dell'utente)

- **Chi le gestisce:** un unico accesso al pannello `/admin`, con la Gmail del progetto. Le registrazioni da fuori sono chiuse: l'account si crea a mano su Supabase (vedi `SETUP.md`).
- **Cosa c'è in una data:** giorno, ora (facoltativa), città, locale (facoltativo), link all'evento (facoltativo, per esempio il post Instagram), "festa privata" sì/no, "mostra sul sito" sì/no, note interne.
- **Feste private** (matrimoni, aziende, compleanni): sul sito si vedono la data, la città e la scritta "Festa privata". Il locale, il link e le note **non escono mai** dal database: il sito pubblico legge solo una vista che non li contiene.
- **"Mostra sul sito" spento:** la data resta solo nel pannello (per esempio una data ancora da confermare).
- **Le note interne** non si vedono mai sul sito.
- **Prossime e passate:** una data è "passata" dal giorno dopo. Le prossime stanno in home, in `/link` (la prima) e in cima a `/date`; le passate stanno nell'archivio di `/date`, anno per anno.
- **Aggiungi al calendario:** ogni data pubblica ha un file `.ics` (durata di 3 ore se c'è l'ora; giornata intera se non c'è).

## Richieste di ingaggio nel pannello (12/11/2026)

- Nel pannello si vedono tutte le richieste, le più recenti in alto, e se ne cambia lo stato: nuova → risposta → confermata, oppure scartata.

## Foto (12/11/2026, scelte dell'utente)

- **Un'unica galleria** su `/foto`, le più recenti in alto. Si carica dal pannello (scheda Foto), anche più foto alla volta.
- Le foto si **ridimensionano sul dispositivo** prima del caricamento: una versione grande (lato lungo 2048 px) e una miniatura (640 px), in WebP. Con il piano gratuito di Supabase (1 GB) ci stanno circa 3.000 foto.
- **Foto con il pubblico:** si pubblicano. Sotto la galleria c'è la nota "Ti riconosci in una foto e vuoi che la togliamo? Scrivici su Instagram". Dal pannello una foto si nasconde o si elimina con un tocco.
- **Scaricare:** nel visore c'è il tasto "Scarica".
- **Descrizione per chi non vede:** facoltativa al caricamento. Se manca, vale "Foto dal vivo di Mari sugli alberi".

## "Siamo liberi quella sera?" (13/11/2026)

- Nel modulo, appena si sceglie una data, il sito controlla se quel giorno c'è già un concerto. Contano tutti: quelli pubblici, le feste private e anche le date non mostrate sul sito.
- Se il giorno è libero il sito dice "Quella sera, per ora, siamo liberi". Se è occupato dice "Quella sera abbiamo già una data. Scrivici lo stesso: a volte ci si organizza". La richiesta si può mandare in entrambi i casi.
- Dal database esce solo il giorno, mai la città, il locale, l'ora o le note (vista `giorni_occupati`).

## Frasi celebri e testimonianze (13/11/2026)

- **Frasi celebri:** si gestiscono dal pannello (scheda Frasi). In home ne compare una alla volta, scelta a caso, con il tasto "Un'altra". Se "chi l'ha detta" è vuoto, la firma è "Mari sugli alberi". Le frasi dei fan si pubblicano solo con il loro permesso, oppure senza nome. Le prime 7 le ha date la band.
- **Testimonianze:** si gestiscono dal pannello (scheda Testimonianze): testo, chi, occasione. In home, nel Lato A, la sezione "Dicono di noi" **compare solo quando ce n'è almeno una pubblicata**: niente segnaposto e niente testimonianze inventate.

## Il giro delle osterie e la mancia (13/11/2026)

- **Mappa:** in `/date`, sotto l'archivio, compare la **zona dove abbiamo suonato** (la mappa si adatta da sola alle città, con una piccola Italia nell'angolo che mostra dov'è la zona), con un punto rosso per ogni città dei concerti **passati** (anche le feste private: della festa privata la città è già pubblica). Il punto è più grande se ci abbiamo suonato più volte. Il nome sta accanto al punto o, se non c'è spazio, un po' più in là con una lineetta; l'elenco accanto le contiene tutte.
- **Trasferte lontane:** la mappa grande inquadra le città entro 150 km dal centro dei concerti; quelle più lontane compaiono come pallini rossi sulla piccola Italia nell'angolo (e nell'elenco).
- **Nome della città:** la provincia, tra parentesi o dopo la virgola, non conta: "Motta di Livenza (TV)" e "Capannoli, Pisa" diventano "Motta di Livenza" e "Capannoli" sulla mappa.
- **Coordinate:** quando si salva una data, il pannello cerca la città su OpenStreetMap e salva latitudine e longitudine **della città**, mai l'indirizzo del locale. Se una città non si trova, la data si salva lo stesso e non compare sulla mappa; il tasto "Trova le posizioni" riprova per tutte.
- **Mancia:** in `/link` c'è "Offrici da bere", con il link PayPal.me scelto dalla band.

## Albo d'oro degli ospiti (13/11/2026)

- Chi è salito sul palco a suonare o cantare con la band. Si gestisce dal pannello (scheda Ospiti): nome o soprannome, cosa ha fatto, quando e dove, Instagram e foto, tutti facoltativi tranne il nome.
- **Solo con il permesso dell'ospite.** La foto è facoltativa e sul sito compare come un quadratino in bianco e nero; senza foto compare l'iniziale.
- Sul sito l'albo sta nelle note di copertina, sotto i crediti della band, e **resta nascosto finché non c'è almeno un ospite**.

## Privacy (13/11/2026)

- Titolare del trattamento: Giovanni Rigoni, per conto del gruppo (Mari sugli alberi è un gruppo informale; per la fatturazione si appoggia all'associazione Esibirsi, che non tratta i dati del sito). Il codice fiscale non si pubblica.
- Contatto per la privacy: la Gmail del progetto. Sulla pagina arriva dalla variabile `EMAIL_NOTIFICHE`, quindi non è scritta nel codice.
- La pulizia automatica (migrazione 0008, `pg_cron`) cancella le impronte del limite di richieste dopo un'ora e le richieste di ingaggio dopo due anni, come dice la pagina `/privacy`.
- Ogni nuova raccolta di dati (per esempio "Avvisami") va aggiunta alla pagina `/privacy` prima di andare online.

## Collab e scelta del DJ (13/11/2026)

- **Collab** (`/collab`): DJ, foto e video, altri musicisti, locali amici. Si gestiscono dal pannello (scheda Collab), solo con il loro permesso. Le categorie vuote non compaiono; se sono tutte vuote, la pagina dice "arrivano presto".
- **DJ nel modulo:** tre scelte. "No, grazie", "Il DJ set di Chambers" (per qualsiasi festa) e "Un DJ dei collaboratori", che compare **solo per matrimoni ed eventi aziendali** e solo se in Collab c'è almeno un DJ. Si può indicare quale, oppure "Consigliatemelo voi". La scelta arriva nell'email e nel pannello.

## Merch (13/11/2026, scelte dell'utente)

- La sezione si chiama **Merch** (`/merch`). È una vetrina, **non un negozio**: il sito non incassa e non raccoglie ordini.
- **Come si prende:** si ritira al prossimo live, al banchetto. La spedizione si fa su richiesta. Il bottone "Lo voglio" apre un messaggio Instagram alla band.
- **Articoli:** si gestiscono dal pannello (scheda Merch): nome, due righe, prezzo (vuoto = "Prezzo in arrivo"), taglie (vuoto = taglia unica), esaurito, ordine, mostra sul sito, e **più foto** per articolo (la prima è la copertina). Senza foto compare il riquadro "Foto in arrivo".
- **Credit:** ogni articolo può indicare chi ha disegnato la grafica, scelto tra i collaboratori. In Collab c'è la categoria **"Grafica e disegni"**, e il credit porta lì.
- Primi articoli (13/11/2026): berretto invernale stampato, berretto invernale ricamato, t-shirt, felpa. Prezzi e foto da inserire.

## Giochi e classifiche (13/11/2026)

- **Due giochi arcade in pixel art** su `/gioco`: "3 tequila sul palco, grazie" (`/gioco/tequila`) e "Arrivo comunque in ritardo" (`/gioco/ritardo`). Si gioca dal telefono con un dito, o da tastiera.
- **3 tequila:** si sceglie Giova, Celi o Coraz. Si beve quello che cade: birra 1 punto, spritz 2, tequila 5. Sveglia del lunedì, conto, multa e acqua tolgono una vita (5 vite). **Se si prende Chambers la partita finisce**; prima di cadere è annunciato da un punto esclamativo rosso. Ci si muove liberamente a destra e a sinistra (dito o frecce): il personaggio resta dove lo si lascia.
  - Giova, il frontman: per lui la tequila vale 10, ma la visiera del cappellino copre la vista: quello che gli cade proprio sopra la testa sparisce negli ultimi centimetri.
  - Celi: il più veloce, ma ogni 5 bevute va in bagno e resta fermo per circa 2 secondi.
  - Coraz: 6 vite, ma quando passa una ragazza che lo saluta va in tilt (comandi invertiti e tremolanti per circa 3 secondi).
  - **Livelli ogni 25 secondi**, annunciati a schermo: a ogni livello caduta più veloce, più cose da evitare, Chambers più frequente e con meno preavviso. Dal livello 3 il buttafuori cammina sul palco (toglie una vita e ti spinge via), dal 4 cadono due o tre cose insieme, dal 5 arrivano i bicchieri rotti a zig-zag.
- **In ritardo:** corre sempre Giova. Tocco = salto (tenuto = più alto), scorri giù o freccia giù = si abbassa. Si perde al primo ostacolo. Un punto per metro, 10 per ogni plettro. Le tappe sono annunciate a schermo e aggiungono ostacoli: la piazza (casse, cavi, custodie, piccioni bassi da saltare), dai 250 m la sagra (transenne e lucine: non saltare; piccioni anche alti), dai 600 m l'osteria (bottiglie lanciate: abbassarsi), dai 1000 m il palco (lo striscione "Ultima e poi andiamo": abbassarsi). Poi ogni 400 m un "Bis!", sempre più veloce.
- **Classifiche:** una per gioco, con il miglior punteggio per soprannome. **La gara va da un live al successivo**: si apre all'inizio di un live pubblico e si chiude all'inizio del live pubblico successivo (all'ora della data, o alle 21:00 se manca). Le feste private e le date nascoste non contano. Poi si riparte da zero da sola. C'è anche la classifica "di sempre". Solo un soprannome da 2 a 16 caratteri, con un filtro per le parolacce più comuni.
- **Contro chi bara:** la partita parte con un gettone firmato dal server, e un punteggio impossibile per il tempo giocato viene rifiutato. Al massimo 40 partite salvate all'ora dallo stesso indirizzo. Dal pannello (scheda Giochi) si tolgono soprannomi offensivi e punteggi sospetti.
- **Premio:** chi è primo quando la gara si chiude vince un gadget del merch e lo ritira a quel live. Sul sito e nel pannello (scheda Giochi) si vede chi ha vinto l'ultima gara.
