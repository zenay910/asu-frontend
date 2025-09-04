create table items_public (
  sku char(4) primary key
    references items_new(sku)
    on update cascade
    on delete cascade,
  title text not null,
  price numeric(10,2),
  dimensions jsonb,                -- {"width":27,"height":38,"depth":31}
  capacity numeric(4,2),           -- 4.50 etc.
  fuel text check (fuel in ('Gas','Electric')),
  color text,
  features text[],                 -- or switch to jsonb if you prefer
  warranty_text text,
  delivery_installation_text text,
  return_policy_text text,
  description_long text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
