import type { APIRoute } from 'astro';
import { concerto, dove } from '../../lib/date';

export const prerender = false;

const ics = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const compatta = (iso: string) => iso.replace(/-/g, '');
const giornoDopo = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

/** "Add to calendar": one gig as an .ics file. 3 hours from the start time, or all day without one. */
export const GET: APIRoute = async ({ params, site }) => {
  const c = await concerto(params.id ?? '');
  if (!c) return new Response('Data non trovata', { status: 404 });

  let quando: string[];
  if (c.ora) {
    const [h, m] = c.ora.split(':').map(Number);
    const fine = h + 3;
    const giornoFine = fine >= 24 ? giornoDopo(c.data) : c.data;
    const hh = (n: number) => String(n % 24).padStart(2, '0');
    quando = [
      `DTSTART;TZID=Europe/Rome:${compatta(c.data)}T${hh(h)}${String(m).padStart(2, '0')}00`,
      `DTEND;TZID=Europe/Rome:${compatta(giornoFine)}T${hh(fine)}${String(m).padStart(2, '0')}00`,
    ];
  } else {
    quando = [`DTSTART;VALUE=DATE:${compatta(c.data)}`, `DTEND;VALUE=DATE:${compatta(giornoDopo(c.data))}`];
  }

  const corpo = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mari sugli alberi//Date//IT',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${c.id}@marisuglialberi`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    ...quando,
    `SUMMARY:${ics(c.privato ? 'Mari sugli alberi (festa privata)' : 'Mari sugli alberi dal vivo')}`,
    `LOCATION:${ics(dove(c))}`,
    `URL:${new URL('/date', site).href}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');

  return new Response(corpo, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="mari-sugli-alberi-${c.data}.ics"`,
      'Cache-Control': 'public, s-maxage=300',
    },
  });
};
