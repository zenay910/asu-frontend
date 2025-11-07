// bulk_import.mjs  (Node 18+ / ESM)
// ----------------------------------
// Unified importer for the new `items` + `item_photos` schema
//
// Setup:
//   npm i @supabase/supabase-js csv-parse dotenv
// .env (service context ONLY – never ship to client):
//   SUPABASE_URL=https://YOURPROJECT.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   (NEVER commit this)
//   BUCKET=appliances
//
// Usage:
//   node bulk_import.mjs /path/to/items.csv /path/to/photos
//
// items.csv expected headers (case‑sensitive):
//   title,brand,price,model_number,category,configuration,dimensions,capacity,fuel,unit_type,color,features,condition,status,description_long
// Required: title (others optional). Unknown columns are ignored.
//   dimensions should be JSON: {"width":27,"height":38,"depth":31}
//   features can be JSON array OR delimited list (comma / pipe / semicolon)
//
// Photos folder layout (matched by title or id):
//   photos/
//     <TITLE>/
//       1.jpg | cover.jpg | any*.png/webp
// NOTE: Image upload is currently disabled/commented out
//
// Behavior:
//   - Upserts into items (by sku; id is UUID).
//   - Uploads photos to: <bucket>/<item_id>/original/001.jpg etc.
//   - Records each photo in item_photos with item_id=<UUID>.
//   - First sorted image (prefers filenames starting with 1 / containing 'cover') marked role='cover'.
//
// SQL reference (run separately if table lost):
//   create table if not exists item_photos (
//     id uuid primary key default gen_random_uuid(),
//     item_id uuid references items(id) on delete cascade,
//     path text not null,
//     role text check (role in ('cover','gallery')) default 'gallery',
//     sort_order int,
//     created_at timestamptz default now()
//   );
//   create index if not exists item_photos_item_id_idx on item_photos(item_id);

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
  console.error('Usage: node bulk_import.mjs <items.csv> <photosRoot>');
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

const csvPath       = path.resolve(process.cwd(), csvPathArg);
const photosRoot    = path.resolve(process.cwd(), photosRootArg);
// No secondary public CSV – unified now.


// ---------- helpers ----------
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const CONTENT_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const norm = (v) => (v ?? '').toString().trim() || null;
const cleanMoney = (v) => (v === null || v === undefined || v === '' ? null : Number(String(v).replace(/[^0-9.]/g, '')));

const ALLOWED = {
  category: new Set(['Washer','Dryer','Stove']),
  configuration: new Set([
    'Front Load','Top Load','Stacked Unit','Standard','Slide-In','Cooktop'
  ]),
  unit_type: new Set(['Individual','Set']),
  fuel: new Set(['Electric','Gas','']),
  condition: new Set(['New','Good','Fair','Poor']), // per new schema constraint
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

// ---------- main ----------
async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath);
    process.exit(1);
  }
  const csvRaw = fs.readFileSync(csvPath, 'utf-8');
  const rows   = parse(csvRaw, { columns: true, skip_empty_lines: true });

  // No separate public details map – unified CSV.

  if (!fs.existsSync(photosRoot) || !fs.statSync(photosRoot).isDirectory()) {
    console.error('Photos root not found or not a directory:', photosRoot);
    process.exit(1);
  }

  console.log(`Importing ${rows.length} item rows from ${csvPath}`);
  console.log(`Photos root: ${photosRoot}`);
  console.log(`Bucket: ${BUCKET}`);

  for (let idx = 0; idx < rows.length; idx++) {
    try {
      const r = rows[idx];

      const title         = norm(r.title);
      const brand         = norm(r.brand);
      const model_number  = norm(r.model_number);
      const category      = validateEnum('category', norm(r.category));
      const configuration = norm(r.configuration);
      const unit_type     = validateEnum('unit_type', norm(r.unit_type));
      const fuelVal       = norm(r.fuel);
      const fuel          = fuelVal ? validateEnum('fuel', fuelVal) : null;
      const condition     = validateEnum('condition', norm(r.condition));
      const status        = validateEnum('status', norm(r.status) || 'Draft');
      const price         = cleanMoney(r.price);
      const color         = norm(r.color);
      const capacity      = r.capacity ? Number(String(r.capacity).replace(/[^0-9.]/g,'')) : null;
      const description_long = norm(r.description_long);
      let dimensions = null;
      if (r.dimensions) {
        try { if (r.dimensions.trim()) dimensions = JSON.parse(r.dimensions); } catch (e) { console.warn(`Bad dimensions JSON for ${title}: ${e.message}`); }
      }
      let features = null;
      if (r.features) {
        if (/^[\[{]/.test(r.features.trim())) {
          try { const parsed = JSON.parse(r.features); if (Array.isArray(parsed)) features = parsed.map(f=>norm(f)).filter(Boolean); } catch {}
        } else {
          features = String(r.features).split(/[|;,]/).map(s=>norm(s)).filter(Boolean);
        }
        if (features && !features.length) features = null;
      }

      if (!title) {
        console.error(`Row ${idx+1}: missing title. Skipping.`);
        continue;
      }

      // Optional: configuration sanity
      // You can relax this if you want full free-text:
      if (configuration) {
        // we only check against known list; comment out next line to allow any string
        validateEnum('configuration', configuration);
      }

      const upsertPayload = {
        title,
        brand,
        price,
        model_number,
        category,
        configuration,
        dimensions: dimensions || null,
        capacity: capacity || null,
        fuel,
        unit_type: unit_type || 'Individual',
        color,
        features: features || null,
        condition: condition || 'Good',
        status,
        description_long,
        updated_at: new Date().toISOString(),
      };

      const { data: upsertedItem, error: upErr } = await supabase
        .from('items')
        .insert(upsertPayload)
        .select('id')
        .single();
      if (upErr) {
        console.error('Insert failed for', title, upErr);
        continue;
      }
      
      const itemId = upsertedItem.id;

      // ========== IMAGE UPLOAD SECTION COMMENTED OUT ==========
      // TODO: Determine new image organization strategy now that SKU is removed
      // Options: Use item ID, title, or another unique identifier
      /*
      // Photos for this item (optional)
      const dir = path.join(photosRoot, title); // or use itemId?
      let files = [];
      if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
        console.warn(`No photo folder for ${title} at ${dir}. Skipping photos.`);
      } else {
        files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
        files = files.filter(f => /\.(jpe?g|png|webp)$/i.test(f));
        if (files.length === 0) {
          console.warn(`No image files for ${title} in ${dir}.`);
        } else {
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
              console.log(`Uploading ${title} -> ${objectPath}`);
              const { error: upErr2 } = await supabase.storage
                .from(BUCKET)
                .upload(objectPath, body, { cacheControl: '3600', upsert: true, contentType });
              if (upErr2) {
                console.error('UPLOAD ERR', title, objectPath, upErr2);
                continue;
              }
              await sleep(40);
            }

            // Insert item_photos row if missing
            const exists = await photoRowExists(itemId, objectPath);
            if (!exists) {
              const role = i === 0 ? 'cover' : 'gallery';
              const { error: insErr } = await supabase
                .from('item_photos')
                .insert({ item_id: itemId, path: objectPath, role, sort_order: i+1 });
              if (insErr) console.error('DB insert photo failed', title, objectPath, insErr);
            }
          }
        }
      }
      */

      console.log(`✓ Imported ${title}`); // (${files.length} photos) - removed since images are disabled;
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
