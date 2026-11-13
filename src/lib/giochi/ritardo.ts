// "Arrivo comunque in ritardo": Giova runs to the gig. Tap to jump (hold for higher),
// swipe down (or arrow down) to duck. Endless runner at a low resolution, scaled up crisp.
import * as P from './pixel';

export const LARGO = 128;
export const ALTO = 92;
const TERRA = ALTO - 13;          // ground line
const GRAVITA = 560;              // px/s²
const SALTO = -178;               // jump take-off speed
const SPINTA = 0.45;              // gravity multiplier while the button is held (higher jump)
const METRO = 6;                  // pixels per metre
const XG = 18;                    // Giova's x on screen

type Tipo = 'cassa' | 'cavo' | 'transenna' | 'custodia' | 'lucine' | 'piccione' | 'bottiglia' | 'striscione';
type Ostacolo = { tipo: Tipo; x: number; y: number; w: number; h: number; s?: P.Sprite; v: number };
type Plettro = { x: number; y: number; preso: boolean };

/** Stages of the run: each one has its look and adds new kinds of trouble. */
const TAPPE = [
  { da: 0, nome: 'La piazza', avviso: 'Salta casse e cavi. Occhio ai piccioni!', cielo: 'c', fondo: 'C', terra: 'e', tipi: ['cassa', 'cavo', 'custodia', 'piccione'] },
  { da: 250, nome: 'La sagra', avviso: 'Le lucine: non saltare!', cielo: 'C', fondo: 'l', terra: 'h', tipi: ['cassa', 'transenna', 'cavo', 'lucine', 'piccione', 'piccione'] },
  { da: 600, nome: "L'osteria", avviso: 'Volano bottiglie: abbassati!', cielo: 'h', fondo: 'H', terra: 'k', tipi: ['cassa', 'custodia', 'cavo', 'lucine', 'bottiglia', 'piccione'] },
  { da: 1000, nome: 'Il palco', avviso: 'Lo striscione: abbassati!', cielo: 'k', fondo: 'r', terra: 'R', tipi: ['cassa', 'transenna', 'bottiglia', 'striscione', 'lucine', 'piccione'] },
] as const;
const BIS_OGNI = 400;             // after the stage, every 400 m an encore: faster

export type Stato = { metri: number; plettri: number; punti: number; finita: boolean; tappa: string; avviso: string; livello: number };

