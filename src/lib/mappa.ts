// "Il giro delle osterie": past gigs grouped by city and placed on the drawn map of Italy.
import italia from '../data/italia.json';
import { proiezione } from './mappa-proiezione.mjs';
import type { Concerto } from './date';

export type Tappa = { citta: string; volte: number; x: number; y: number; r: number; etichetta: boolean };

export const sagoma = italia;

/** One stop per city (only cities with coordinates), most visited first. */
export function tappe(concerti: (Concerto & { lat: number | null; lng: number | null })[]): Tappa[] {
  const p = proiezione();
  const perCitta = new Map<string, { volte: number; lat: number; lng: number }>();
  for (const c of concerti) {
    if (c.lat == null || c.lng == null) continue;
    const chiave = c.citta.trim().toLowerCase();
    const t = perCitta.get(chiave);
    if (t) t.volte++;
    else perCitta.set(chiave, { volte: 1, lat: c.lat, lng: c.lng });
  }
  const nomi = new Map(concerti.map((c) => [c.citta.trim().toLowerCase(), c.citta.trim()]));
  return [...perCitta]
    .map(([k, t]) => {
      const xy = p([t.lng, t.lat]);
      return xy ? { citta: nomi.get(k)!, volte: t.volte, x: Math.round(xy[0] * 10) / 10, y: Math.round(xy[1] * 10) / 10 } : null;
    })
    .filter((t): t is Omit<Tappa, 'r' | 'etichetta'> => t !== null && t.x >= 0 && t.x <= italia.larghezza && t.y >= 0 && t.y <= italia.altezza)
    .sort((a, b) => b.volte - a.volte || a.citta.localeCompare(b.citta, 'it'))
    .map((t) => ({ ...t, r: 5 + 3 * Math.sqrt(t.volte), etichetta: false }))
    .reduce(etichetteSenzaSovrapposizioni, [] as Tappa[]);
}

type Box = { x1: number; y1: number; x2: number; y2: number };
const tocca = (a: Box, b: Box) => a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;

/**
 * Greedy, most visited first: a city gets its label only if the label box
 * clears every dot and every label already placed. The others stay dots (and are in the list).
 */
function etichetteSenzaSovrapposizioni(fatte: Tappa[], t: Tappa, i: number, tutte: Tappa[]): Tappa[] {
  const box: Box = { x1: t.x + t.r + 3, y1: t.y - 9, x2: t.x + t.r + 7 + t.citta.length * 10, y2: t.y + 9 };
  const punti = tutte.filter((_, j) => j !== i).map((o) => ({ x1: o.x - o.r, y1: o.y - o.r, x2: o.x + o.r, y2: o.y + o.r }));
  const etichette = fatte.filter((o) => o.etichetta).map((o) => ({ x1: o.x + o.r + 3, y1: o.y - 9, x2: o.x + o.r + 7 + o.citta.length * 10, y2: o.y + 9 }));
  const etichetta = ![...punti, ...etichette].some((b) => tocca(box, b)) && box.x2 <= italia.larghezza + 80;
  return [...fatte, { ...t, etichetta }];
}
