// One-off: draws the outline of Italy (Natural Earth 1:50m, via world-atlas) as an SVG
// path in the same projection the site uses at runtime (src/lib/mappa.ts), and writes
// src/data/italia.json. Rerun only if the projection changes: `node scripts/mappa-italia.mjs`.
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoPath } from 'd3-geo';
import { proiezione, LARGHEZZA, ALTEZZA } from '../src/lib/mappa-proiezione.mjs';

const topo = JSON.parse(readFileSync('node_modules/world-atlas/countries-50m.json', 'utf8'));
const paesi = feature(topo, topo.objects.countries);
const italia = paesi.features.find((f) => f.id === '380');
if (!italia) throw new Error('Italia non trovata');
const d = geoPath(proiezione())(italia);
writeFileSync('src/data/italia.json', JSON.stringify({ larghezza: LARGHEZZA, altezza: ALTEZZA, d: d.replace(/(\.\d)\d+/g, '$1') }));
console.log('scritto src/data/italia.json,', d.length, 'caratteri');
