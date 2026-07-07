-- Solar Inventory UI - Supabase PostgreSQL schema
-- ระบบคลังสินค้าอุปกรณ์สำหรับงานติดตั้งระบบผลิตไฟฟ้าจากแสงอาทิตย์
-- Run this file in Supabase SQL Editor.

-- Enable gen_random_uuid() for UUID primary keys.
create extension if not exists pgcrypto;

-- Shared function for automatically updating updated_at columns.
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Product categories.
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  color text,
  icon text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products store display, stock, category, image, unit, and status data only.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid references public.categories(id),
  image_url text,
  stock_quantity integer not null default 0,
  unit text not null default 'ชิ้น',
  status text not null default 'พร้อมใช้งาน',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint products_stock_quantity_non_negative check (stock_quantity >= 0),
  constraint products_status_allowed check (status in ('พร้อมใช้งาน', 'ใกล้หมด', 'หมดสต๊อก'))
);

-- Stock movement history for product quantity changes.
create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  movement_type text not null,
  quantity integer not null,
  before_quantity integer,
  after_quantity integer,
  description text,
  created_at timestamptz default now(),
  constraint stock_movements_type_allowed check (movement_type in ('IN', 'OUT', 'ADJUST')),
  constraint stock_movements_quantity_positive check (quantity > 0)
);

-- Suppliers reserved for future purchasing workflows.
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  created_at timestamptz default now()
);

-- Warehouses reserved for future multi-location stock workflows.
create table if not exists public.warehouses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  created_at timestamptz default now()
);

-- Indexes for common filtering and history queries.
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_name on public.products(name);
create index if not exists idx_stock_movements_product_id on public.stock_movements(product_id);
create index if not exists idx_stock_movements_created_at on public.stock_movements(created_at);

-- Triggers for updated_at maintenance.
drop trigger if exists update_categories_updated_at on public.categories;
create trigger update_categories_updated_at
before update on public.categories
for each row
execute function public.update_updated_at_column();

drop trigger if exists update_products_updated_at on public.products;
create trigger update_products_updated_at
before update on public.products
for each row
execute function public.update_updated_at_column();

-- Seed initial categories. ON CONFLICT prevents duplicate errors when rerun.
insert into public.categories (name, description, color, icon)
values
  ('แผงโซลาร์เซลล์', 'แผง Mono, Half-cell, Bifacial และแผงกำลังสูงสำหรับระบบ Solar', '#FACC15', '☀️'),
  ('อินเวอร์เตอร์', 'อุปกรณ์แปลงไฟสำหรับระบบ Grid Tie, Hybrid, String และ Off Grid', '#2563EB', '⚡'),
  ('แบตเตอรี่', 'แบตเตอรี่และอุปกรณ์สำรองพลังงานสำหรับระบบ Solar', '#16A34A', '🔋'),
  ('โครงสร้างติดตั้ง', 'ราง แคลมป์ และอุปกรณ์ยึดแผงสำหรับหลังคาและโครงสร้างภาคสนาม', '#64748B', '▰'),
  ('สายไฟ DC', 'สาย PV และสายไฟฝั่ง DC สำหรับเชื่อมต่อแผงเข้าระบบ', '#F97316', 'DC'),
  ('สายไฟ AC', 'สายไฟ AC สำหรับเดินระบบจากอินเวอร์เตอร์เข้าสู่ตู้ไฟและโหลด', '#06B6D4', 'AC'),
  ('MC4 Connector', 'หัวต่อ MC4 และอุปกรณ์ประกอบสำหรับงานเข้าสาย Solar', '#0EA5E9', 'MC4'),
  ('Combiner Box', 'ตู้รวมสาย DC/AC สำหรับจัดการ string และจุดป้องกัน', '#7C3AED', '▣'),
  ('Breaker DC', 'เบรกเกอร์และสวิตช์ตัดตอนฝั่ง DC สำหรับงาน Solar', '#DC2626', 'B'),
  ('Breaker AC', 'เบรกเกอร์ RCCB และ RCBO ฝั่ง AC สำหรับควบคุมและป้องกันวงจร', '#EA580C', 'AC'),
  ('Surge Protection', 'อุปกรณ์ป้องกันไฟกระชากและฟ้าผ่าสำหรับฝั่ง DC/AC', '#EAB308', 'SPD'),
  ('Grounding', 'หลักดิน สายดิน แคลมป์ และอุปกรณ์ตรวจสอบระบบกราวด์', '#059669', '⏚'),
  ('เครื่องมือช่างติดตั้ง', 'เครื่องมือสำหรับช่างติดตั้ง Solar เช่น คีมย้ำ MC4 เครื่องวัด และประแจแรงบิด', '#475569', '🛠')
on conflict (name) do nothing;

