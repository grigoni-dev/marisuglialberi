import type { APIRoute } from 'astro';
import { supabasePubblico, supabaseServizio } from '../../../lib/supabase';
import { entroIlLimite, impronta } from '../../../lib/limiti';
import { leggiGettone, nomeValido, punteggioMassimo } from '../../../lib/giochi/gettone';

export const prerender = false;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** Saves a finished game: checks the token, the name and that the score fits the time played. */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!supabasePubblico()) return json(503, { errore: 'non-attivo' });
  const corpo = await request.json().catch(() => null);
  if (!corpo) return json(400, { errore: 'formato' });

  const g = await leggiGettone(corpo.gettone);
  if (!g) return json(400, { errore: 'gettone' });
  const secondi = Math.round((Date.now() - g.inizio) / 1000);
  if (secondi < 3 || secondi > 7200) return json(400, { errore: 'durata' });

  const nome = nomeValido(String(corpo.nome ?? ''));
  if (!nome) return json(422, { errore: 'nome' });

  const punti = Math.floor(Number(corpo.punti));
  if (!Number.isFinite(punti) || punti < 0 || punti > punteggioMassimo(g.gioco, secondi)) return json(422, { errore: 'punti' });

  const personaggio = ['giova', 'celi', 'coraz'].includes(corpo.personaggio) ? corpo.personaggio : null;

  if (!(await entroIlLimite(`gioco:${await impronta(request, clientAddress)}`, 40, 3600))) return json(429, { errore: 'troppe' });

  const { error } = await supabaseServizio().from('punteggi').insert({ gioco: g.gioco, nome, punti, personaggio, durata_s: secondi });
  if (error) {
    console.error('punteggi', error);
    return json(502, { errore: 'salvataggio' });
  }
  return json(200, { ok: true });
};
