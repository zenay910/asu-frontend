import supabase from './supabaseClient';

const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'appliances';

export function toPublicUrl(path: string, opts?: { width?: number; height?: number }) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  let url = data.publicUrl;
  if (opts?.width)  url += `${url.includes('?') ? '&' : '?'}width=${opts.width}`;
  if (opts?.height) url += `${url.includes('?') ? '&' : '?'}height=${opts.height}`;
  return url;
}