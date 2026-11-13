// Pixel art for the games: sprites as text grids, one character per pixel, drawn once
// to small offscreen canvases and then scaled up without smoothing.

export const TAVOLOZZA: Record<string, string> = {
  k: '#111111', // ink
  c: '#f3eee4', // paper
  C: '#e8e0d1', // paper, darker
  r: '#c8202a', // red
  R: '#9e151d', // dark red
  t: '#1f6f6a', // teal
  T: '#16524e', // dark teal
  s: '#e3a97f', // skin
  S: '#c4855a', // skin shadow
  h: '#6b4126', // brown hair
  H: '#3a2416', // dark hair / beard
  b: '#d9a65a', // blond
  y: '#f2b632', // beer
  w: '#ffffff', // foam, glints
  o: '#f26b1d', // spritz
  g: '#bcd9d4', // glass
  G: '#8fb8b2', // glass edge
  l: '#e7e05a', // lime, halo
  p: '#e86a8a', // pink
  u: '#3b6fb5', // blue
  e: '#7a7a7a', // grey
};

export type Sprite = { w: number; h: number; tela: HTMLCanvasElement };

export function sprite(righe: string[]): Sprite {
  const h = righe.length, w = Math.max(...righe.map((r) => r.length));
  const tela = document.createElement('canvas');
  tela.width = w; tela.height = h;
  const ctx = tela.getContext('2d')!;
  righe.forEach((riga, y) => [...riga].forEach((ch, x) => {
    const colore = TAVOLOZZA[ch];
    if (colore) { ctx.fillStyle = colore; ctx.fillRect(x, y, 1, 1); }
  }));
  return { w, h, tela };
}

/** Mirror a sprite horizontally (for walking left/right). */
export function specchio(s: Sprite): Sprite {
  const tela = document.createElement('canvas');
  tela.width = s.w; tela.height = s.h;
  const ctx = tela.getContext('2d')!;
  ctx.translate(s.w, 0); ctx.scale(-1, 1); ctx.drawImage(s.tela, 0, 0);
  return { w: s.w, h: s.h, tela };
}

// ---------------------------------------------------------------- the band

/** Giova: black cap with the brim forward, dark beard, black tee. Wider body. */
export const GIOVA = [
  '.....kkkkkkkk.....',
  '....kkkkkkkkkk....',
  '...kkkkkkkkkkkkkk.',
  '....ssssssssss....',
  '....skkssskksss...',
  '....ssssssssss....',
  '....sHssssssHs....',
  '....HHHHrrHHHH....',
  '.....HHHHHHHH.....',
  '......HHHHHH......',
  '...kkkkkkkkkkkk...',
  '..kkkkkkkkkkkkkk..',
  '.skkkkkkkkkkkkkks.',
  '.skkkkkkkkkkkkkks.',
  '.s.kkkkkkkkkkkk.s.',
  '...kkkkkkkkkkkk...',
  '...uuuuuuuuuuuu...',
  '...uuuuu..uuuuu...',
  '...uuuu....uuuu...',
  '...kkkk....kkkk...',
];

/** Celi: brown curls, clean shaven, black tee. Slim. */
export const CELI = [
  '....h.hh.hh.h...',
  '...hhhhhhhhhhh..',
  '..hhhhhhhhhhhhh.',
  '..hhssssssssshh.',
  '...sskksssskkss.',
  '...sssssssssss..',
  '...sssssrrsssss.',
  '....sssssssss...',
  '......ssss......',
  '...kkkkkkkkkk...',
  '..kkkkkkkkkkkk..',
  '.skkkkkkkkkkkks.',
  '.s.kkkkkkkkkk.s.',
  '...kkkkkkkkkk...',
  '...uuuuuuuuuu...',
  '...uuuu..uuuu...',
  '...uuuu..uuuu...',
  '...kkkk..kkkk...',
];

