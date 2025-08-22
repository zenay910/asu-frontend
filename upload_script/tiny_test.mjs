// tiny_storage_test.mjs
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.BUCKET || 'appliances';

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { Authorization: `Bearer ${key}` } },
});

const objectPath = `probe-${Date.now()}/original/001.jpg`;
const { error } = await supabase.storage
  .from(bucket)
  .upload(objectPath, fs.readFileSync('./test.jpg'), { contentType: 'image/jpeg' });

console.log('upload path:', objectPath);
console.log('error:', error);
