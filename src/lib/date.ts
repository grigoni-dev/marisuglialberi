// Gig dates. The public site reads the `concerti_pubblici` view on Supabase, which never
// exposes venue, link or notes of private parties (see supabase/migrations/0002).
import { supabasePubblico } from './supabase';

export type Concerto = {
  id: string;
  data: string; // YYYY-MM-DD
  ora: string | null; // HH:MM:SS
  citta: string;
  locale: string | null;
  link: string | null;
  privato: boolean;
};

const COLONNE = 'id,data,ora,citta,locale,link,privato';

/** Today in Italy, as YYYY-MM-DD: a gig becomes "past" the day after. */
export const oggiRoma = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });

/** All public gigs split into upcoming (soonest first) and past (latest first). Empty when Supabase isn't configured. */
export async function dateConcerti(): Promise<{ prossime: Concerto[]; passate: Concerto[] }> {
  const sb = supabasePubblico();
  if (!sb) return { prossime: [], passate: [] };
  const { data, error } = await sb.from('concerti_pubblici').select(COLONNE).order('data', { ascending: true }).order('ora', { ascending: true });
  if (error) {
    console.error('concerti_pubblici', error);
    return { prossime: [], passate: [] };
  }
  const oggi = oggiRoma();
  const tutte = (data ?? []) as Concerto[];
  return {
    prossime: tutte.filter((c) => c.data >= oggi),
    passate: tutte.filter((c) => c.data < oggi).reverse(),
  };
}

export async function concerto(id: string): Promise<Concerto | null> {
  const sb = supabasePubblico();
  if (!sb || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await sb.from('concerti_pubblici').select(COLONNE).eq('id', id).maybeSingle();
  return (data as Concerto) ?? null;
}

export const formatoDataLunga = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });

export const formatoDataCompleta = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const formatoOra = (ora: string | null) => (ora ? ora.slice(0, 5).replace(':', '.') : null);

/** "Locale, Città" for public gigs, "Festa privata, Città" for private ones. */
export const dove = (c: Pick<Concerto, 'privato' | 'locale' | 'citta'>) =>
  c.privato ? `Festa privata, ${c.citta}` : c.locale ? `${c.locale}, ${c.citta}` : c.citta;
