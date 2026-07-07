-- Solar Inventory UI - product seed data
-- Run this file in Supabase SQL Editor after categories exist.
-- This seed does not add price, sku, brand, or note fields.
-- Re-running this file will not duplicate rows with the same product name.

insert into public.products (name, category_id, image_url, stock_quantity, unit, status)
select seed.name, categories.id, seed.image_url, seed.stock_quantity, seed.unit, seed.status
from (
  values
    ('แผงโซลาร์เซลล์ Mono 550W', 'แผงโซลาร์เซลล์', '/products/solar-panel.svg', 45, 'แผ่น', 'พร้อมใช้งาน'),
    ('แผงโซลาร์เซลล์ Mono 580W', 'แผงโซลาร์เซลล์', '/products/solar-panel.svg', 32, 'แผ่น', 'พร้อมใช้งาน'),
    ('แผงโซลาร์เซลล์ Bifacial 600W', 'แผงโซลาร์เซลล์', '/products/solar-panel.svg', 8, 'แผ่น', 'ใกล้หมด'),
    ('แผงโซลาร์เซลล์ Flexible 200W', 'แผงโซลาร์เซลล์', '/products/solar-panel.svg', 18, 'แผ่น', 'พร้อมใช้งาน'),
    ('อินเวอร์เตอร์ On Grid 5kW', 'อินเวอร์เตอร์', '/products/inverter.svg', 14, 'เครื่อง', 'พร้อมใช้งาน'),
    ('อินเวอร์เตอร์ On Grid 10kW', 'อินเวอร์เตอร์', '/products/inverter.svg', 9, 'เครื่อง', 'พร้อมใช้งาน'),
    ('อินเวอร์เตอร์ Hybrid 5kW', 'อินเวอร์เตอร์', '/products/inverter.svg', 6, 'เครื่อง', 'ใกล้หมด'),
    ('อินเวอร์เตอร์ Hybrid 10kW', 'อินเวอร์เตอร์', '/products/inverter.svg', 5, 'เครื่อง', 'ใกล้หมด'),
    ('อินเวอร์เตอร์ Off Grid 3kW', 'อินเวอร์เตอร์', '/products/inverter.svg', 11, 'เครื่อง', 'พร้อมใช้งาน'),
    ('แบตเตอรี่ LiFePO4 5kWh', 'แบตเตอรี่', '/products/battery.svg', 11, 'ชุด', 'พร้อมใช้งาน'),
    ('แบตเตอรี่ LiFePO4 10kWh', 'แบตเตอรี่', '/products/battery.svg', 4, 'ชุด', 'ใกล้หมด'),
    ('MPPT Charge Controller 60A', 'อินเวอร์เตอร์', '/products/inverter.svg', 6, 'เครื่อง', 'ใกล้หมด'),
    ('MPPT Charge Controller 100A', 'อินเวอร์เตอร์', '/products/inverter.svg', 3, 'เครื่อง', 'ใกล้หมด'),
    ('Solar Combiner Box 2 String', 'Combiner Box', '/products/breaker.svg', 15, 'ตู้', 'พร้อมใช้งาน'),
    ('Solar Combiner Box 4 String', 'Combiner Box', '/products/breaker.svg', 9, 'ตู้', 'ใกล้หมด'),
    ('Solar Combiner Box 8 String', 'Combiner Box', '/products/breaker.svg', 2, 'ตู้', 'ใกล้หมด'),
    ('MC4 Connector Pair', 'MC4 Connector', '/products/cable.svg', 320, 'คู่', 'พร้อมใช้งาน'),
    ('MC4 Y Connector', 'MC4 Connector', '/products/cable.svg', 76, 'คู่', 'พร้อมใช้งาน'),
    ('PV Cable 4 sq.mm', 'สายไฟ DC', '/products/cable.svg', 620, 'เมตร', 'พร้อมใช้งาน'),
    ('PV Cable 6 sq.mm', 'สายไฟ DC', '/products/cable.svg', 1180, 'เมตร', 'พร้อมใช้งาน'),
    ('DC Isolator Switch', 'Breaker DC', '/products/breaker.svg', 20, 'ตัว', 'พร้อมใช้งาน'),
    ('DC Breaker 1000V', 'Breaker DC', '/products/breaker.svg', 8, 'ตัว', 'ใกล้หมด'),
    ('AC Breaker 2P 63A', 'Breaker AC', '/products/breaker.svg', 21, 'ตัว', 'พร้อมใช้งาน'),
    ('SPD DC Type 2', 'Surge Protection', '/products/breaker.svg', 19, 'ตัว', 'พร้อมใช้งาน'),
    ('SPD AC Type 2', 'Surge Protection', '/products/breaker.svg', 11, 'ตัว', 'พร้อมใช้งาน'),
    ('Ground Rod 5/8 inch', 'Grounding', '/products/mounting.svg', 80, 'แท่ง', 'พร้อมใช้งาน'),
    ('Ground Wire 16 sq.mm', 'Grounding', '/products/cable.svg', 140, 'เมตร', 'พร้อมใช้งาน'),
    ('Aluminum Mounting Rail 4.2m', 'โครงสร้างติดตั้ง', '/products/mounting.svg', 160, 'เส้น', 'พร้อมใช้งาน'),
    ('Mid Clamp', 'โครงสร้างติดตั้ง', '/products/mounting.svg', 360, 'ตัว', 'พร้อมใช้งาน'),
    ('End Clamp', 'โครงสร้างติดตั้ง', '/products/mounting.svg', 32, 'ตัว', 'ใกล้หมด'),
    ('L-Foot Mount', 'โครงสร้างติดตั้ง', '/products/mounting.svg', 54, 'ตัว', 'พร้อมใช้งาน'),
    ('Roof Hook', 'โครงสร้างติดตั้ง', '/products/mounting.svg', 0, 'ตัว', 'หมดสต๊อก')
) as seed(name, category_name, image_url, stock_quantity, unit, status)
join public.categories on categories.name = seed.category_name
where not exists (
  select 1
  from public.products
  where products.name = seed.name
);