export function creaRitardo(tela: HTMLCanvasElement, avvisa: (s: Stato) => void) {
  const ctx = tela.getContext('2d')!;
  tela.width = LARGO; tela.height = ALTO;
  ctx.imageSmoothingEnabled = false;

  const corsa = P.GIOVA_CORSA.map(P.sprite);
  const accovacciato = P.sprite(P.GIOVA_GIU);
  const spr: Partial<Record<Tipo, P.Sprite>> = {
    cassa: P.sprite(P.CASSA), cavo: P.sprite(P.CAVO), transenna: P.sprite(P.TRANSENNA), custodia: P.sprite(P.CUSTODIA),
    lucine: P.sprite(P.LUCINE), bottiglia: P.sprite(P.BOTTIGLIA),
  };
  const piccione = P.PICCIONE.map(P.sprite);
  const plettro = P.sprite(P.PLETTRO);

  const ALTEZZA_IN_PIEDI = corsa[0].h, ALTEZZA_GIU = accovacciato.h;
  let y = TERRA - ALTEZZA_IN_PIEDI, vy = 0, premuto = false, aTerra = true, giu = 0, giuTenuto = false;
  let velocita = 50, distanza = 0, tempo = 0;
  let ostacoli: Ostacolo[] = [], plettri: Plettro[] = [];
  let prossimo = 96;
  let presi = 0, finita = false;
  let ultimo = 0, rif = 0, scorri = 0;

  // ---- controls
  const salta = () => {
    if (finita) return;
    premuto = true;
    if (aTerra && giu <= 0 && !giuTenuto) { vy = SALTO; aTerra = false; }
  };
  const abbassati = (secondi: number) => {
    if (finita) return;
    giu = secondi;
    if (!aTerra) vy = Math.max(vy, 260); // ducking in the air drops you fast
  };
  let y0: number | null = null, abbassato = false;
  const pGiu = (e: PointerEvent) => { e.preventDefault(); tela.setPointerCapture(e.pointerId); y0 = e.clientY; abbassato = false; };
  const pMuovi = (e: PointerEvent) => {
    if (y0 === null || abbassato) return;
    if (e.clientY - y0 > 18) { abbassato = true; abbassati(0.6); }
  };
  const pSu = () => {
    if (y0 !== null && !abbassato) { salta(); setTimeout(() => (premuto = false), 140); }
    premuto = false; y0 = null;
  };
  // A tap jumps on release so a swipe down doesn't jump first; holding still jumps higher.
  let attesa = 0;
  const pGiuSalto = (e: PointerEvent) => { pGiu(e); attesa = window.setTimeout(() => { if (y0 !== null && !abbassato) salta(); }, 90); };
  const pSuSalto = () => { clearTimeout(attesa); if (premuto) { premuto = false; y0 = null; } else pSu(); };
  const tastoGiu = (e: KeyboardEvent) => {
    if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); if (!e.repeat) salta(); }
    if (['ArrowDown', 's', 'S'].includes(e.key)) { e.preventDefault(); giuTenuto = true; abbassati(0.1); }
  };
  const tastoSu = (e: KeyboardEvent) => {
    if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) premuto = false;
    if (['ArrowDown', 's', 'S'].includes(e.key)) giuTenuto = false;
  };
  tela.addEventListener('pointerdown', pGiuSalto);
  tela.addEventListener('pointermove', pMuovi);
  tela.addEventListener('pointerup', pSuSalto);
  tela.addEventListener('pointercancel', pSuSalto);
  window.addEventListener('keydown', tastoGiu);
  window.addEventListener('keyup', tastoSu);

  const metri = () => Math.floor(distanza / METRO);
  const punti = () => metri() + presi * 10;
  const tappa = () => [...TAPPE].reverse().find((t) => metri() >= t.da)!;
  const bis = () => Math.max(0, Math.floor((metri() - TAPPE[3].da) / BIS_OGNI));
  const livello = () => TAPPE.indexOf(tappa()) + 1 + bis();

  function nuovoOstacolo() {
    const t = tappa();
    const tipo = t.tipi[Math.floor(Math.random() * t.tipi.length)] as Tipo;
    const sotto = TERRA - ALTEZZA_IN_PIEDI;        // top of Giova's head when standing
    const giuTesta = TERRA - ALTEZZA_GIU;          // top of his head when ducking
    const x = LARGO + 4;
    switch (tipo) {
      case 'lucine': { // hanging from above down to just over his head: stay on the ground
        const s = spr.lucine!;
        return { tipo, x, y: sotto - 3 - s.h, w: s.w, h: s.h, s, v: 0 };
      }
      case 'striscione': // a banner down to head height: duck
        return { tipo, x, y: 0, w: 46, h: giuTesta - 2, v: 0 };
      case 'bottiglia': { // flies at head height, a bit faster: duck
        const s = spr.bottiglia!;
        return { tipo, x, y: giuTesta - s.h - 1, w: s.w, h: s.h, s, v: 30 };
      }
      case 'piccione': { // low (jump it) or at head height (duck)
        const basso = Math.random() < 0.5;
        return { tipo, x, y: basso ? TERRA - 7 : giuTesta - 7, w: 12, h: 6, v: 18 };
      }
      default: {
        const s = spr[tipo]!;
        return { tipo, x, y: TERRA - s.h, w: s.w, h: s.h, s, v: 0 };
      }
    }
  }

  function passo(dt: number) {
    tempo += dt;
    velocita = Math.min(50 + tempo * 1.6 + bis() * 12, 175);
    const dx = velocita * dt;
    distanza += dx;
    scorri = (scorri + dx) % 26;

    // ducking lasts while the key is held, or ~0.6 s after a swipe
    giu = giuTenuto ? Math.max(giu, 0.05) : Math.max(0, giu - dt);
    const abbassato = giu > 0 && aTerra;
    const altezza = abbassato ? ALTEZZA_GIU : ALTEZZA_IN_PIEDI;

    vy += GRAVITA * (premuto && vy < 0 ? SPINTA : 1) * dt;
    y += vy * dt;
    const pavimento = TERRA - ALTEZZA_IN_PIEDI;
    if (y >= pavimento) { y = pavimento; vy = 0; aTerra = true; }

    prossimo -= dx;
    if (prossimo <= 0) {
      const o = nuovoOstacolo();
      ostacoli.push(o);
      if (o.y + o.h >= TERRA - 1 && Math.random() < 0.45) plettri.push({ x: o.x + o.w / 2 - 2, y: TERRA - o.h - 18 - Math.random() * 12, preso: false });
      prossimo = 60 + velocita * 0.6 + Math.random() * 72 + (o.tipo === 'striscione' || o.tipo === 'lucine' ? 20 : 0);
    }
    for (const o of ostacoli) o.x -= dx + o.v * dt;
    for (const p of plettri) p.x -= dx;
    ostacoli = ostacoli.filter((o) => o.x + o.w > -4);
    plettri = plettri.filter((p) => p.x > -8 && !p.preso);

    // collisions (a little forgiving on the edges)
    const testa = aTerra ? TERRA - altezza : y;
    const g = { x1: XG + 4, y1: testa + 1, x2: XG + corsa[0].w - 5, y2: (aTerra ? TERRA : y + ALTEZZA_IN_PIEDI) - 1 };
    for (const o of ostacoli) {
      if (g.x2 > o.x + 2 && g.x1 < o.x + o.w - 2 && g.y2 > o.y + 1 && g.y1 < o.y + o.h) { finita = true; break; }
    }
    for (const p of plettri) {
      if (g.x2 > p.x && g.x1 < p.x + plettro.w && g.y1 < p.y + plettro.h && g.y2 > p.y) { p.preso = true; presi++; }
    }
  }

  function disegna() {
    const t = tappa();
    const T = P.TAVOLOZZA;
    ctx.fillStyle = T[t.cielo]; ctx.fillRect(0, 0, LARGO, TERRA);
    ctx.fillStyle = T[t.fondo];
    for (let i = -1; i < 7; i++) {
      const bx = Math.round(i * 26 - scorri * 0.5);
      const h = 14 + (((i + 8) * 7 + 3) % 4) * 5;
      ctx.fillRect(bx, TERRA - h, 18, h);
    }
    if (t.nome === 'La sagra') {
      ctx.fillStyle = T.r;
      for (let i = 0; i < 12; i++) ctx.fillRect(Math.round(i * 13 - scorri) % (LARGO + 13), 8 + (i % 2) * 3, 2, 2);
    }
    ctx.fillStyle = T[t.terra]; ctx.fillRect(0, TERRA, LARGO, ALTO - TERRA);
    ctx.fillStyle = T.k;
    for (let i = 0; i < 6; i++) ctx.fillRect(Math.round(i * 26 - scorri), TERRA + 5, 10, 1);

    for (const p of plettri) if (!p.preso) ctx.drawImage(plettro.tela, Math.round(p.x), Math.round(p.y));
    for (const o of ostacoli) {
      const ox = Math.round(o.x), oy = Math.round(o.y);
      if (o.tipo === 'striscione') {
        // two poles and a red banner with the famous line
        ctx.fillStyle = T.k; ctx.fillRect(ox, 0, 2, TERRA); ctx.fillRect(ox + o.w - 2, 0, 2, TERRA);
        ctx.fillStyle = T.r; ctx.fillRect(ox + 2, o.h - 12, o.w - 4, 12);
        ctx.fillStyle = T.c; ctx.font = 'bold 5px "Schibsted Grotesk Variable", sans-serif';
        ctx.fillText('ULTIMA E POI', ox + 5, o.h - 6.5); ctx.fillText('ANDIAMO', ox + 10, o.h - 1.5);
      } else if (o.tipo === 'piccione') {
        ctx.drawImage(piccione[Math.floor(tempo * 8) % 2].tela, ox, oy);
      } else if (o.s) ctx.drawImage(o.s.tela, ox, oy);
    }
    const abbassato = giu > 0 && aTerra;
    const f = abbassato ? accovacciato : aTerra ? corsa[Math.floor(tempo * 10) % 2] : corsa[0];
    ctx.drawImage(f.tela, XG, Math.round(abbassato ? TERRA - ALTEZZA_GIU : y));
  }

  function ciclo(ora: number) {
    const dt = Math.min((ora - (ultimo || ora)) / 1000, 0.05);
    ultimo = ora;
    passo(dt);
    disegna();
    const t = tappa(), b = bis();
    avvisa({
      metri: metri(), plettri: presi, punti: punti(), finita, livello: livello(),
      tappa: b > 0 ? `Bis ${b}` : t.nome,
      avviso: b > 0 ? 'Bis! Ancora più veloce!' : t.avviso,
    });
    if (!finita) rif = requestAnimationFrame(ciclo);
  }

  return {
    avvia() { ultimo = 0; rif = requestAnimationFrame(ciclo); },
    ferma() {
      cancelAnimationFrame(rif);
      clearTimeout(attesa);
      tela.removeEventListener('pointerdown', pGiuSalto);
      tela.removeEventListener('pointermove', pMuovi);
      tela.removeEventListener('pointerup', pSuSalto);
      tela.removeEventListener('pointercancel', pSuSalto);
      window.removeEventListener('keydown', tastoGiu);
      window.removeEventListener('keyup', tastoSu);
    },
    disegnaFermo: disegna,
  };
}