/** Coraz: long brown hair, sunglasses, beard, black tee. */
export const CORAZ = [
  '.....hhhhhh......',
  '...hhhhhhhhhh....',
  '..hhhhhhhhhhhh...',
  '..hhsssssssshh...',
  '..hkkkkskkkkkh...',
  '..hhkkk.skkkhh...',
  '..hhssssssssshh..',
  '..hhsHHrrHHsshh..',
  '..hh.HHHHHH..hh..',
  '..h..kkkkkk...h..',
  '...kkkkkkkkkkk...',
  '..skkkkkkkkkkks..',
  '..s.kkkkkkkkk.s..',
  '....kkkkkkkkk....',
  '....uuuuuuuuu....',
  '....uuuu.uuuu....',
  '....uuuu.uuuu....',
  '....kkkk.kkkk....',
];

/** Chambers, «lo zio»: bald, beard, white tee, and the saint's halo. */
export const CHAMBERS = [
  '...llllllllll...',
  '..l..........l..',
  '...llllllllll...',
  '.....ssssss.....',
  '....ssssssss....',
  '....skksskks....',
  '....ssssssss....',
  '....HHHrrHHH....',
  '.....HHHHHH.....',
  '...wwwwwwwwww...',
  '..swwwwwwwwwws..',
  '..swwwwwwwwwws..',
  '....wwwwwwww....',
  '....uuuuuuuu....',
  '....uuu..uuu....',
  '....kkk..kkk....',
];

/** The girl who waves at Coraz (ponytail, red dress, a heart). */
export const RAGAZZA = [
  '.........p.p..',
  '...bbbb..ppp..',
  '..bbbbbb..p...',
  '..bssssbb.....',
  '..bskskbbb....',
  '..bssssb.bb...',
  '...ssss...b...',
  '.s.rrrr.......',
  '..srrrrrs.....',
  '...rrrrr.s....',
  '..rrrrrrr.....',
  '.rrrrrrrrr....',
  '....s..s......',
  '....k..k......',
];

// ---------------------------------------------------------------- what falls

export const BIRRA = [
  '.wwwwww.',
  'wwwwwwww',
  'gyyyyyyg',
  'gyyyyyygG',
  'gyywyyyg.G',
  'gyywyyyg.G',
  'gyyyyyygG',
  'gyyyyyyg',
  'gGGGGGGg',
];

export const SPRITZ = [
  '..wl....',
  '.gooooog',
  '.goowoog',
  '.gooooog',
  '..goooog',
  '...gGg..',
  '....G...',
  '....G...',
  '..GGGGG.',
];

export const TEQUILA = [
  '...ll...',
  '..llll..',
  '.gyyyyg.',
  '.gwyyyg.',
  '.gyyyyg.',
  '.gyyyyg.',
  '.gGGGGg.',
];

export const SVEGLIA = [
  '.kk....kk.',
  'kkrrrrrrkk',
  '.rrccccrr.',
  'rrccckccrr',
  'rrccckccrr',
  'rrcckkccrr',
  'rrccccccrr',
  '.rrccccrr.',
  '..rrrrrr..',
  '.k......k.',
];

export const CONTO = [
  'cccccccc',
  'ckkkkkkc',
  'cccccccc',
  'ckkkkccc',
  'cccccccc',
  'ckkkkkkc',
  'cccccccc',
  'ccrrrrrc',
  'c.c.c.c.',
];

export const MULTA = [
  'uuuuuuuuu',
  'uwwwwwwwu',
  'uwkkkkkwu',
  'uwwwwwwwu',
  'uwkkkwwwu',
  'uwwwwwwwu',
  'uwwrrrrwu',
  'uuuuuuuuu',
];

export const ACQUA = [
  '...uu...',
  '...gg...',
  '..gwwg..',
  '.guuuug.',
  '.guwuug.',
  '.guuuug.',
  '.guuuug.',
  '.guuuug.',
  '.gGGGGg.',
];

// ---------------------------------------------------------------- the run (game 2)

export const CASSA = [
  'tttttttttttt',
  'tkkttkkttkkt',
  'tkkttkkttkkt',
  'tttttttttttt',
  'tTTTTTTTTTTt',
  'tttttttttttt',
];

export const CAVO = [
  '..kk..........kk',
  '.k..k........k..',
  'k....k......k...',
  '......kkkkkk....',
];

export const TRANSENNA = [
  'eeeeeeeeeeeeee',
  'e.e..e..e..e.e',
  'e.e..e..e..e.e',
  'eeeeeeeeeeeeee',
  'e............e',
  'e............e',
  'e............e',
];

