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
