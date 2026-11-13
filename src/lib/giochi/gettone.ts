// Start token for a game: signed with a server secret, it proves when the game began,
// so the score API can reject scores that are impossible for the time actually played.
import { RATE_LIMIT_SALT } from 'astro:env/server';

export type Gioco = 'tequila' | 'ritardo' | 'caddy';
export const GIOCHI: Gioco[] = ['tequila', 'ritardo', 'caddy'];

const enc = new TextEncoder();
const b64 = (b: ArrayBuffer | Uint8Array) => Buffer.from(b instanceof Uint8Array ? b : new Uint8Array(b)).toString('base64url');

async function firma(testo: string) {
  const chiave = await crypto.subtle.importKey('raw', enc.encode(`giochi:${RATE_LIMIT_SALT}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64(await crypto.subtle.sign('HMAC', chiave, enc.encode(testo)));
}

export async function creaGettone(gioco: Gioco): Promise<string> {
  const corpo = b64(enc.encode(JSON.stringify({ g: gioco, t: Date.now(), n: crypto.randomUUID() })));
  return `${corpo}.${await firma(corpo)}`;
}

/** The game and start time, or null if the token was tampered with. */
export async function leggiGettone(gettone: string): Promise<{ gioco: Gioco; inizio: number } | null> {
  const [corpo, f] = String(gettone).split('.');
  if (!corpo || !f || (await firma(corpo)) !== f) return null;
  try {
    const { g, t } = JSON.parse(Buffer.from(corpo, 'base64url').toString('utf8'));
    return GIOCHI.includes(g) && typeof t === 'number' ? { gioco: g, inizio: t } : null;
  } catch {
    return null;
  }
}

/** Highest believable score for a game lasting `secondi` seconds. */
export function punteggioMassimo(gioco: Gioco, secondi: number) {
  if (gioco === 'tequila') return Math.ceil(secondi * 14 + 40);
  if (gioco === 'caddy') return Math.ceil(secondi * 20 + 260); // km + Braulio + the arrival bonus
  return Math.ceil(secondi * 45 + 60);
}

// A few words a nickname may not contain. Not exhaustive: the panel can delete the rest.
const VIETATE = ['cazz', 'merd', 'stronz', 'puttan', 'troia', 'vaffanc', 'coglion', 'frocio', 'porco dio', 'porcodio', 'dio cane', 'diocane', 'nazi', 'fuck', 'shit'];
export function nomeValido(nome: string): string | null {
  const n = nome.replace(/\s+/g, ' ').trim();
  if (n.length < 2 || n.length > 16) return null;
  if (!/^[\p{L}\p{N} ._\-'!]+$/u.test(n)) return null;
  const piatto = n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, '');
  if (VIETATE.some((v) => piatto.includes(v))) return null;
  return n;
}
