import supabase from './supabaseClient';

const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'appliances';

type TransformOpts = {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'webp' | 'origin';
};

export function toPublicUrl(path: string, opts?: TransformOpts) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  let url = data.publicUrl;
  const params: Record<string, any> = {};
  if (opts?.width) params.width = opts.width;
  if (opts?.height) params.height = opts.height;
  if (opts?.quality) params.quality = opts.quality;
  if (opts?.format && opts.format !== 'origin') params.format = opts.format;
  const keys = Object.keys(params);
  if (keys.length) {
    const sp = keys.map(k => `${k}=${encodeURIComponent(params[k])}`).join('&');
    url += (url.includes('?') ? '&' : '?') + sp;
  }
  return url;
}