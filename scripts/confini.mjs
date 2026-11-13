// One-off: extracts Italy and its neighbours from Natural Earth 1:10m (world-atlas) as GeoJSON,
// with coordinates rounded to ~100 m, into src/data/confini.json. The /date map projects them
// at request time, zoomed on the places where the band has played.
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';

const topo = JSON.parse(readFileSync('node_modules/world-atlas/countries-10m.json', 'utf8'));
const tutti = feature(topo, topo.objects.countries).features;
// Italy, San Marino, Vatican, France, Switzerland, Austria, Slovenia, Croatia
const ID = { '380': 'italia', '674': 'vicino', '336': 'vicino', '250': 'vicino', '756': 'vicino', '040': 'vicino', '705': 'vicino', '191': 'vicino' };
const arrotonda = (c) => (typeof c[0] === 'number' ? [Math.round(c[0] * 1000) / 1000, Math.round(c[1] * 1000) / 1000] : c.map(arrotonda));
const scelti = tutti.filter((f) => ID[f.id]).map((f) => ({ type: 'Feature', properties: { tipo: ID[f.id] }, geometry: { type: f.geometry.type, coordinates: arrotonda(f.geometry.coordinates) } }));
writeFileSync('src/data/confini.json', JSON.stringify({ type: 'FeatureCollection', features: scelti }));
console.log('paesi:', scelti.length, '· KB:', Math.round(JSON.stringify(scelti).length / 1024));
