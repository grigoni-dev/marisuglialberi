// "Il giro delle osterie": past gigs grouped by city, on a map zoomed on the area
// where the band has played, with a small Italy in the corner showing where that area is.
import { geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, Geometry } from 'geojson';
import confini from '../data/confini.json';
import italia from '../data/italia.json';
import { proiezione as proiezioneItalia } from './mappa-proiezione.mjs';
import { cittaPulita, type Concerto } from './date';

export const LARGHEZZA = 600;
export const ALTEZZA = 520;
const MARGINE = 36;
const RAGGIO_KM = 150;

/** Great-circle distance in km. */
function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
const CARATTERE = 17; // label font size, in map units

export type Tappa = {
  citta: string; volte: number; x: number; y: number; r: number; etichetta: boolean;
  posto?: { x: number; y: number; ancora: 'start' | 'end' | 'middle'; linea: { x1: number; y1: number; x2: number; y2: number } | null; box: { x1: number; y1: number; x2: number; y2: number } };
};
export type Mappa = {
  larghezza: number;
  altezza: number;
  paesi: { tipo: 'italia' | 'vicino'; d: string }[];
  tappe: Tappa[];
  /** The small Italy, in its own 600×700 coordinates, the box of the zoomed area, and the far-away gigs. */
  riquadro: { d: string; larghezza: number; altezza: number; x: number; y: number; w: number; h: number; lontane: { x: number; y: number }[] };
};

type ConCoordinate = Concerto & { lat: number | null; lng: number | null };

/** The zoomed map, or null when no past gig has coordinates yet. */
export function mappaGiro(concerti: ConCoordinate[]): Mappa | null {
  const perCitta = new Map<string, { citta: string; volte: number; lat: number; lng: number }>();
  for (const c of concerti) {
    if (c.lat == null || c.lng == null) continue;
    const nome = cittaPulita(c.citta);
    const k = nome.toLowerCase();
    const t = perCitta.get(k);
    if (t) t.volte++;
    else perCitta.set(k, { citta: nome, volte: 1, lat: c.lat, lng: c.lng });
  }
  const tutte = [...perCitta.values()];
  if (!tutte.length) return null;

  // The main map frames the home area: cities within RAGGIO_KM of the median gig. Trips
  // further away are drawn as dots on the small Italy instead of stretching the big map.
  const pesate = tutte.flatMap((c) => Array.from({ length: c.volte }, () => c));
  const mediana = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];
  const centro = { lat: mediana(pesate.map((c) => c.lat)), lng: mediana(pesate.map((c) => c.lng)) };
  const vicine = tutte.filter((c) => km(c, centro) <= RAGGIO_KM);
  const citta = vicine.length ? vicine : tutte;
  const lontane = tutte.filter((c) => !citta.includes(c));

  // Bounding box of the places, padded, never smaller than ~120 × 90 km.
  const lngs = citta.map((c) => c.lng), lats = citta.map((c) => c.lat);
  let [w, e, s, n] = [Math.min(...lngs), Math.max(...lngs), Math.min(...lats), Math.max(...lats)];
  const cx = (w + e) / 2, cy = (s + n) / 2;
  const mezzaLng = Math.max((e - w) / 2 + 0.15, 0.8), mezzaLat = Math.max((n - s) / 2 + 0.12, 0.45);
  [w, e, s, n] = [cx - mezzaLng, cx + mezzaLng, cy - mezzaLat, cy + mezzaLat];

  const p = geoMercator()
    .fitExtent([[MARGINE, MARGINE], [LARGHEZZA - MARGINE, ALTEZZA - MARGINE]], { type: 'MultiPoint', coordinates: [[w, s], [e, n]] })
    .clipExtent([[0, 0], [LARGHEZZA, ALTEZZA]]);
  const percorso = geoPath(p);
  const paesi = (confini as FeatureCollection<Geometry, { tipo: 'italia' | 'vicino' }>).features
    .map((f) => ({ tipo: f.properties.tipo, d: (percorso(f) ?? '').replace(/(\.\d)\d+/g, '$1') }))
    .filter((x) => x.d)
    // neighbours first, Italy on top
    .sort((a, b) => (a.tipo === b.tipo ? 0 : a.tipo === 'vicino' ? -1 : 1));

  const tappe = citta
    .map((c) => {
      const [x, y] = p([c.lng, c.lat]) ?? [-1, -1];
      return { citta: c.citta, volte: c.volte, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, r: 6 + 3 * Math.sqrt(c.volte), etichetta: false };
    })
    .filter((t) => t.x >= 0 && t.x <= LARGHEZZA && t.y >= 0 && t.y <= ALTEZZA)
    .sort((a, b) => b.volte - a.volte || a.citta.localeCompare(b.citta, 'it'))
    .reduce(etichetteSenzaSovrapposizioni, [] as Tappa[]);

  // Where the zoomed area sits in the small Italy.
  const pi = proiezioneItalia();
  const a = pi(p.invert!([0, 0])!)!, b = pi(p.invert!([LARGHEZZA, ALTEZZA])!)!;
  const riquadro = {
    d: italia.d, larghezza: italia.larghezza, altezza: italia.altezza,
    x: Math.min(a[0], b[0]), y: Math.min(a[1], b[1]), w: Math.max(Math.abs(b[0] - a[0]), 6), h: Math.max(Math.abs(b[1] - a[1]), 6),
    lontane: lontane.map((c) => pi([c.lng, c.lat])).filter((xy): xy is [number, number] => xy !== null).map(([x, y]) => ({ x, y })),
  };

  return { larghezza: LARGHEZZA, altezza: ALTEZZA, paesi, tappe, riquadro };
}

