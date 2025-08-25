// bulk_import.mjs  (Node 18+ / ESM)
// ----------------------------------
// Setup:
//   npm i @supabase/supabase-js csv-parse dotenv
// .env:
//   SUPABASE_URL=https://YOURPROJECT.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   (NEVER commit this)
//   BUCKET=appliances
//
// Usage:
//   node bulk_import.mjs /path/to/Items.csv /path/to/photos
//
// CSV headers (exact):
//   sku,brand,model_number,type,configuration,unit_type,fuel,condition,price,status,notes
//   W-250824-001,LG,WM4000HWA,Washer,Front Load,Individual,,Refurbished,349,Published,"minor scratch"
//
// Photos folder layout:
//   photos/
//     W-250824-001/
//       1.jpg
//       2.jpg
//       cover.jpg
//
// Notes:
// - Upserts into brands_new(name) and sets items_new.brand_id
// - Upserts into items_new by sku
// - Uploads photos to:  <bucket>/<item_id>/original/001.jpg (etc.)
// - Stores DB path WITHOUT bucket, e.g.:  <item_id>/original/001.jpg
// - First sorted photo becomes role='cover', rest 'gallery'

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
  console.error('Usage: node bulk_import.mjs <Items.csv> <photosRoot>');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET       = process.env.BUCKET || 'appliances';
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { Authorization: `Bearer ${SERVICE_ROLE}` } },
});

const csvPath    = path.resolve(process.cwd(), csvPathArg);
const photosRoot = path.resolve(process.cwd(), photosRootArg);

// ---------- helpers ----------
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const CONTENT_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const norm = (v) => (v ?? '').toString().trim() || null;
const cleanMoney = (v) => (v === null || v === undefined || v === '' ? null : Number(String(v).replace(/[^0-9.]/g, '')));

const ALLOWED = {
  type: new Set(['Washer','Dryer','Stove','Range']),
  configuration: new Set([
    'Front Load','Top Load','Stacked Unit','Standard','Slide-In','Cooktop'
  ]), // keep/edit to your vocabulary; it is text in DB, but we validate to catch typos
  unit_type: new Set(['Individual','Set']),
  fuel: new Set(['Electric','Gas','']), // allow blank as empty
  condition: new Set(['New','Refurbished','Used','For Parts']),
  status: new Set(['Draft','Published','Archived']),
};

function validateEnum(name, value) {
  if (value == null || value === '') return null;
  if (!ALLOWED[name].has(value)) {
    throw new Error(`Invalid ${name} "${value}". Allowed: ${[...ALLOWED[name]].join(', ')}`);
  }
  return value;
}

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

async function upsertBrandGetId(name) {
  if (!name) return null;
  const clean = name.trim();
  const { data, error } = await supabase
    .from('brands_new')
    .upsert({ name: clean }, { onConflict: 'name' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

async function photoRowExists(itemId, objectPath) {
  const { data, error } = await supabase
    .from('item_photos_new')
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

// ---------- main ----------
async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath);
    process.exit(1);
  }
  const csvRaw = fs.readFileSync(csvPath, 'utf-8');
  const rows   = parse(csvRaw, { columns: true, skip_empty_lines: true });

  if (!fs.existsSync(photosRoot) || !fs.statSync(photosRoot).isDirectory()) {
    console.error('Photos root not found or not a directory:', photosRoot);
    process.exit(1);
  }

  console.log(`Importing ${rows.length} rows from ${csvPath}`);
  console.log(`Photos root: ${photosRoot}`);
  console.log(`Bucket: ${BUCKET}`);

  for (let idx = 0; idx < rows.length; idx++) {
    try {
      const r = rows[idx];

      const sku           = norm(r.sku);
      const brandName     = norm(r.brand);
      const model_number  = norm(r.model_number);
      const type          = validateEnum('type', norm(r.type));
      const configuration = norm(r.configuration); // validate optionally below depending on type
      const unit_type     = validateEnum('unit_type', norm(r.unit_type));
      const fuelVal       = norm(r.fuel);
      const fuel          = fuelVal ? validateEnum('fuel', fuelVal) : null;
      const condition     = validateEnum('condition', norm(r.condition));
      const price         = cleanMoney(r.price);
      const status        = validateEnum('status', norm(r.status) || 'Draft');
      const notes         = norm(r.notes);

      if (!sku || !type) {
        console.error(`Row ${idx+1}: missing sku or type. Skipping.`);
        continue;
      }

      // Optional: configuration sanity
      // You can relax this if you want full free-text:
      if (configuration) {
        // we only check against known list; comment out next line to allow any string
        validateEnum('configuration', configuration);
      }

      // Brand upsert/lookup
      const brand_id = await upsertBrandGetId(brandName || '');

      // Upsert item into items_new by sku
      const upsertPayload = {
        sku,
        brand_id,
        model_number,
        type,                // enum in DB
        configuration,
        unit_type: unit_type || 'Individual',
        fuel,                // enum or null
        condition: condition || 'Used',
        price,
        status,
        notes,
      };

      const { data: upserted, error: upErr } = await supabase
        .from('items_new')
        .upsert(upsertPayload, { onConflict: 'sku' })
        .select('id')
        .single();

      if (upErr) {
        console.error('Upsert failed for', sku, upErr);
        continue;
      }
      const itemId = upserted.id;

      // Photos for this SKU (optional)
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

      for (let i = 0; i < files.length; i++) {
        const filename    = files[i];
        const ext         = filename.split('.').pop().toLowerCase();
        const contentType = guessType(filename);
        const storageName = String(i+1).padStart(3,'0') + '.' + ext;
        const objectPath  = `${itemId}/original/${storageName}`;
        const body        = fs.readFileSync(path.join(dir, filename));

        // Cheap existence check
        const list = await supabase.storage.from(BUCKET).list(`${itemId}/original`, { search: storageName });
        const alreadyUploaded = Array.isArray(list.data) && list.data.some(f => f.name === storageName);

        if (!alreadyUploaded) {
          console.log(`Uploading ${sku} -> ${objectPath}`);
          const { error: upErr2 } = await supabase.storage
            .from(BUCKET)
            .upload(objectPath, body, { cacheControl: '3600', upsert: true, contentType });
          if (upErr2) {
            console.error('UPLOAD ERR', sku, objectPath, upErr2);
            continue;
          }
          await sleep(40);
        }

        // Insert item_photos_new row if missing
        const exists = await photoRowExists(itemId, objectPath);
        if (!exists) {
          const role = i === 0 ? 'cover' : 'gallery';
          const { error: insErr } = await supabase
            .from('item_photos_new')
            .insert({ item_id: itemId, path: objectPath, role, sort_order: i+1 });
          if (insErr) console.error('DB insert photo failed', sku, objectPath, insErr);
        }
      }

      console.log(`✓ Imported ${sku} (${files.length} photos)`);
    } catch (e) {
      console.error(`Row ${idx+1} error:`, e.message);
    }
  }

  console.log('All done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
