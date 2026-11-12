import { EMAIL_FROM, EMAIL_NOTIFICHE, RESEND_API_KEY } from 'astro:env/server';
import { NonConfigurato } from './supabase';

type Messaggio = { to: string; subject: string; text: string; replyTo?: string };

/** Sends one plain-text email through Resend's HTTP API. Throws on failure. */
export async function inviaEmail(m: Messaggio): Promise<void> {
  if (!RESEND_API_KEY) throw new NonConfigurato('Resend (RESEND_API_KEY)');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [m.to],
      subject: m.subject,
      text: m.text,
      ...(m.replyTo ? { reply_to: m.replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

/** Where booking notifications go (the band's inbox). Null when not configured. */
export const destinatarioNotifiche = () => EMAIL_NOTIFICHE || null;
