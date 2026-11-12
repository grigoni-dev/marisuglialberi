// Upcoming gigs. For now an empty list: the admin panel (Phase 1, feature 5) will
// move them to Supabase. Never put demo dates here: the published site shows this list.
export type Concerto = { data: string; ora?: string; luogo: string; citta: string; link?: string };

export const prossimeDate: Concerto[] = [];

/** The next gig from today on, or null. */
export function prossimoConcerto(oggi = new Date().toISOString().slice(0, 10)): Concerto | null {
  return [...prossimeDate].filter((c) => c.data >= oggi).sort((a, b) => a.data.localeCompare(b.data))[0] ?? null;
}

export const formatoDataLunga = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
