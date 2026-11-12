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
| `0001_richieste.sql` | Richieste di ingaggio e limite di richieste | | |

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