/** Cities by number of gigs, for the list next to the map. */
export function elencoCitta(concerti: Concerto[]) {
  const m = new Map<string, { citta: string; volte: number }>();
  for (const c of concerti) {
    const nome = cittaPulita(c.citta);
    const k = nome.toLowerCase();
    const t = m.get(k);
    if (t) t.volte++;
    else m.set(k, { citta: nome, volte: 1 });
  }
  return [...m.values()].sort((a, b) => b.volte - a.volte || a.citta.localeCompare(b.citta, 'it'));
}

type Box = { x1: number; y1: number; x2: number; y2: number };
const tocca = (a: Box, b: Box) => a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
const larghezzaTesto = (t: string) => t.length * CARATTERE * 0.62;

/** A label position: the text box, its anchor point, and the leader line start when the label sits away from the dot. */
type Posto = { box: Box; x: number; y: number; ancora: 'start' | 'end' | 'middle'; linea: { x1: number; y1: number; x2: number; y2: number } | null };

// Directions tried in order (unit vectors), then the same directions further out with a leader line.
const DIREZIONI: [number, number][] = [[1, 0], [-1, 0], [0, -1], [0, 1], [1, -1], [-1, -1], [1, 1], [-1, 1]];
const DISTANZE = [0, 26, 52, 78];

function posto(t: { x: number; y: number; r: number; citta: string }, [dx, dy]: [number, number], d: number): Posto {
  const largo = larghezzaTesto(t.citta), alto = CARATTERE * 0.6;
  const n = Math.hypot(dx, dy);
  // Point at the edge of the dot (plus the extra distance) in that direction.
  const px = t.x + (dx / n) * (t.r + 4 + d), py = t.y + (dy / n) * (t.r + 4 + d);
  const ancora = dx > 0 ? 'start' : dx < 0 ? 'end' : 'middle';
  const x1 = ancora === 'start' ? px : ancora === 'end' ? px - largo : px - largo / 2;
  const yc = dy < 0 ? py - alto : dy > 0 ? py + alto : py; // vertical centre of the text
  const box = { x1: x1 - 2, y1: yc - alto, x2: x1 + largo + 2, y2: yc + alto };
  const linea = d > 0 ? { x1: t.x + (dx / n) * t.r, y1: t.y + (dy / n) * t.r, x2: px, y2: yc } : null;
  return { box, x: px, y: yc + CARATTERE * 0.35, ancora, linea };
}

/**
 * Greedy, most visited first: a city gets its label in the first position (around the dot,
 * then further out with a leader line) that stays inside the map and touches no dot and no
 * label already placed. Cities left without a label are still in the list next to the map.
 */
function etichetteSenzaSovrapposizioni(fatte: Tappa[], t: Tappa, _i: number, tutte: Tappa[]): Tappa[] {
  const punti = tutte.filter((o) => o !== t).map((o) => ({ x1: o.x - o.r - 2, y1: o.y - o.r - 2, x2: o.x + o.r + 2, y2: o.y + o.r + 2 }));
  const etichette = fatte.filter((o) => o.posto).map((o) => o.posto!.box);
  const libera = (b: Box) => b.x1 >= 4 && b.x2 <= LARGHEZZA - 4 && b.y1 >= 4 && b.y2 <= ALTEZZA - 4 && ![...punti, ...etichette].some((o) => tocca(b, o));
  for (const d of DISTANZE) {
    for (const dir of DIREZIONI) {
      const p = posto(t, dir, d);
      if (libera(p.box)) return [...fatte, { ...t, etichetta: true, posto: p }];
    }
  }
  return [...fatte, { ...t, etichetta: false }];
}
