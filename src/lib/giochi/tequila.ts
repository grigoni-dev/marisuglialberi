// "3 tequila sul palco, grazie": drink what falls, dodge the rest, never catch Chambers.
// Canvas game at a fixed low resolution, scaled up crisp. Runs in the browser only.
import * as P from './pixel';

export const LARGO = 128;
export const ALTO = 208;
const PALCO = 22;             // height of the stage at the bottom
const DURATA_LIVELLO = 25;    // seconds per level

export type Personaggio = 'giova' | 'celi' | 'coraz';

type Tipo = 'birra' | 'spritz' | 'tequila' | 'sveglia' | 'conto' | 'multa' | 'acqua' | 'rotto' | 'chambers';
type Oggetto = { tipo: Tipo; x: number; x0: number; y: number; v: number; s: P.Sprite; avviso: number; fase: number };

/** Each band member: speed (px/s), catch width, lives, and their weak spot. */
export const PERSONAGGI: Record<Personaggio, { nome: string; velocita: number; presa: number; vite: number; pro: string; contro: string }> = {
  giova: { nome: 'Giova', velocita: 112, presa: 18, vite: 5, pro: 'il frontman: la tequila per lui vale 10', contro: 'la visiera: quello che gli cade sopra la testa sparisce all\'ultimo' },
  celi: { nome: 'Celi', velocita: 125, presa: 15, vite: 5, pro: 'il più veloce', contro: 'vescica piccola: ogni 5 bevute, bagno' },
  coraz: { nome: 'Coraz', velocita: 112, presa: 18, vite: 6, pro: 'una vita in più', contro: 'se passa una ragazza, va in tilt' },
};

const PUNTI: Partial<Record<Tipo, number>> = { birra: 1, spritz: 2, tequila: 5 };
const DA_EVITARE: Tipo[] = ['sveglia', 'conto', 'multa', 'acqua'];

/** What each new level brings, for the on-screen announcement. */
export function novitaLivello(n: number): string {
  if (n === 3) return 'Arriva il buttafuori!';
  if (n === 4) return 'Ora cade più roba insieme!';
  if (n === 5) return 'Occhio ai bicchieri rotti!';
  if (n === 7) return 'Chambers arriva più spesso!';
  return 'Più veloce!';
}

export type Stato = { punti: number; vite: number; bevute: number; secondi: number; livello: number; finita: boolean; motivo?: 'vite' | 'chambers' };

