-- 2) Item photos table (child)
create table if not exists public.item_photos (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  path text not null,                               -- e.g., appliances/<item_id>/original/1.jpg
  role text default 'gallery',                      -- cover | gallery | thumb
  sort_order int default 0,
  created_at timestamptz default now()
);