export const CUSTODIA = [
  '...kkk......',
  '..kkkkkkkkk.',
  '.kkkkkkkkkkk',
  '.kkkkkkkkkk.',
  '..kkk.......',
];

export const PLETTRO = [
  'rrrrr',
  'rrwrr',
  'rrrrr',
  '.rrr.',
  '..r..',
];

/** Giova running: two frames, legs apart and together, guitar case on the back. */
export const GIOVA_CORSA = [
  [
    '.....kkkkkkkk...',
    '....kkkkkkkkkkkk',
    '.....ssssssss...',
    '.....sssskkss...',
    '.....ssssssss...',
    '.....HHHrrHHH...',
    '......HHHHHH....',
    '..hh.kkkkkkk....',
    '.hhh.kkkkkkkks..',
    '.hhh.kkkkkkk.s..',
    '..hh.kkkkkkk....',
    '.....uuuuuuu....',
    '....uuu...uuu...',
    '...uuu.....uuu..',
    '...kk.......kk..',
  ],
  [
    '.....kkkkkkkk...',
    '....kkkkkkkkkkkk',
    '.....ssssssss...',
    '.....sssskkss...',
    '.....ssssssss...',
    '.....HHHrrHHH...',
    '......HHHHHH....',
    '..hh.kkkkkkk....',
    '.hhh.kkkkkkkks..',
    '.hhh.kkkkkkks...',
    '..hh.kkkkkkk....',
    '.....uuuuuuu....',
    '......uuuuu.....',
    '......uu.uu.....',
    '......kk.kk.....',
  ],
];

// ---------------------------------------------------------------- harder levels

/** The bouncer who walks the stage from level 3. */
export const BUTTAFUORI = [
  '.....kkkkkk.....',
  '....ssssssss....',
  '....kkkskkks....',
  '....ssssssss....',
  '.....ssrrss.....',
  '..kkkkkkkkkkkk..',
  '.kkkkkkkkkkkkkk.',
  'skkwwkwwkwwkwkks',
  'skkwkkwkkwkkwkks',
  'skkwwkwkkwkkwkks',
  'skkkkkkkkkkkkkks',
  '..kkkkkkkkkkkk..',
  '...kkkk..kkkk...',
  '...kkkk..kkkk...',
  '...kkkk..kkkk...',
  '..kkkkk..kkkkk..',
];

/** A broken glass falling in zig-zag from level 5. */
export const ROTTO = [
  '..g..g..',
  '.gG.gG..',
  '.g..g.g.',
  '..gGgg..',
  '.g.gg.g.',
  '..gGGg..',
  '...gg...',
];

// ---------------------------------------------------------------- the run, up high

/** Giova ducking (swipe down / arrow down). */
export const GIOVA_GIU = [
  '................',
  '.....kkkkkkkk...',
  '....kkkkkkkkkkkk',
  '.....ssssssss...',
  '.....sssskkss...',
  '..hh.HHHrrHHH...',
  '.hhhkkkkkkkkks..',
  '.hhhkkkkkkkkk...',
  '....uuuuuuuu....',
  '...uuu....uuu...',
  '...kk......kk...',
];

/** A string of fair lights hanging from above (pass under it, don't jump). */
export const LUCINE = [
  'k..........................k',
  '.k........................k.',
  '..kk....................kk..',
  '..r.kk................kk.y..',
  '......kkk..........kkk......',
  '.....y...kkk....kkk...r.....',
  '............kkkk............',
  '...........t....l...........',
];

export const PICCIONE = [
  [
    '..ee........',
    '.eeee.......',
    'eekeeeee....',
    '.eeeeeeeeee.',
    '...eeeeeee..',
    '....e..e....',
  ],
  [
    '..ee........',
    '.eeee..eee..',
    'eekeeeeeee..',
    '.eeeeeeee...',
    '...eeeeeee..',
    '............',
  ],
];

export const BOTTIGLIA = [
  '..........gg',
  '.....ttttttg',
  'ttttttttttt.',
  'ttwwtttttt..',
  'tttttttttt..',
];
