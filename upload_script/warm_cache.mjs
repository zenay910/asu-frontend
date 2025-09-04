#!/usr/bin/env node
// Warm cache for top N published items by fetching their cover + thumb URLs.
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY; // needs read on storage + select on items/item_photos
const LIMIT = Number(process.argv[2] || 25);
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession:false, autoRefreshToken:false } });

function buildPublic(path, params='') {
  // mirror logic of toPublicUrl but minimal for warming (no anon client here)
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'appliances';
  // Public URL pattern (depends on your project ref). Safer: use storage API.
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  const base = data.publicUrl;
  return params ? (base + (base.includes('?') ? '&' : '?') + params) : base;
}

(async function main(){
  const { data, error } = await supabase
    .from('items')
    .select('sku, photos:item_photos(path, role, sort_order)')
    .eq('status','Published')
    .limit(LIMIT);
  if (error) { console.error(error); process.exit(1); }

  let urls = [];
  for (const row of data || []) {
    const photos = (row.photos||[]).sort((a,b)=>{
      const ac = (a.role==='cover')? -1:0; const bc=(b.role==='cover')?-1:0; if(ac!==bc) return ac-bc; return (a.sort_order||999)-(b.sort_order||999);
    });
    if (photos[0]) {
      urls.push(buildPublic(photos[0].path,'width=300&quality=60&format=webp'));
      urls.push(buildPublic(photos[0].path,'width=1200&quality=75&format=webp'));
    }
  }
  console.log(`Fetching ${urls.length} URLs to warm cache...`);
  const fetches = urls.map(u => fetch(u).then(r=>({u, ok:r.ok, status:r.status})).catch(e=>({u, ok:false, status:e.message})));
  const results = await Promise.all(fetches);
  const failures = results.filter(r=>!r.ok);
  results.forEach(r=> console.log(`${r.ok?'✓':'✗'} ${r.status} ${r.u}`));
  console.log(`Done. Failures: ${failures.length}`);
})();
