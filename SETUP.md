# Messa online e gestione

Il sito gira su **Vercel**. I dati (richieste di ingaggio, e poi date e foto) stanno su **Supabase**. Le email delle richieste partono con **Resend**. Il codice è su GitHub: https://github.com/grigoni-dev/marisuglialberi.

Tutti gli account si creano con **la Gmail del progetto**, mai con la casella personale di qualcuno. Così il sito si può passare di mano.

Le chiavi segrete non si scrivono mai in chat né in un file che finisce su GitHub: vanno solo nel file `.env` sul proprio computer e nelle impostazioni di Vercel.

## 1. Supabase (database)

Servono **due progetti**, entrambi in **Europa, Irlanda** (`eu-west-1`):

- `marisuglialberi-dev`: per le prove, collegato al `.env` sul computer;
- `marisuglialberi-prod`: il sito pubblicato, collegato a Vercel.

Il piano gratuito permette due progetti per organizzazione. Un progetto senza attività va in pausa dopo una settimana: si riattiva dalla dashboard con *Restore*.

Per **ciascuno dei due** progetti:

1. supabase.com → *New project*. Organizzazione: quella del progetto. Nome come sopra. **Region: West EU (Ireland)**. Scegli una password del database e conservala (non serve al sito, ma serve a chi gestisce).
2. **SQL Editor** → *New query* → incolla tutto il file `supabase/migrations/0001_richieste.sql` → *Run*. Deve dire "Success. No rows returned". Si può rieseguire senza danni.
3. **Authentication → Sign In / Providers → Email**: disattiva *Allow new users to sign up*. Gli accessi al pannello li creeremo noi a mano.
4. **Project Settings → API Keys** (o *Data API*): servono tre valori.
   - *Project URL* → `PUBLIC_SUPABASE_URL`
   - chiave *anon* / *publishable* → `PUBLIC_SUPABASE_ANON_KEY`
   - chiave *service_role* / *secret* (segreta, non va mai nel browser) → `SUPABASE_SERVICE_ROLE_KEY`

   I valori di **dev** vanno nel file `.env` sul computer. Quelli di **prod** vanno su Vercel (passo 3).

### Migrazioni

Le migrazioni si eseguono a mano nel SQL Editor, in ordine, **prima su dev e poi su prod**. Se il codice nuovo usa una colonna nuova, la migrazione va eseguita su prod **prima** di pubblicare.

| File | Cosa fa | dev | prod |
|---|---|---|---|
| `0001_richieste.sql` | Richieste di ingaggio e limite di richieste | ✅ 12/11/2026 | ✅ 12/11/2026 |
| `0002_date_e_pannello.sql` | Pannello admin (`staff`), date dei concerti, vista pubblica `concerti_pubblici`, lettura delle richieste dal pannello | ✅ 12/11/2026 | ✅ 12/11/2026 |
| `0003_foto.sql` | Galleria foto (tabella `foto` e bucket `foto` nello Storage) | ✅ 12/11/2026 | ✅ 12/11/2026 |
| `0004_giorni_occupati.sql` | "Siamo liberi quella sera?": vista con i soli giorni occupati | ✅ 13/11/2026 | ✅ 13/11/2026 |
| `0005_frasi_e_testimonianze.sql` | Frasi celebri (con le prime 7) e testimonianze | ✅ 13/11/2026 | ✅ 13/11/2026 |
| `0006_mappa.sql` | Coordinate delle città per la mappa del giro (`lat`, `lng` e la vista pubblica aggiornata) | ✅ 13/11/2026 | ✅ 13/11/2026 |
| `0007_ospiti.sql` | Albo d'oro degli ospiti sul palco | ✅ 13/11/2026 | ✅ 13/11/2026 |
| `0008_pulizia.sql` | Pulizia automatica con `pg_cron`: limite di richieste dopo 1 ora, richieste dopo 2 anni | ✅ 13/11/2026 | ✅ 13/11/2026 |
| `0009_collab.sql` | Collaboratori (`collab`) e scelta del DJ nelle richieste (`dj_tipo`, `dj_collab`) | ✅ 13/11/2026 | ✅ 13/11/2026 |

## 2. Resend (email delle richieste)

