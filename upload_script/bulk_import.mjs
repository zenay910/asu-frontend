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

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Load .env from the script directory so running the script from elsewhere works
dotenv.config({ path: path.resolve(__dirname, '.env') });

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

function maskKey(k) {
  if (!k) return null;
  return k.length > 8 ? `${k.slice(0,6)}...${k.slice(-2)}` : '***';
}

const csvPath       = path.resolve(process.cwd(), csvPathArg);
const photosRoot    = path.resolve(process.cwd(), photosRootArg);
// No secondary public CSV – unified now.


// ---------- helpers ----------
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const CONTENT_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const norm = (v) => (v ?? '').toString().trim() || null;
const cleanMoney = (v) => (v === null || v === undefined || v === '' ? null : Number(String(v).replace(/[^0-9.]/g, '')));

function parseDimensionsField(s) {
  if (!s) return null;
  const t = String(s).trim();
  if (!t) return null;
  // Try JSON first
  if (/^[\[{]/.test(t)) {
    try { return JSON.parse(t); } catch (e) { /* fallthrough */ }
  }
  // Fallback: extract numbers (inches format like "29" W, 28" D, 43" H")
  const nums = [...t.matchAll(/(\d+(?:\.\d+)?)/g)].map(m => Number(m[1]));
  if (nums.length === 0) return null;
  const obj = {};
  if (nums.length >= 1) obj.width_in = nums[0];
  if (nums.length >= 2) obj.depth_in = nums[1];
  if (nums.length >= 3) obj.height_in = nums[2];
  obj.unit_of_measure = 'inches';
  return obj;
}

const ALLOWED = {
  category: new Set(['Washer','Dryer','Stove']),
  configuration: new Set([
    'Front Load','Top Load','Stacked Unit','Standard','Slide-In','Glass Cooktop', 'Coil Cooktop'
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

function sanitizeNameForFolder(s) {
  if (!s) return null;
  return String(s).trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s/g, ' ');
}

function listSampleFolders(root, max=6) {
  try {
    const all = fs.readdirSync(root).filter(n => fs.statSync(path.join(root,n)).isDirectory());
    return all.slice(0,max);
  } catch (e) { return []; }
}

function findPhotoDir(root, title, model_number, photo_folder_hint) {
  const candidates = [];
  if (photo_folder_hint) candidates.push(photo_folder_hint);
  if (title) candidates.push(title);
  if (model_number) candidates.push(model_number);
  const sanitized = sanitizeNameForFolder(title);
  if (sanitized && sanitized !== title) candidates.push(sanitized);

  // Try direct and case-insensitive matches
  for (const c of candidates) {
    if (!c) continue;
    const p = path.join(root, c);
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) return p;
  }

  // Case-insensitive search among directories
  try {
    const dirs = fs.readdirSync(root).filter(n => fs.statSync(path.join(root,n)).isDirectory());
    const lower = new Map(dirs.map(d => [d.toLowerCase(), d]));
    for (const c of candidates) {
      const found = lower.get(String(c).toLowerCase());
      if (found) return path.join(root, found);
    }
    // Try numeric folder mapping: if model_number contains digits, match folders that contain those digits
    for (const c of candidates) {
      const digits = String(c).match(/\d+/g)?.join('');
      if (!digits) continue;
      const match = dirs.find(d => d.includes(digits));
      if (match) return path.join(root, match);
    }
  } catch (e) {
    return null;
  }

  return null;
}

async function photoRowExists(itemId, objectPath) {
  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;

  const { data, error } = await supabase
    .from('product_images')
    .select('id')
    .eq('product_id', itemId)
    .eq('photo_url', objectPath)
    .limit(1);

  if (!error && Array.isArray(data) && data.length > 0) {
    return true;
  }

  const { data: absData, error: absErr } = await supabase
    .from('product_images')
    .select('id')
    .eq('product_id', itemId)
    .eq('photo_url', publicUrl)
    .limit(1);

  if (absErr) {
    console.error('Check existing photo failed:', itemId, objectPath, absErr);
    return false;
  }

  if (Array.isArray(absData) && absData.length > 0) {
    return true;
  }

  if (error) {
    console.error('Check existing photo failed:', itemId, objectPath, error);
    return false;
  }
  return false;
}

// ---------- main ----------
async function main() {
  // Preflight: verify we can reach the SUPABASE_URL to detect DNS/network issues early
  try {
    const res = await fetch(SUPABASE_URL, { method: 'GET' });
    console.log('Supabase URL reachable, status:', res.status);
  } catch (e) {
    console.error('Network fetch to SUPABASE_URL failed:', e.message);
    console.error('Check SUPABASE_URL, network, VPN, or firewall. SUPABASE_URL:', SUPABASE_URL, 'SERVICE_ROLE:', maskKey(SERVICE_ROLE));
    process.exit(1);
  }

  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath);
    process.exit(1);
  }
  const csvRaw = fs.readFileSync(csvPath, 'utf-8');
  // Remove BOM if present and normalize headers to simple snake_case lowercase
  const cleanCsv = csvRaw.replace(/^\uFEFF/, '');
  const rows = parse(cleanCsv, {
    columns: (header) => header.map(h => (h ?? '').toString().replace(/^\uFEFF/, '').trim().toLowerCase().replace(/\s+/g, '_')),
    skip_empty_lines: true,
  });

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
      // CSV uses `type` column in your DB (not `category`). Map it directly.
      const typeVal       = norm(r.type);
      const type          = typeVal || null;
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
        try {
          dimensions = parseDimensionsField(r.dimensions);
          if (!dimensions) throw new Error('unable to parse');
        } catch (e) {
          console.warn(`Bad dimensions JSON for ${title}: ${e.message || e}`);
          dimensions = null;
        }
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

      // Required column checks (DB has `price` NOT NULL)
      if (price === null) {
        console.error(`Row ${idx+1}: missing required price. Skipping ${title}.`);
        continue;
      }

      const upsertPayload = {
        title,
        brand,
        price,
        model_number,
        type,
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
      let upsertedItem = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(upsertPayload)
          .select('id')
          .single();
        if (error) {
          console.error('Insert failed for', title);
          try {
            console.error('Supabase error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
          } catch (ee) {
            console.error('Supabase error (raw):', error);
          }
          continue;
        }
        upsertedItem = data;
        if (!upsertedItem || !upsertedItem.id) {
          console.error('Insert returned no id for', title, JSON.stringify(data));
          continue;
        }
      } catch (upErr) {
        console.error('Insert exception for', title, String(upErr));
        if (upErr?.message && String(upErr.message).toLowerCase().includes('fetch failed')) {
          console.error('Likely a network/DNS error or incorrect SUPABASE_URL/SERVICE_ROLE. SUPABASE_URL:', SUPABASE_URL, 'SERVICE_ROLE:', maskKey(SERVICE_ROLE));
        }
        continue;
      }
      
      const itemId = upsertedItem.id;

      // ========== IMAGE UPLOAD SECTION COMMENTED OUT ==========
      // TODO: Determine new image organization strategy now that SKU is removed
      // Options: Use item ID, title, or another unique identifier
      
      // Photos for this item (optional). Try multiple folder-name heuristics.
      const photo_folder_hint = norm(r.photo_folder) || null;
      const dir = findPhotoDir(photosRoot, title, model_number, photo_folder_hint);
      let files = [];
      if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
        const sample = listSampleFolders(photosRoot).join(', ');
        console.warn(`No photo folder for ${title} (tried: ${photo_folder_hint||title||model_number}). Available sample folders: ${sample}`);
        console.warn(`Skipping photos for ${title}.`);
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

            // Insert photo row into `product_images` if missing
            const exists = await photoRowExists(itemId, objectPath);
            if (!exists) {
              const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
              const { error: insErr } = await supabase
                .from('product_images')
                .insert({ product_id: itemId, photo_url: publicUrl });
              if (insErr) console.error('DB insert photo failed', title, objectPath, insErr);
            }
          }
        }
      }

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
