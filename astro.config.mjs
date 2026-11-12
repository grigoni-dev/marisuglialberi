import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// Static by default; only pages with live data and the API routes opt out
// with `export const prerender = false` and run as Vercel functions.
export default defineConfig({
  site: 'https://marisuglialberi.vercel.app',
  adapter: vercel(),
  env: {
    schema: {
      // Public address of the site, for absolute links (emails, share previews).
      SITE_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      // Supabase: URL and anon key are public (used behind RLS).
      PUBLIC_SUPABASE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      // Server only, never shipped to the browser.
      SUPABASE_SERVICE_ROLE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Resend: sends booking requests to the band's inbox.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMAIL_FROM: envField.string({ context: 'server', access: 'secret', default: 'Mari sugli alberi <onboarding@resend.dev>' }),
      // The band's inbox for booking notifications (kept out of the public repo).
      EMAIL_NOTIFICHE: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Salt for hashing IPs in the rate limiter, so they are never stored in clear.
      RATE_LIMIT_SALT: envField.string({ context: 'server', access: 'secret', default: 'marisuglialberi' }),
    },
  },
});
