# Regole di funzionamento

Ogni regola va confermata dalla band. Accanto c'è la data della conferma; "da confermare" vuol dire che è una proposta.

## Modulo "Portaci alla tua festa" (da confermare)

- **Chi lo usa:** chiunque, senza registrarsi.
- **Cosa chiede:** che festa è (bar/osteria, matrimonio, aziendale, salotto, altra festa), dove, il nome e un contatto (email o telefono). La data, il numero di persone e il messaggio sono facoltativi. Con una spunta si può aggiungere il DJ set dello zio dopo il concerto.
- **Data:** può essere vuota ("non lo so ancora"). Se c'è, non può essere già passata.
- **Dove va la richiesta:** si salva nella tabella `richieste` su Supabase e arriva per email alla Gmail del progetto. Se l'email non parte, la richiesta resta comunque salvata; se il salvataggio non va, basta che parta l'email. Se non riesce nessuna delle due, chi scrive vede un errore e il suggerimento di scrivere su Instagram.
- **Rispondere:** risponde la band, a mano. Se il contatto è un'email, nella notifica basta premere "Rispondi".
- **Stato della richiesta:** nuova → risposta → confermata, oppure scartata. Si gestirà dal pannello admin.
- **Contro lo spam:** un campo nascosto che le persone non vedono, e al massimo 5 richieste all'ora dallo stesso indirizzo. L'indirizzo IP non si salva mai in chiaro, solo un'impronta con il sale.
- **Quanto teniamo i dati:** le richieste si cancellano dopo due anni (pulizia automatica con `pg_cron`, da attivare). I dati del limite di richieste si cancellano dopo un'ora.
- **Tracklist in home:** toccando "Bar/Osteria", "Matrimonio", "Aziendale" o "Salotto" sotto la copertina, nel modulo si seleziona quel tipo di festa. Si può cambiare sempre.
