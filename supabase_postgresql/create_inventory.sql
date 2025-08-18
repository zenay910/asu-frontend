-- 1) Items table
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  sku text unique,                                 -- e.g., W-000123
  category text check (category in ('Washer','Dryer','Stove')),
  brand text,
  model_number text,
  condition text,                                   -- Refurbished, Used, New, Parts
  price numeric(10,2),
  purchase_price numeric(10,2),
  status text default 'Draft',                      -- Draft, Published, Reserved, In_Repair, Sold
  notes text,
  created_at timestamptz default now()
);