-- Solar Inventory UI - Product image storage
-- Run in Supabase SQL Editor if product image upload fails because the bucket
-- or public policies do not exist yet.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "product images public insert" on storage.objects;
create policy "product images public insert"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'product-images');

drop policy if exists "product images public update" on storage.objects;
create policy "product images public update"
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');
