import type { APIRoute } from 'astro';
import { creaGettone, GIOCHI, type Gioco } from '../../../lib/giochi/gettone';

export const prerender = false;

/** A new game starts: returns the signed start token. */
export const POST: APIRoute = async ({ request }) => {
  const { gioco } = await request.json().catch(() => ({}));
  if (!GIOCHI.includes(gioco)) return new Response(JSON.stringify({ errore: 'gioco' }), { status: 400 });
  return new Response(JSON.stringify({ gettone: await creaGettone(gioco as Gioco) }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
