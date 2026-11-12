import type { APIRoute } from 'astro';
import { supabasePubblico, supabaseServizio } from '../../lib/supabase';
import { destinatarioNotifiche, inviaEmail } from '../../lib/email';
import { entroIlLimite, impronta } from '../../lib/limiti';
import { TIPI, validaRichiesta, type Richiesta } from '../../lib/richiesta';

export const prerender = false;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Booking request from the "Portaci alla tua festa" form: saved in Supabase and mailed to the band. */
export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const vuoleJson = (request.headers.get('accept') || '').includes('application/json');
  const fine = (status: number, body: Record<string, unknown>) => {
    if (vuoleJson) return json(status, body);
    // No-JS fallback: back to the form, or on to the thank-you page.
    return redirect(status === 200 ? '/grazie' : `/?errore=${body.errore ?? 'invio'}#portaci`, 303);
  };

  let campi: Record<string, string>;
  try {
    const form = await request.formData();
    campi = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  } catch {
    return fine(400, { errore: 'formato' });
  }

  // Honeypot: real people leave it empty. Pretend success to bots.
  if (campi.sito_web) return fine(200, { ok: true });

  const esito = validaRichiesta(campi);
  if (!esito.ok) return fine(422, { errore: 'campi', campi: esito.errori });
  const r = esito.richiesta;

  const conDatabase = supabasePubblico() !== null;
  const destinatario = destinatarioNotifiche();
  if (!conDatabase && !destinatario) return fine(503, { errore: 'non-attivo' });

  if (conDatabase) {
    const ok = await entroIlLimite(`richiesta:${await impronta(request, clientAddress)}`, 5, 3600);
    if (!ok) return fine(429, { errore: 'troppe' });
  }

  let salvata: string | null = null;
  if (conDatabase) {
    const { data, error } = await supabaseServizio()
      .from('richieste')
      .insert({
        tipo: r.tipo,
        data_evento: r.data,
        luogo: r.luogo,
        persone: r.persone,
        nome: r.nome,
        contatto: r.contatto,
        messaggio: r.messaggio,
        dj: r.dj,
      })
      .select('id')
      .single();
    if (error) console.error('richieste insert', error);
    else salvata = data.id;
  }

  let inviata = false;
  if (destinatario) {
    try {
      await inviaEmail({
        to: destinatario,
        subject: `Nuova richiesta: ${TIPI[r.tipo]} a ${r.luogo}${r.data ? `, ${formattaData(r.data)}` : ''}`,
        text: testoEmail(r),
        replyTo: r.contatto.includes('@') ? r.contatto : undefined,
      });
      inviata = true;
    } catch (e) {
      console.error('email richiesta', e);
    }
  }

  if (salvata && inviata) {
    await supabaseServizio().from('richieste').update({ email_inviata: true }).eq('id', salvata);
  }

  if (!salvata && !inviata) return fine(502, { errore: 'invio' });
  return fine(200, { ok: true });
};

const formattaData = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function testoEmail(r: Richiesta): string {
  return [
    `Nuova richiesta dal sito.`,
    ``,
    `Che festa: ${TIPI[r.tipo]}`,
    `Quando: ${r.data ? formattaData(r.data) : 'da decidere'}`,
    `Dove: ${r.luogo}`,
    `Persone: ${r.persone ?? 'non indicato'}`,
    `DJ set dello zio: ${r.dj ? 'sì' : 'no'}`,
    `Chi: ${r.nome}`,
    `Contatto: ${r.contatto}`,
    ``,
    r.messaggio ? `Messaggio:\n${r.messaggio}` : 'Nessun messaggio.',
  ].join('\n');
}