-- Seed initial products. Product names are unique in this seed insert only,
-- so rerunning this block will not duplicate existing seed products.
insert into public.products (name, category_id, image_url, stock_quantity, unit, status)
select seed.name, categories.id, seed.image_url, seed.stock_quantity, seed.unit, seed.status
from (
  values
    ('Solar Panel 550W Mono Half-cell', 'แผงโซลาร์เซลล์', '/products/solar-panel.svg', 45, 'แผง', 'พร้อมใช้งาน'),
    ('Jinko Tiger Neo 580W', 'แผงโซลาร์เซลล์', '/products/solar-panel.svg', 32, 'แผง', 'พร้อมใช้งาน'),
    ('Trina Vertex S 600W', 'แผงโซลาร์เซลล์', '/products/solar-panel.svg', 8, 'แผง', 'ใกล้หมด'),
    ('Grid Tie Inverter 5kW', 'อินเวอร์เตอร์', '/products/inverter.svg', 14, 'เครื่อง', 'พร้อมใช้งาน'),
    ('Hybrid Inverter 10kW', 'อินเวอร์เตอร์', '/products/inverter.svg', 5, 'เครื่อง', 'ใกล้หมด'),
    ('String Inverter 20kW', 'อินเวอร์เตอร์', '/products/inverter.svg', 7, 'เครื่อง', 'พร้อมใช้งาน'),
    ('LiFePO4 Battery 5kWh', 'แบตเตอรี่', '/products/battery.svg', 11, 'ชุด', 'พร้อมใช้งาน'),
    ('LiFePO4 Battery 10kWh', 'แบตเตอรี่', '/products/battery.svg', 4, 'ชุด', 'ใกล้หมด'),
    ('Aluminum Rail 4.2m', 'โครงสร้างติดตั้ง', '/products/mounting.svg', 160, 'เส้น', 'พร้อมใช้งาน'),
    ('Mid Clamp', 'โครงสร้างติดตั้ง', '/products/mounting.svg', 360, 'ตัว', 'พร้อมใช้งาน'),
    ('End Clamp', 'โครงสร้างติดตั้ง', '/products/mounting.svg', 32, 'ตัว', 'ใกล้หมด'),
    ('DC Solar Cable 6 sq.mm', 'สายไฟ DC', '/products/cable.svg', 1180, 'เมตร', 'พร้อมใช้งาน'),
    ('PV Cable 4 sq.mm', 'สายไฟ DC', '/products/cable.svg', 620, 'เมตร', 'พร้อมใช้งาน'),
    ('AC Cable 10 sq.mm', 'สายไฟ AC', '/products/cable.svg', 72, 'เมตร', 'ใกล้หมด'),
    ('MC4 Connector Pair', 'MC4 Connector', '/products/cable.svg', 320, 'คู่', 'พร้อมใช้งาน'),
    ('Combiner Box 4 String', 'Combiner Box', '/products/breaker.svg', 9, 'ตู้', 'ใกล้หมด'),
    ('DC Breaker 1000V', 'Breaker DC', '/products/breaker.svg', 8, 'ตัว', 'ใกล้หมด'),
    ('AC Breaker 2P 63A', 'Breaker AC', '/products/breaker.svg', 21, 'ตัว', 'พร้อมใช้งาน'),
    ('SPD DC Type 2', 'Surge Protection', '/products/breaker.svg', 19, 'ตัว', 'พร้อมใช้งาน'),
    ('SPD AC Type 2', 'Surge Protection', '/products/breaker.svg', 11, 'ตัว', 'พร้อมใช้งาน'),
    ('Ground Rod 5/8 inch', 'Grounding', '/products/mounting.svg', 80, 'แท่ง', 'พร้อมใช้งาน'),
    ('MPPT Charge Controller 60A', 'อินเวอร์เตอร์', '/products/inverter.svg', 6, 'เครื่อง', 'ใกล้หมด'),
    ('Cable Tie UV', 'สายไฟ DC', '/products/cable.svg', 850, 'เส้น', 'พร้อมใช้งาน'),
    ('Solar Crimping Tool', 'เครื่องมือช่างติดตั้ง', '/products/tools.svg', 12, 'ชุด', 'พร้อมใช้งาน'),
    ('Digital Multimeter', 'เครื่องมือช่างติดตั้ง', '/products/tools.svg', 6, 'เครื่อง', 'ใกล้หมด')
) as seed(name, category_name, image_url, stock_quantity, unit, status)
join public.categories on categories.name = seed.category_name
where not exists (
  select 1
  from public.products
  where products.name = seed.name
);

-- Optional future seed data for warehouses and suppliers.
insert into public.warehouses (name, location)
select seed.name, seed.location
from (
  values
    ('คลังหลัก', 'Bangkok Solar Distribution'),
    ('คลังไซต์งาน', 'Field Operation Storage')
) as seed(name, location)
where not exists (
  select 1
  from public.warehouses
  where warehouses.name = seed.name
);

insert into public.suppliers (name, phone, address)
select seed.name, seed.phone, seed.address
from (
  values
    ('Bangkok Solar Supply', '02-000-0000', 'Bangkok, Thailand'),
    ('PV Electrical Partner', '02-111-1111', 'Nonthaburi, Thailand')
) as seed(name, phone, address)
where not exists (
  select 1
  from public.suppliers
  where suppliers.name = seed.name
);
