// "In Caddy fino in Toscana": the band drives the green Caddy to the Pachamama Festival.
// Top-down road at a low resolution, scaled up crisp. Steer left and right (drag, buttons, arrows).
// Braulio = big points but it raises the alcohol level; the police only stops you when it's high.
import * as P from './pixel';

export const LARGO = 128;
export const ALTO = 208;
const STRADA_X = 18, STRADA_W = 92;   // the road, between two grass verges
const PX_KM = 50;                      // pixels of road per "km"
const ARRIVO_KM = 300;                 // Pachamama Festival, Capannoli
const SOGLIA = 50;                     // alcohol level above which the police stops you
const Y_AUTO = ALTO - 62;              // the Caddy's top edge on screen

type Tipo = 'buca' | 'camion' | 'polizia' | 'cono' | 'pecora' | 'braulio' | 'caffe';
type Cosa = { tipo: Tipo; x: number; y: number; s: P.Sprite; avanti: number; vx: number; controllata?: boolean; presa?: boolean };
type Marachella = 'occhi' | 'solletico' | 'quanto';

/** Stages of the trip, by km. The return trip starts after the festival. */
const TAPPE = [
  { da: 0, nome: 'Si parte!', avviso: 'Evita buche e camion. Il Braulio vale tanto, ma alza il tasso.', tipi: ['buca', 'buca', 'camion', 'braulio', 'braulio', 'caffe'] },
  { da: 70, nome: 'Bologna', avviso: 'Arriva la polizia: ferma solo chi ha il tasso alto!', tipi: ['buca', 'camion', 'polizia', 'braulio', 'braulio', 'caffe', 'cono'] },
  { da: 140, nome: "L'Appennino", avviso: 'Nebbia! E dietro Celi e Giova si annoiano…', tipi: ['buca', 'buca', 'camion', 'polizia', 'braulio', 'braulio', 'caffe', 'cono'] },
  { da: 210, nome: 'Firenze', avviso: 'Più traffico, più polizia.', tipi: ['buca', 'camion', 'camion', 'polizia', 'polizia', 'braulio', 'braulio', 'caffe', 'cono'] },
  { da: 250, nome: 'La Toscana', avviso: 'Pecore in strada!', tipi: ['buca', 'pecora', 'pecora', 'camion', 'polizia', 'braulio', 'braulio', 'caffe'] },
] as const;
const RITORNO_OGNI = 100;              // on the way back, faster every 100 km

export type Annuncio = { n: number; titolo: string; testo: string };
export type Stato = {
  punti: number; km: number; gomme: number; tasso: number; braulii: number;
  ritorno: boolean; finita: boolean; motivo?: 'gomme' | 'polizia'; tappa: string; annuncio: Annuncio;
};

