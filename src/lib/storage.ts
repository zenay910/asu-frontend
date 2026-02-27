import supabase from './supabaseClient';

const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'appliances';

type TransformOpts = {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'webp' | 'origin';
};

function normalizeStoragePath(input: string) {
  const value = String(input || '').trim();
  if (!value) return value;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const marker = `/object/public/${bucket}/`;
  const markerIndex = value.indexOf(marker);
  if (markerIndex >= 0) {
    return value.slice(markerIndex + marker.length);
  }

  return value.replace(/^\/+/, '');
}

export function toPublicUrl(path: string, opts?: TransformOpts) {
  const normalized = normalizeStoragePath(path);
  let url = /^https?:\/\//i.test(normalized)
    ? normalized
    : supabase.storage.from(bucket).getPublicUrl(normalized).data.publicUrl;

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