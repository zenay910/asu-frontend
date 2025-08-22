// bulk_import.mjs  (Node 18+ / ESM)
// ----------------------------------
// Setup:
//   npm i @supabase/supabase-js csv-parse dotenv
//   Create .env with:
//     SUPABASE_URL=https://YOURPROJECT.supabase.co
//     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   (NEVER commit this)
//     BUCKET=appliances
//
// Usage:
//   node bulk_import.mjs /path/to/inventory.csv /path/to/photos
//
// CSV headers (example):
//   sku,category,brand,model_number,condition,price,status,notes
//   W-250819-001,Washer,Whirlpool,WTW5000DW,Refurbished,399,Published,"minor scratch"
//
// Photos folder layout:
//   photos/
//     W-250819-001/
//       1.jpg
//       2.jpg
//       model-plate.jpg
//
// Notes:
// - Script upserts items by sku
// - Uploads photos to:  <bucket>/<item_id>/original/001.jpg etc.
// - Stores DB path WITHOUT bucket, e.g.:  <item_id>/original/001.jpg
// - First photo becomes role='cover', rest 'gallery'

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const [,, csvPathArg, photosRootArg] = process.argv;
if (!csvPathArg || !photosRootArg) {
  console.error('Usage: node bulk_import.mjs <inventory.csv> <photosRoot>');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET       = process.env.BUCKET || 'appliances';

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}
console.log('Using service key?', (SERVICE_ROLE || '').length > 30);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { Authorization: `Bearer ${SERVICE_ROLE}` } },
});

const csvPath   = path.resolve(process.cwd(), csvPathArg);
const photosRoot= path.resolve(process.cwd(), photosRootArg);

// ---------------- helpers ----------------
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const CONTENT_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

function cleanMoney(v) {
  if (v === null || v === undefined || v === '') return null;
  return Number(String(v).replace(/[^0-9.]/g, ''));
}
function norm(str) { return (str ?? '').toString().trim(); }

function sortFilesSmart(files) {
  // Prefer names starting with "1" or containing "cover"
  return [...files].sort((a, b) => {
    const aCover = /^1[^0-9]?/.test(a) || /cover/i.test(a);
    const bCover = /^1[^0-9]?/.test(b) || /cover/i.test(b);
    if (aCover && !bCover) return -1;
    if (!aCover && bCover) return 1;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

function guessType(name) {
  const ext = name.toLowerCase().split('.').pop();
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

async function photoRowExists(itemId, objectPath) {
  const { data, error } = await supabase
    .from('item_photos')
    .select('id')
    .eq('item_id', itemId)
    .eq('path', objectPath)
    .limit(1);
  if (error) {
    console.error('Check existing photo failed:', itemId, objectPath, error);
    return false;
  }
  return Array.isArray(data) && data.length > 0;
}

// ---------------- main ----------------
async function main() {
  // Read CSV
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath);
    process.exit(1);
  }
  const csvRaw = fs.readFileSync(csvPath, 'utf-8');
  const rows   = parse(csvRaw, { columns: true, skip_empty_lines: true });

  // Quick check photos root
  if (!fs.existsSync(photosRoot) || !fs.statSync(photosRoot).isDirectory()) {
    console.error('Photos root not found or not a directory:', photosRoot);
    process.exit(1);
  }

  console.log(`Importing ${rows.length} rows from ${csvPath}`);
  console.log(`Photos root: ${photosRoot}`);
  console.log(`Bucket: ${BUCKET}`);

  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];
    const sku           = norm(r.sku);
    const category      = norm(r.category); // Washer | Dryer | Stove
    const brand         = norm(r.brand);
    const model_number  = norm(r.model_number);
    const condition     = norm(r.condition);
    const price         = cleanMoney(r.price);
    const status        = norm(r.status) || 'Draft';
    const notes         = norm(r.notes);

    if (!sku || !category) {
      console.error(`Row ${idx+1}: missing sku or category. Skipping.`);
      continue;
    }

    // 1) Upsert item (by sku)
    const { data: upserted, error: upErr } = await supabase
      .from('items')
      .upsert([{ sku, category, brand, model_number, condition, price, status, notes }], { onConflict: 'sku' })
      .select('id')
      .single();

    if (upErr) {
      console.error('Upsert failed for', sku, upErr);
      continue; // move to next row
    }
    const itemId = upserted.id;

    // 2) Collect photos for this SKU
    const dir = path.join(photosRoot, sku);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      console.warn(`No photo folder for ${sku} at ${dir}. Skipping photos.`);
      continue;
    }

    let files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
    files = files.filter(f => /\.(jpe?g|png|webp)$/i.test(f));
    if (files.length === 0) {
      console.warn(`No image files for ${sku} in ${dir}.`);
      continue;
    }
    files = sortFilesSmart(files);

    // 3) Upload each photo + insert item_photos row
    for (let i = 0; i < files.length; i++) {
      const filename   = files[i];
      const ext        = filename.split('.').pop().toLowerCase();
      const contentType= guessType(filename);
      const storageName= String(i+1).padStart(3,'0') + '.' + ext;
      const objectPath = `${itemId}/original/${storageName}`; // <-- NO BUCKET PREFIX
      const body       = fs.readFileSync(path.join(dir, filename));

      // Avoid duplicate upload (cheap check)
      const list = await supabase.storage.from(BUCKET).list(`${itemId}/original`, { search: storageName });
      const alreadyUploaded = Array.isArray(list.data) && list.data.some(f => f.name === storageName);

      if (!alreadyUploaded) {
        console.log(`Uploading ${sku} -> ${objectPath}`);
        const { error: upErr2 } = await supabase.storage
          .from(BUCKET)
          .upload(objectPath, body, { cacheControl: '3600', upsert: true, contentType });
        if (upErr2) {
          console.error('UPLOAD ERR', sku, objectPath, upErr2);
          continue; // skip DB insert for this file
        }
        // gentle throttle
        await sleep(40);
      } else {
        // console.log(`Already uploaded: ${objectPath}`);
      }

      // Insert photo row if not present (idempotent without unique constraint)
      const exists = await photoRowExists(itemId, objectPath);
      if (!exists) {
        const role = i === 0 ? 'cover' : 'gallery';
        const { error: insErr } = await supabase
          .from('item_photos')
          .insert({ item_id: itemId, path: objectPath, role, sort_order: i });
        if (insErr) {
          console.error('DB insert photo failed', sku, objectPath, insErr);
        }
      }
    }

    console.log(`✓ Imported ${sku} (${files.length} photos)`);
  }

  console.log('All done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