export function creaTequila(tela: HTMLCanvasElement, personaggio: Personaggio, avvisa: (s: Stato) => void) {
  const ctx = tela.getContext('2d')!;
  tela.width = LARGO; tela.height = ALTO;
  ctx.imageSmoothingEnabled = false;

  const scheda = PERSONAGGI[personaggio];
  const spr = {
    giova: P.sprite(P.GIOVA), celi: P.sprite(P.CELI), coraz: P.sprite(P.CORAZ),
    chambers: P.sprite(P.CHAMBERS), ragazza: P.sprite(P.RAGAZZA), buttafuori: P.sprite(P.BUTTAFUORI),
    birra: P.sprite(P.BIRRA), spritz: P.sprite(P.SPRITZ), tequila: P.sprite(P.TEQUILA),
    sveglia: P.sprite(P.SVEGLIA), conto: P.sprite(P.CONTO), multa: P.sprite(P.MULTA), acqua: P.sprite(P.ACQUA), rotto: P.sprite(P.ROTTO),
  };
  const io = spr[personaggio];
  const buttafuoriSx = P.specchio(spr.buttafuori);
  const ragazzaSx = P.specchio(spr.ragazza);

  const stato: Stato = { punti: 0, vite: scheda.vite, bevute: 0, secondi: 0, livello: 1, finita: false };
  let x = LARGO / 2, obiettivo = x, tasti = 0;
  let oggetti: Oggetto[] = [];
  let prossimo = 0.6, prossimoChambers = 24 + Math.random() * 10;
  let bagno = 0;                                             // Celi: seconds left in the bathroom
  let ragazza = { t: 0, x: -20, dir: 1 }, prossimaRagazza = 10 + Math.random() * 8; // Coraz only
  // The bouncer: out → warning arrow → walks in up to about mid-stage → stands → walks back out.
  type Fase = 'fuori' | 'avviso' | 'entra' | 'fermo' | 'esce';
  const buttafuori = { fase: 'fuori' as Fase, x: -20, dir: 1, t: 0, meta: 0, colpito: 0 };
  const inScena = () => buttafuori.fase === 'entra' || buttafuori.fase === 'fermo' || buttafuori.fase === 'esce';
  let lampo = 0, festa = 0;
  let ultimo = 0, rif = 0;

  // ---- controls: drag anywhere on the stage, or arrows / A-D
  const versoX = (clientX: number) => {
    const r = tela.getBoundingClientRect();
    obiettivo = ((clientX - r.left) / r.width) * LARGO;
  };
  const giu = (e: PointerEvent) => { tela.setPointerCapture(e.pointerId); versoX(e.clientX); };
  const muovi = (e: PointerEvent) => { if (e.buttons || e.pointerType !== 'mouse') versoX(e.clientX); };
  const tastoGiu = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) { tasti = -1; e.preventDefault(); }
    if (['ArrowRight', 'd', 'D'].includes(e.key)) { tasti = 1; e.preventDefault(); }
  };
  const tastoSu = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'].includes(e.key)) tasti = 0;
  };
  tela.addEventListener('pointerdown', giu);
  tela.addEventListener('pointermove', muovi);
  window.addEventListener('keydown', tastoGiu);
  window.addEventListener('keyup', tastoSu);

  // ---- difficulty: steps up every level, and keeps creeping within a level
  const dentro = () => (stato.secondi % DURATA_LIVELLO) / DURATA_LIVELLO;
  const L = () => stato.livello - 1;
  const velocitaCaduta = () => Math.min(42 + L() * 15 + dentro() * 8, 200);
  const intervallo = () => Math.max(0.95 - L() * 0.09, 0.26);
  const quotaOstacoli = () => Math.min(0.12 + L() * 0.06, 0.55);
  const quanti = () => (stato.livello >= 6 && Math.random() < 0.35 ? 3 : stato.livello >= 4 && Math.random() < 0.25 * (stato.livello - 3) ? 2 : 1);
  const attesaChambers = () => Math.max(26 - L() * 3, 7) + Math.random() * Math.max(14 - L() * 1.5, 4);
  const preavvisoChambers = () => Math.max(1.1 - L() * 0.09, 0.45);

  function nasce() {
    const usate: number[] = [];
    const n = quanti();
    for (let i = 0; i < n; i++) {
      let tipo: Tipo;
      if (Math.random() < quotaOstacoli()) {
        const ostacoli: Tipo[] = stato.livello >= 5 ? [...DA_EVITARE, 'rotto', 'rotto'] : DA_EVITARE;
        tipo = ostacoli[Math.floor(Math.random() * ostacoli.length)];
      } else {
        const r = Math.random();
        tipo = r < 0.12 ? 'tequila' : r < 0.45 ? 'spritz' : 'birra';
      }
      const s = spr[tipo];
      const v = velocitaCaduta() * (tipo === 'tequila' ? 1.35 : 0.85 + Math.random() * 0.3);
      // keep several things falling together apart from each other
      let px = 4 + Math.random() * (LARGO - 8 - s.w);
      for (let k = 0; k < 6 && usate.some((u) => Math.abs(u - px) < 18); k++) px = 4 + Math.random() * (LARGO - 8 - s.w);
      usate.push(px);
      oggetti.push({ tipo, s, v, x: px, x0: px, y: -s.h - i * 12, avviso: 0, fase: Math.random() * 6 });
    }
  }

  function nasceChambers() {
    const s = spr.chambers;
    const px = 6 + Math.random() * (LARGO - 12 - s.w);
    oggetti.push({ tipo: 'chambers', s, v: velocitaCaduta() * 0.6, x: px, x0: px, y: -s.h, avviso: preavvisoChambers(), fase: 0 });
  }

  function passo(dt: number) {
    stato.secondi += dt;
    stato.livello = 1 + Math.floor(stato.secondi / DURATA_LIVELLO);

    // movement (Coraz in a spin when the girl walks by: inverted and shaky)
    const tilt = personaggio === 'coraz' && ragazza.t > 0;
    if (bagno > 0) bagno -= dt;
    else {
      let dx = tasti !== 0 ? tasti * scheda.velocita * dt : Math.sign(obiettivo - x) * Math.min(Math.abs(obiettivo - x), scheda.velocita * dt);
      if (tilt) dx = -dx + (Math.random() - 0.5) * 60 * dt;
      x = Math.max(io.w / 2, Math.min(LARGO - io.w / 2, x + dx));
      // With the keys, the player stays where they left him (no drifting back to the last touch).
      if (tasti !== 0) obiettivo = x;
    }

    // spawning
    prossimo -= dt;
    if (prossimo <= 0) { nasce(); prossimo = intervallo() * (0.7 + Math.random() * 0.6); }
    prossimoChambers -= dt;
    if (prossimoChambers <= 0) { nasceChambers(); prossimoChambers = attesaChambers(); }
    if (personaggio === 'coraz') {
      prossimaRagazza -= dt;
      if (prossimaRagazza <= 0 && ragazza.t <= 0) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        ragazza = { t: 3.2, x: dir > 0 ? -16 : LARGO + 2, dir };
        prossimaRagazza = 12 + Math.random() * 10;
      }
      if (ragazza.t > 0) { ragazza.t -= dt; ragazza.x += ragazza.dir * 40 * dt; }
    }

    // the bouncer (level 3+): comes in from one side, announced by a red arrow, walks to about
    // the middle, stands there a moment and goes back out. Stay on the other half of the stage.
    if (stato.livello >= 3) {
      const b = buttafuori;
      const cammino = (26 + L() * 3) * dt;
      b.t -= dt;
      if (b.fase === 'fuori' && b.t <= 0) {
        b.dir = Math.random() < 0.5 ? 1 : -1;
        b.x = b.dir > 0 ? -16 : LARGO;
        const r = Math.random() * 0.2;
        b.meta = b.dir > 0 ? LARGO * (0.35 + r) - 16 : LARGO * (0.65 - r);
        b.fase = 'avviso'; b.t = 1.1;
      } else if (b.fase === 'avviso' && b.t <= 0) b.fase = 'entra';
      else if (b.fase === 'entra') {
        b.x += b.dir * cammino;
        if (b.dir > 0 ? b.x >= b.meta : b.x <= b.meta) { b.x = b.meta; b.fase = 'fermo'; b.t = 0.8 + Math.random(); }
      } else if (b.fase === 'fermo' && b.t <= 0) b.fase = 'esce';
      else if (b.fase === 'esce') {
        b.x -= b.dir * cammino;
        if (b.x < -18 || b.x > LARGO + 2) { b.fase = 'fuori'; b.t = Math.max(1.5, 4 - L() * 0.3) + Math.random() * 2; }
      }
      b.colpito = Math.max(0, b.colpito - dt);
      if (inScena() && b.colpito <= 0 && Math.abs(b.x + 8 - x) < 12) {
        stato.vite--; lampo = 0.35; b.colpito = 1.2;
        x = Math.max(io.w / 2, Math.min(LARGO - io.w / 2, x + (x < b.x + 8 ? -26 : 26)));
        obiettivo = x;
      }
    }

    // falling and catching
    const bocca = { x1: x - scheda.presa / 2, x2: x + scheda.presa / 2, y: ALTO - PALCO - io.h + 6 };
    for (const o of oggetti) {
      if (o.avviso > 0) { o.avviso -= dt; continue; }
      o.y += o.v * dt;
      if (o.tipo === 'rotto') { o.fase += dt * 4; o.x = Math.max(2, Math.min(LARGO - o.s.w - 2, o.x0 + Math.sin(o.fase) * 18)); }
      const centro = o.x + o.s.w / 2;
      if (o.y + o.s.h >= bocca.y && o.y <= bocca.y + 10 && centro >= bocca.x1 && centro <= bocca.x2) {
        o.y = ALTO + 99; // caught
        if (o.tipo === 'chambers') { stato.vite = 0; stato.motivo = 'chambers'; }
        else if (PUNTI[o.tipo]) {
          stato.punti += o.tipo === 'tequila' && personaggio === 'giova' ? 10 : PUNTI[o.tipo]!;
          stato.bevute++;
          festa = 0.25;
          if (personaggio === 'celi' && stato.bevute % 5 === 0) bagno = 2.2;
        } else { stato.vite--; lampo = 0.35; }
      }
    }
    oggetti = oggetti.filter((o) => o.y < ALTO + 20);
    lampo = Math.max(0, lampo - dt); festa = Math.max(0, festa - dt);

    if (stato.vite <= 0) {
      stato.vite = 0;
      stato.finita = true;
      stato.motivo ??= 'vite';
    }
  }

  function disegna() {
    // the room: wooden ceiling stripes, paper wall, stage
    ctx.fillStyle = P.TAVOLOZZA.c; ctx.fillRect(0, 0, LARGO, ALTO);
    ctx.fillStyle = P.TAVOLOZZA.C;
    for (let y = 0; y < ALTO - PALCO; y += 16) ctx.fillRect(0, y, LARGO, 8);
    ctx.fillStyle = P.TAVOLOZZA.k; ctx.fillRect(0, ALTO - PALCO, LARGO, PALCO);
    ctx.fillStyle = P.TAVOLOZZA.t; ctx.fillRect(0, ALTO - PALCO, LARGO, 2);

    if (ragazza.t > 0) {
      const s = ragazza.dir > 0 ? spr.ragazza : ragazzaSx;
      ctx.drawImage(s.tela, Math.round(ragazza.x), ALTO - PALCO - s.h + 2);
    }

    // falling things (Chambers announced by a blinking "!" at the top)
    for (const o of oggetti) {
      if (o.avviso > 0) {
        if (Math.floor(o.avviso * 8) % 2 === 0) { ctx.fillStyle = P.TAVOLOZZA.r; ctx.fillRect(Math.round(o.x + o.s.w / 2 - 1), 3, 2, 7); ctx.fillRect(Math.round(o.x + o.s.w / 2 - 1), 12, 2, 2); }
        continue;
      }
      // Giova's cap visor: what falls right above his head fades out in the last stretch.
      const alfa = personaggio === 'giova' ? visiera(o) : 1;
      if (alfa <= 0) continue;
      ctx.globalAlpha = alfa;
      ctx.drawImage(o.s.tela, Math.round(o.x), Math.round(o.y));
      ctx.globalAlpha = 1;
    }

    const py = ALTO - PALCO - io.h + 2;

    if (inScena()) {
      const destra = buttafuori.fase === 'esce' ? buttafuori.dir < 0 : buttafuori.dir > 0;
      const s = destra ? spr.buttafuori : buttafuoriSx;
      ctx.drawImage(s.tela, Math.round(buttafuori.x), ALTO - PALCO - s.h + 2);
    } else if (buttafuori.fase === 'avviso' && Math.floor(buttafuori.t * 6) % 2 === 0) {
      // blinking red arrow on the side he is coming from, pointing inwards
      const ay = ALTO - PALCO - 14, ax = buttafuori.dir > 0 ? 3 : LARGO - 4;
      ctx.fillStyle = P.TAVOLOZZA.r;
      for (let k = 0; k < 6; k++) ctx.fillRect(ax + buttafuori.dir * k, ay - (5 - k), 1, (5 - k) * 2 + 1);
    }

    // the player
    const px = Math.round(x - io.w / 2);
    if (bagno > 0) {
      ctx.globalAlpha = 0.35; ctx.drawImage(io.tela, px, py); ctx.globalAlpha = 1;
      fumetto('BAGNO!', x, py - 4);
    } else {
      ctx.drawImage(io.tela, px, py);
      if (ragazza.t > 0 && personaggio === 'coraz') fumetto('TILT!', x, py - 4);
      else if (buttafuori.colpito > 0.8) fumetto('EHI!', x, py - 4);
      else if (festa > 0) fumetto('GLU', x, py - 4);
    }

    if (lampo > 0) { ctx.fillStyle = `rgba(200,32,42,${lampo})`; ctx.fillRect(0, 0, LARGO, ALTO); }
  }

  /** 1 = fully visible; fades to 0 in the 30 px above Giova's head, within the brim's width. */
  function visiera(o: Oggetto) {
    const testa = ALTO - PALCO - io.h + 2;
    const sopra = Math.abs(o.x + o.s.w / 2 - x) < 20;
    const distanza = testa - (o.y + o.s.h);
    if (!sopra || distanza > 34) return 1;
    return Math.max(0, Math.min(1, (distanza - 4) / 30));
  }

  function fumetto(testo: string, cx: number, y: number) {
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
    avvisa({ ...stato });
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