1. resend.com → account con la Gmail del progetto → **API Keys** → *Create API key* (permesso *Sending access*) → `RESEND_API_KEY`.
2. `EMAIL_NOTIFICHE` = la Gmail del progetto: lì arrivano le richieste.
3. Finché non c'è un dominio, `EMAIL_FROM` resta `Mari sugli alberi <onboarding@resend.dev>`. In questo modo Resend consegna **solo** all'indirizzo con cui è stato creato l'account: per noi va bene, perché le notifiche arrivano proprio lì.
4. Il piano gratuito manda al massimo 100 email al giorno: per le richieste di ingaggio basta e avanza.

## 3. Vercel (il sito)

1. Sul computer: `vercel login` con la Gmail del progetto. Lo stesso account si usa su vercel.com.
2. vercel.com → *Add New → Project* → *Import Git Repository*. Si collega GitHub e si sceglie `grigoni-dev/marisuglialberi`. Il repository è pubblico apposta: con il piano gratuito, un repository privato si pubblica solo se i commit sono del proprietario dell'account Vercel.
3. Vercel riconosce Astro da solo. Prima di *Deploy*, apri **Environment Variables** e inserisci (con i valori di **prod**):
   - `SITE_URL` = `https://marisuglialberi.vercel.app`
   - `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_NOTIFICHE`
   - `RATE_LIMIT_SALT` = una stringa casuale lunga (per esempio da `openssl rand -hex 24`)
4. *Deploy*. Il nome del progetto su Vercel è `marisuglialberi`, così l'indirizzo diventa `marisuglialberi.vercel.app`.
5. Da qui in poi **ogni push su `main` pubblica il sito**.

Le funzioni del sito girano a Dublino (`regions: ["dub1"]` in `vercel.json`), vicino al database in Irlanda.

## Kit per chi organizza

I testi del kit (bio e scheda tecnica) stanno in `src/lib/kit.ts`; i file da scaricare in `public/kit/`. Se cambia la scheda tecnica:
1. si aggiorna `src/lib/kit.ts`;
2. si rigenera il PDF aprendo `/kit/rider` e stampandolo in PDF (A4, con lo sfondo) come `public/kit/rider-tecnico.pdf`;
3. si rifà lo ZIP: dentro `public/kit`, `zip -r -X mari-sugli-alberi-kit.zip rider-tecnico.pdf mari-sugli-alberi-logo-* foto`.

## Controllare la pulizia automatica

Nel SQL Editor di ciascun progetto: `select jobname, schedule, active from cron.job order by jobname;` deve mostrare `pulizia-limiti` (`17 * * * *`) e `pulizia-richieste` (`23 3 * * 0`), entrambi attivi.

## Statistiche

Le visite si contano con **Vercel Web Analytics**: niente cookie e nessun dato personale, quindi non serve il banner. Si attiva una volta sola: Vercel → progetto `marisuglialberi` → **Analytics** → **Enable**. I numeri si leggono nella stessa pagina. Il piano Hobby include un numero limitato di eventi al mese, che per un sito di band basta.

## 4. Prova completa

1. Apri il sito, vai in fondo alla home e manda una richiesta dal modulo "Portaci alla tua festa".
2. Deve comparire "Ricevuto!", deve arrivare l'email sulla Gmail del progetto, e su Supabase (prod) → *Table Editor* → `richieste` deve esserci una riga.
3. Poi cancella la riga di prova dal Table Editor.

## Sviluppo in locale

```sh
cp .env.example .env   # e riempi i valori del progetto dev
npx astro dev --background
```

Senza chiavi il sito funziona lo stesso: il modulo risponde "non ancora attivo".

## Gestire chi accede al pannello

Il pannello è su `/admin`. Per scelta della band c'è **un solo accesso condiviso**, con la Gmail del progetto. Va creato su **entrambi** i progetti Supabase (dev e prod).

**Creare l'accesso**
1. Supabase → **Authentication → Users → Add user → Create new user**: email = la Gmail del progetto, una password robusta, **Auto Confirm User** attivo.
2. **SQL Editor** → incolla ed esegui (al posto dell'indirizzo, la Gmail del progetto):
   ```sql
   insert into staff (user_id, ruolo)
   select id, 'admin' from auth.users where email = 'GMAIL-DEL-PROGETTO'
   on conflict (user_id) do nothing;
   ```
3. Su `/admin` si entra con quell'email e quella password.

**Vedere chi ha accesso**: `select u.email, s.ruolo from staff s join auth.users u on u.id = s.user_id;`

**Togliere l'accesso**: `delete from staff where user_id = (select id from auth.users where email = '…');`, poi si può eliminare l'utente da Authentication → Users.

**Password dimenticata**: Authentication → Users → l'utente → *Send password recovery*, oppure si imposta una password nuova dallo stesso menu.
