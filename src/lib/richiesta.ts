// Booking request: field rules shared by the API (server) and the form (browser).

export const TIPI = {
  osteria: 'Bar/Osteria',
  matrimonio: 'Matrimonio',
  aziendale: 'Evento aziendale',
  salotto: 'Concerto in salotto',
  altro: 'Altra festa',
} as const;
export type Tipo = keyof typeof TIPI;

export type Richiesta = {
  tipo: Tipo;
  data: string | null;
  luogo: string;
  persone: number | null;
  nome: string;
  contatto: string;
  messaggio: string | null;
  dj: boolean;
  djTipo: 'chambers' | 'collab' | null;
  djCollab: string | null;
};

export type Errori = Partial<Record<'tipo' | 'data' | 'luogo' | 'persone' | 'nome' | 'contatto' | 'messaggio' | 'dj_tipo', string>>;

/** Formats where a DJ from the collaborators can be booked. */
export const TIPI_CON_DJ_COLLAB: Tipo[] = ['matrimonio', 'aziendale'];
export const DJ_CONSIGLIATO = 'Consigliatemelo voi';

const oggiISO = () => new Date().toISOString().slice(0, 10);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO = /^\+?[\d\s./-]{6,20}$/;

export function validaRichiesta(c: Record<string, string | undefined>):
  | { ok: true; richiesta: Richiesta }
  | { ok: false; errori: Errori } {
  const t = (k: string) => (c[k] ?? '').trim();
  const errori: Errori = {};

  const tipo = t('tipo') as Tipo;
  if (!(tipo in TIPI)) errori.tipo = 'Scegli che festa è.';

  const data = t('data') || null;
  if (data && (!/^\d{4}-\d{2}-\d{2}$/.test(data) || data < oggiISO())) {
    errori.data = 'Questa data è già passata: scegline una da oggi in poi.';
  }

  const luogo = t('luogo');
  if (luogo.length < 2) errori.luogo = 'Dicci dove: basta la città.';
  else if (luogo.length > 120) errori.luogo = 'Accorcia un po\': bastano città e locale.';

  const personeTesto = t('persone');
  const persone = personeTesto ? Number(personeTesto) : null;
  if (persone !== null && (!Number.isInteger(persone) || persone < 1 || persone > 5000)) {
    errori.persone = 'Scrivi un numero, anche a occhio.';
  }

  const nome = t('nome');
  if (nome.length < 2) errori.nome = 'Come ti chiami?';
  else if (nome.length > 80) errori.nome = 'Il nome è troppo lungo.';

  const contatto = t('contatto');
  if (!EMAIL.test(contatto) && !TELEFONO.test(contatto)) {
    errori.contatto = 'Lasciaci un\'email o un numero di telefono per risponderti.';
  }

  const messaggio = t('messaggio') || null;
  if (messaggio && messaggio.length > 2000) errori.messaggio = 'Il messaggio è troppo lungo (massimo 2000 caratteri).';

  // DJ after the gig: Chambers for any party; a collaborator DJ only for weddings and corporate events.
  const djTipoTesto = t('dj_tipo');
  const djTipo = djTipoTesto === 'chambers' || djTipoTesto === 'collab' ? djTipoTesto : null;
  if (djTipoTesto && !djTipo) errori.dj_tipo = 'Scelta del DJ non valida.';
  if (djTipo === 'collab' && !TIPI_CON_DJ_COLLAB.includes(tipo)) errori.dj_tipo = 'Il DJ dei collaboratori è per matrimoni ed eventi aziendali.';
  const djCollab = djTipo === 'collab' ? (t('dj_collab') || DJ_CONSIGLIATO).slice(0, 80) : null;

  if (Object.keys(errori).length) return { ok: false, errori };
  return { ok: true, richiesta: { tipo, data, luogo, persone, nome, contatto, messaggio, dj: djTipo !== null, djTipo, djCollab } };
}
