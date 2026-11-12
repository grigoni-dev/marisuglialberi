// Photo gallery: one public gallery, newest first. Files live in the public "foto" bucket.
import { PUBLIC_SUPABASE_URL } from 'astro:env/client';
import { supabasePubblico } from './supabase';

export type Foto = {
  id: string;
  grande: string;
  thumb: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  alt: string;
};

export const ALT_PREDEFINITO = 'Foto dal vivo di Mari sugli alberi';
export const urlFoto = (path: string) => `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/foto/${path}`;

export async function fotoPubbliche(): Promise<Foto[]> {
  const sb = supabasePubblico();
  if (!sb) return [];
  const { data, error } = await sb
    .from('foto')
    .select('id,path,thumb_path,width,height,thumb_width,thumb_height,alt')
    .eq('pubblicata', true)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('foto', error);
    return [];
  }
  return (data ?? []).map((f) => ({
    id: f.id,
    grande: urlFoto(f.path),
    thumb: urlFoto(f.thumb_path),
    width: f.width,
    height: f.height,
    thumbWidth: f.thumb_width,
    thumbHeight: f.thumb_height,
    alt: f.alt || ALT_PREDEFINITO,
  }));
}