export function creaCaddy(tela: HTMLCanvasElement, avvisa: (s: Stato) => void) {
  const ctx = tela.getContext('2d')!;
  tela.width = LARGO; tela.height = ALTO;
  ctx.imageSmoothingEnabled = false;

  const spr: Record<Tipo, P.Sprite> = {
    buca: P.sprite(P.BUCA), camion: P.sprite(P.CAMION), polizia: P.sprite(P.POLIZIA), cono: P.sprite(P.CONO),
    pecora: P.sprite(P.PECORA), braulio: P.sprite(P.BRAULIO), caffe: P.sprite(P.CAFFE),
  };
  const pecoraSx = P.specchio(spr.pecora);
  const auto = P.sprite(P.CADDY), cipresso = P.sprite(P.CIPRESSO), yoga = P.sprite(P.YOGA);

  const stato: Stato = { punti: 0, km: 0, gomme: 3, tasso: 0, braulii: 0, ritorno: false, finita: false, tappa: TAPPE[0].nome, annuncio: { n: 0, titolo: '', testo: '' } };
  let x = LARGO / 2, obiettivo = x, tasti = 0;
  let distanza = 0, tempo = 0, velocita = 70, scorri = 0;
  let cose: Cosa[] = [];
  let prossimo = 60;
  let tappa = -1, giro = 0;             // stage index on the way there; lap of the return trip
  let arrivo = 0;                       // seconds of the arrival party (game paused)
  let marachella: Marachella | null = null, durata = 0, prossimaMarachella = 14;
  let lampo = 0, sirena = 0, fumetto = '', fumettoT = 0;
  let ultimo = 0, rif = 0;
  // Dev only (stripped from the build): ?immortale to test the whole trip.
  const immortale = import.meta.env.DEV && new URLSearchParams(location.search).has('immortale');

  const annuncia = (titolo: string, testo: string) => { stato.annuncio = { n: stato.annuncio.n + 1, titolo, testo }; };
  const dici = (t: string, s = 1.2) => { fumetto = t; fumettoT = s; };

  // ---- controls: drag on the road, on-screen buttons or arrows / A-D
  const versoX = (clientX: number) => { const r = tela.getBoundingClientRect(); obiettivo = ((clientX - r.left) / r.width) * LARGO; };
  const giu = (e: PointerEvent) => { tela.setPointerCapture(e.pointerId); versoX(e.clientX); };
  const muovi = (e: PointerEvent) => { if (e.buttons || e.pointerType !== 'mouse') versoX(e.clientX); };
  const tastoGiu = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) { tasti = -1; e.preventDefault(); }
    if (['ArrowRight', 'd', 'D'].includes(e.key)) { tasti = 1; e.preventDefault(); }
  };
  const tastoSu = (e: KeyboardEvent) => { if (['ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'].includes(e.key)) tasti = 0; };
  tela.addEventListener('pointerdown', giu);
  tela.addEventListener('pointermove', muovi);
  window.addEventListener('keydown', tastoGiu);
  window.addEventListener('keyup', tastoSu);

  const tipiOra = (): readonly string[] => (stato.ritorno ? ['buca', 'buca', 'camion', 'camion', 'polizia', 'polizia', 'cono', 'pecora', 'braulio', 'braulio', 'caffe'] : TAPPE[Math.max(0, tappa)].tipi);
  const nebbia = () => (!stato.ritorno && tappa === 2) || (stato.ritorno && giro % 3 === 1);

  function nasce() {
    const tipi = tipiOra();
    const tipo = tipi[Math.floor(Math.random() * tipi.length)] as Tipo;
    const s = spr[tipo];
    const corsia = Math.floor(Math.random() * 3);
    const cx = STRADA_X + STRADA_W / 6 + corsia * (STRADA_W / 3);
    const c: Cosa = { tipo, s, x: cx - s.w / 2, y: -s.h, avanti: 0, vx: 0 };
    if (tipo === 'camion') c.avanti = 0.45;            // drives forward, slower than us
    if (tipo === 'polizia') { c.avanti = 0.3; sirena = 2; }
    if (tipo === 'pecora') { const dx = Math.random() < 0.5 ? 1 : -1; c.vx = dx * 22; c.x = dx > 0 ? STRADA_X - 6 : STRADA_X + STRADA_W - s.w + 6; }
    if (tipo === 'cono') {                               // roadworks: three cones down one lane
      for (let k = 1; k < 3; k++) cose.push({ ...c, y: -s.h - k * 14 });
    }
    cose.push(c);
    // keep things apart: more room for the big ones
    prossimo = 34 + Math.random() * 46 + (tipo === 'camion' || tipo === 'polizia' ? 30 : 0) - Math.min(stato.km / 30, 14);
  }

  function arriva() {
    arrivo = 4;
    cose = [];
    fumettoT = 0; marachella = null;
    x = obiettivo = LARGO / 2;
    stato.punti += 200;
    annuncia('Pachamama Festival!', 'Iaia e Matti vi aspettano. +200 punti. Ora si torna, di notte!');
  }

  function passo(dt: number) {
    tempo += dt;
    if (arrivo > 0) {
      arrivo -= dt;
      if (arrivo <= 0) { stato.ritorno = true; giro = 0; stato.tappa = 'Il ritorno'; prossimaMarachella = 10; }
      return;
    }

    // speed: grows on the way there, more on the way back
    velocita = stato.ritorno ? Math.min(120 + giro * 14 + (stato.km - ARRIVO_KM) * 0.05, 200) : 70 + stato.km * 0.17;
    const dy = velocita * dt;
    distanza += dy;
    scorri = (scorri + dy) % 24;
    stato.km = Math.floor(distanza / PX_KM);

    // stages and announcements
    if (!stato.ritorno) {
      const t = TAPPE.findLastIndex((tp) => stato.km >= tp.da);
      if (t !== tappa) { tappa = t; stato.tappa = TAPPE[t].nome; annuncia(TAPPE[t].nome, TAPPE[t].avviso); }
      if (stato.km >= ARRIVO_KM) { arriva(); return; }
    } else {
      const g = Math.floor((stato.km - ARRIVO_KM) / RITORNO_OGNI);
      if (g > giro) { giro = g; annuncia(`Il ritorno, ${giro * RITORNO_OGNI} km`, giro % 3 === 1 ? 'Nebbia e sonno: ancora più veloce!' : 'Ancora più veloce!'); }
    }

    // alcohol: goes down slowly by itself
    stato.tasso = Math.max(0, stato.tasso - 3 * dt);

    // the kids in the back (from the Apennines on)
    if (stato.ritorno || tappa >= 2) {
      if (marachella) { durata -= dt; if (durata <= 0) marachella = null; }
      else if ((prossimaMarachella -= dt) <= 0) {
        const tutte: Marachella[] = ['occhi', 'solletico', 'quanto'];
        marachella = tutte[Math.floor(Math.random() * 3)];
        durata = marachella === 'solletico' ? 2.5 : 2;
        prossimaMarachella = Math.max(14 - (stato.ritorno ? 4 + giro : tappa * 1.5), 6) + Math.random() * 6;
        if (marachella === 'occhi') annuncia('Marachella!', 'Giova copre gli occhi a Chambers!');
        if (marachella === 'solletico') annuncia('Marachella!', 'Celi fa il solletico a Coraz: sbandata!');
        if (marachella === 'quanto') annuncia('«Quanto manca?!»', 'Chambers si gira a sgridarli: comandi al contrario!');
      }
    }

    // steering (inverted while Chambers turns round; drunk wobble above the limit; tickle drift)
    const inverti = marachella === 'quanto' ? -1 : 1;
    const sterzo = 115;
    let dx = tasti !== 0 ? tasti * sterzo * dt : Math.sign(obiettivo - x) * Math.min(Math.abs(obiettivo - x), sterzo * dt);
    dx *= inverti;
    if (stato.tasso > 30) dx += Math.sin(tempo * 5) * (stato.tasso - 30) * 0.9 * dt;
    if (marachella === 'solletico') dx += Math.sin(tempo * 7) * 70 * dt;
    const minX = STRADA_X + auto.w / 2 - 2, maxX = STRADA_X + STRADA_W - auto.w / 2 + 2;
    x = Math.max(minX, Math.min(maxX, x + dx));
    if (tasti !== 0) obiettivo = x;

    // traffic and things on the road
    prossimo -= dy;
    if (prossimo <= 0) nasce();
    const a = { x1: x - auto.w / 2 + 3, x2: x + auto.w / 2 - 3, y1: Y_AUTO + 2, y2: Y_AUTO + auto.h - 2 };
    for (const c of cose) {
      c.y += dy * (1 - c.avanti);
      c.x += c.vx * dt;
      if (c.presa) continue;
      const tocca = a.x2 > c.x + 1 && a.x1 < c.x + c.s.w - 1 && a.y2 > c.y + 1 && a.y1 < c.y + c.s.h - 1;
      // the police checks you as it goes past, close or not
      if (c.tipo === 'polizia' && !c.controllata && c.y + c.s.h / 2 >= Y_AUTO + auto.h / 2) {
        c.controllata = true;
        if (stato.tasso >= SOGLIA && !immortale) { stato.finita = true; stato.motivo = 'polizia'; return; }
        dici('BUONA SERA!');
      }
      if (!tocca) continue;
      c.presa = true;
      if (c.tipo === 'braulio') { stato.punti += 15; stato.braulii++; stato.tasso = Math.min(100, stato.tasso + 28); dici('GLU GLU'); }
      else if (c.tipo === 'caffe') { stato.punti += 2; stato.tasso = Math.max(0, stato.tasso - 45); dici('CAFFÈ!'); }
      else { if (!immortale) stato.gomme--; lampo = 0.35; dici(c.tipo === 'buca' ? 'BUCA!' : c.tipo === 'pecora' ? 'BEEE!' : 'BANG!'); }
    }
    cose = cose.filter((c) => c.y < ALTO + 10 && c.x > -30 && c.x < LARGO + 30 && !(c.presa && (c.tipo === 'braulio' || c.tipo === 'caffe')));
    sirena = Math.max(0, sirena - dt); lampo = Math.max(0, lampo - dt); fumettoT = Math.max(0, fumettoT - dt);

    if (stato.gomme <= 0) { stato.gomme = 0; stato.finita = true; stato.motivo = 'gomme'; }
  }

  // ---------------------------------------------------------------- drawing
  function disegna() {
    const T = P.TAVOLOZZA;
    const notte = stato.ritorno;
    const toscana = !stato.ritorno && tappa === 4;
    // verges and road
    ctx.fillStyle = notte ? '#2c3a22' : T.f; ctx.fillRect(0, 0, LARGO, ALTO);
    ctx.fillStyle = notte ? '#222d1a' : T.F;
    for (let i = -1; i < 10; i++) {
      const y = Math.round(i * 24 + scorri);
      ctx.fillRect(4, y, 3, 2); ctx.fillRect(LARGO - 9, y + 12, 3, 2);
    }
    if (toscana || arrivo > 0) for (let i = -1; i < 5; i++) {
      const y = Math.round(i * 48 + scorri * 2) % (ALTO + 48) - 12;
      ctx.drawImage(cipresso.tela, 5, y); ctx.drawImage(cipresso.tela, LARGO - 11, y + 24);
    }
    ctx.fillStyle = notte ? '#2a2826' : T.A; ctx.fillRect(STRADA_X, 0, STRADA_W, ALTO);
    ctx.fillStyle = notte ? '#bdb6aa' : T.c;
    ctx.fillRect(STRADA_X + 1, 0, 1, ALTO); ctx.fillRect(STRADA_X + STRADA_W - 2, 0, 1, ALTO);
    for (let l = 1; l < 3; l++) for (let i = -1; i < 10; i++) ctx.fillRect(Math.round(STRADA_X + (l * STRADA_W) / 3), Math.round(i * 24 + scorri), 1, 12);

    if (arrivo > 0) disegnaFesta();

    for (const c of cose) {
      if (c.presa && c.tipo !== 'buca') continue;
      const s = c.tipo === 'pecora' && c.vx < 0 ? pecoraSx : c.s;
      ctx.drawImage(s.tela, Math.round(c.x), Math.round(c.y));
      if (c.tipo === 'polizia') {                         // flashing lights
        ctx.fillStyle = Math.floor(tempo * 8) % 2 ? T.u : T.r;
        ctx.fillRect(Math.round(c.x + 4), Math.round(c.y + 9), 10, 2);
      }
    }

    // the Caddy (with headlights at night)
    const ax = Math.round(x - auto.w / 2);
    ctx.drawImage(auto.tela, ax, Y_AUTO);

    // fog in the Apennines: the top of the road fades out
    if (nebbia()) for (let y = 0; y < 110; y += 2) { ctx.fillStyle = `rgba(232,224,209,${0.9 - y / 125})`; ctx.fillRect(0, y, LARGO, 2); }
    if (notte) {
      ctx.fillStyle = 'rgba(10,14,30,0.28)'; ctx.fillRect(0, 0, LARGO, ALTO);
      // headlights: a warm cone fading forward, drawn over the night
      for (let r = 0; r < 44; r++) {
        ctx.fillStyle = `rgba(255,236,170,${0.32 - r * 0.0068})`;
        ctx.fillRect(ax + 3 - Math.round(r * 0.3), Y_AUTO - 1 - r, auto.w - 6 + Math.round(r * 0.6), 1);
      }
    }
    // Giova covers Chambers' eyes: only a slit of road stays visible
    if (marachella === 'occhi') { ctx.fillStyle = 'rgba(17,17,17,0.93)'; ctx.fillRect(0, 0, LARGO, Y_AUTO - 18); }

    if (sirena > 0 && Math.floor(tempo * 6) % 2) { ctx.fillStyle = 'rgba(59,111,181,0.18)'; ctx.fillRect(0, 0, LARGO, ALTO); }
    if (lampo > 0) { ctx.fillStyle = `rgba(200,32,42,${lampo})`; ctx.fillRect(0, 0, LARGO, ALTO); }

    if (marachella === 'solletico') nuvoletta('AHAHAH!', x, Y_AUTO - 2);
    else if (marachella === 'quanto') nuvoletta('QUANTO MANCA?', x, Y_AUTO - 2);
    else if (marachella === 'occhi') nuvoletta('CUCÙ!', x, Y_AUTO - 2);
    else if (fumettoT > 0) nuvoletta(fumetto, x, Y_AUTO - 2);
  }

  // The festival: a banner across the road and people doing yoga on their mats.
  function disegnaFesta() {
    const T = P.TAVOLOZZA;
    ctx.fillStyle = T.k; ctx.fillRect(STRADA_X, 30, 2, 40); ctx.fillRect(STRADA_X + STRADA_W - 2, 30, 2, 40);
    ctx.fillStyle = T.t; ctx.fillRect(STRADA_X, 30, STRADA_W, 14);
    ctx.fillStyle = T.c; ctx.font = 'bold 8px "Schibsted Grotesk Variable", sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('PACHAMAMA', LARGO / 2, 40); ctx.textAlign = 'start';
    const su = Math.floor(tempo * 2) % 2;
    // below the announcement, around the parked Caddy
    const posti = [[STRADA_X + 4, 118], [STRADA_X + STRADA_W - 18, 118], [STRADA_X + 4, 136], [STRADA_X + STRADA_W - 18, 136]];
    posti.forEach(([px, py], i) => ctx.drawImage(yoga.tela, px, py - (i % 2 === su ? 1 : 0)));
  }

  function nuvoletta(testo: string, cx: number, y: number) {
    ctx.font = 'bold 8px "Schibsted Grotesk Variable", sans-serif';
    const w = Math.ceil(ctx.measureText(testo).width) + 6;
    const bx = Math.round(Math.max(1, Math.min(LARGO - w - 1, cx - w / 2)));
    ctx.fillStyle = P.TAVOLOZZA.k; ctx.fillRect(bx, y - 11, w, 11);
    ctx.fillStyle = P.TAVOLOZZA.c; ctx.fillText(testo, bx + 3, y - 3);
  }

  function ciclo(t: number) {
    const dt = Math.min((t - (ultimo || t)) / 1000, 0.05);
    ultimo = t;
    passo(dt);
    disegna();
    avvisa({ ...stato, punti: stato.punti + stato.km });
    if (!stato.finita) rif = requestAnimationFrame(ciclo);
  }

  return {
    avvia() { ultimo = 0; rif = requestAnimationFrame(ciclo); },
    ferma() {
      cancelAnimationFrame(rif);
      tela.removeEventListener('pointerdown', giu);
      tela.removeEventListener('pointermove', muovi);
      window.removeEventListener('keydown', tastoGiu);
      window.removeEventListener('keyup', tastoSu);
    },
    disegnaFermo: disegna,
  };
}

export const KM_ARRIVO = ARRIVO_KM;
export const TASSO_SOGLIA = SOGLIA;
