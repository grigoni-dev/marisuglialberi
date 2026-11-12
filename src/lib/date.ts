// Upcoming gigs. For now an empty list: the admin panel (Phase 1, feature 5) will
// move them to Supabase. Never put demo dates here: the published site shows this list.
export type Concerto = { data: string; ora?: string; luogo: string; citta: string; link?: string };

export const prossimeDate: Concerto[] = [];
