create table bookings (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  date date not null,
  slot text not null,
  name text not null, business text, email text not null, phone text not null,
  service text not null, notes text,
  created_at timestamptz default now(),
  unique (date, slot)  -- prevents double bookings at the database level
);
alter table bookings enable row level security;  -- no policies: only the server's service-role key can read/write
