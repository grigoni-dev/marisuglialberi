// Browser side of the games: start token, score submission, leaderboards, remembered nickname.
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from 'astro:env/client';

export type Gioco = 'tequila' | 'ritardo';
export type Riga = { nome: string; punti: number; personaggio: string | null };

export async function iniziaPartita(gioco: Gioco): Promise<string | null> {
  try {
    const r = await fetch('/api/gioco/inizio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gioco }) });
    return r.ok ? (await r.json()).gettone : null;
  } catch {
    return null;
  }
}

export async function inviaPunteggio(d: { gettone: string; nome: string; punti: number; personaggio?: string }) {
  try {
    const r = await fetch('/api/gioco/punteggio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
    const body = await r.json().catch(() => ({}));
    return r.ok ? { ok: true as const } : { ok: false as const, errore: String(body.errore ?? 'invio') };
  } catch {
    return { ok: false as const, errore: 'rete' };
  }
}

export async function classifica(gioco: Gioco, settimana: boolean, quanti = 10): Promise<Riga[]> {
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return [];
  try {
    const url = `${PUBLIC_SUPABASE_URL}/rest/v1/rpc/classifica?p_gioco=${gioco}&p_settimana=${settimana}&order=punti.desc,quando.asc&limit=${quanti}`;
    const r = await fetch(url, { headers: { apikey: PUBLIC_SUPABASE_ANON_KEY } });
    return r.ok ? await r.json() : [];
  } catch {
    return [];
  }
}

const CHIAVE = 'msa-soprannome';
export const nomeSalvato = () => { try { return localStorage.getItem(CHIAVE) ?? ''; } catch { return ''; } };
export const salvaNome = (n: string) => { try { localStorage.setItem(CHIAVE, n); } catch { /* private mode */ } };

export const MESSAGGI_ERRORE: Record<string, string> = {
  nome: 'Soprannome non valido: da 2 a 16 caratteri, niente parolacce.',
  punti: 'Questo punteggio non ci torna. Gioca pulito!',
  durata: 'Partita troppo corta per entrare in classifica.',
  troppe: 'Troppe partite di fila: riprova tra un po\'.',
  'non-attivo': 'La classifica non è ancora attiva.',
  rete: 'Manca la connessione: riprova.',
};

/** Fills a leaderboard list (ol) with rows. */
export function disegnaClassifica(ol: HTMLElement, righe: Riga[], unita: string, evidenzia?: string) {
  ol.replaceChildren();
  if (!righe.length) {
    ol.append(Object.assign(document.createElement('li'), { className: 'vuota', textContent: 'Nessuno ancora: il primo posto è libero.' }));
    return;
  }
  righe.forEach((r, i) => {
    const li = document.createElement('li');
    if (evidenzia && r.nome.toLowerCase() === evidenzia.toLowerCase()) li.className = 'tu';
    li.append(
      Object.assign(document.createElement('span'), { className: 'pos', textContent: String(i + 1) }),
      Object.assign(document.createElement('span'), { className: 'chi', textContent: r.nome }),
      Object.assign(document.createElement('span'), { className: 'quanti', textContent: `${r.punti.toLocaleString('it-IT')} ${unita}` }),
    );
    ol.append(li);
  });
}
