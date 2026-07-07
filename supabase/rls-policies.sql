-- Solar Inventory UI - Supabase RLS policies
-- Run this file in Supabase SQL Editor after creating the schema.
--
-- Why this is needed:
-- The frontend uses NEXT_PUBLIC_SUPABASE_ANON_KEY, so Supabase queries run as
-- the anon role. If Row Level Security is enabled without matching policies,
-- the browser can connect successfully but will see zero rows.
--
-- This demo app has no login system yet, so these policies allow public CRUD
-- for categories and products. Tighten these rules before production use.

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;
alter table public.suppliers enable row level security;
alter table public.warehouses enable row level security;

drop policy if exists "categories public read" on public.categories;
create policy "categories public read"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "categories public insert" on public.categories;
create policy "categories public insert"
on public.categories
for insert
to anon, authenticated
with check (true);

drop policy if exists "categories public update" on public.categories;
create policy "categories public update"
on public.categories
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "categories public delete" on public.categories;
create policy "categories public delete"
on public.categories
for delete
to anon, authenticated
using (true);

drop policy if exists "products public read" on public.products;
create policy "products public read"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "products public insert" on public.products;
create policy "products public insert"
on public.products
for insert
to anon, authenticated
with check (true);

drop policy if exists "products public update" on public.products;
create policy "products public update"
on public.products
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "products public delete" on public.products;
create policy "products public delete"
on public.products
for delete
to anon, authenticated
using (true);

drop policy if exists "stock movements public read" on public.stock_movements;
create policy "stock movements public read"
on public.stock_movements
for select
to anon, authenticated
using (true);

drop policy if exists "suppliers public read" on public.suppliers;
create policy "suppliers public read"
on public.suppliers
for select
to anon, authenticated
using (true);

drop policy if exists "warehouses public read" on public.warehouses;
create policy "warehouses public read"
on public.warehouses
for select
to anon, authenticated
using (true);
