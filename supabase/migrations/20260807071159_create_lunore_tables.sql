/*
# Create LUNORE core tables (single-tenant, no auth)

1. New Tables
- `products`: catalog of stone sculptures (name, category, description)
- `exhibitions`: upcoming/current exhibitions (title, date, status, description)
- `inquiries`: contact form submissions (name, email, subject, message, created_at)
2. Security
- Enable RLS on all three tables.
- Allow anon + authenticated CRUD because this is a public no-auth site.
  - products/exhibitions: public read only.
  - inquiries: public insert only (no read from anon to keep submissions private).
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exhibitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date text,
  status text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- products: public read
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- exhibitions: public read
DROP POLICY IF EXISTS "anon_select_exhibitions" ON exhibitions;
CREATE POLICY "anon_select_exhibitions" ON exhibitions FOR SELECT
  TO anon, authenticated USING (true);

-- inquiries: public insert, no public read (keeps submissions private)
DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
CREATE POLICY "anon_insert_inquiries" ON inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);
