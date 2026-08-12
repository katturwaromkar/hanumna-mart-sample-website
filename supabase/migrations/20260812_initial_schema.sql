-- ============================================================================
-- SHREE HANUMAN SUPER MARKET - Production PostgreSQL & Supabase Database Migration
-- Enables multi-device database persistence, live cross-device catalog sync, and order management
-- Owner: Jitendra Bhanwarlal Unecha | Contact: +91 7083568189
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  category_label TEXT,
  weight TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  mrp NUMERIC(10, 2),
  unit TEXT DEFAULT 'pack',
  availability TEXT DEFAULT 'In Stock',
  badge TEXT,
  featured_hero BOOLEAN DEFAULT FALSE,
  image TEXT,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category searches & active filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  icon TEXT DEFAULT '🏷️',
  badge TEXT DEFAULT 'Store Section',
  description TEXT,
  is_custom BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category keys
CREATE INDEX IF NOT EXISTS idx_categories_key ON public.categories(key);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  fulfillment_type TEXT DEFAULT 'Home Delivery',
  delivery_address TEXT,
  time_slot TEXT,
  payment_method TEXT DEFAULT 'Cash on Delivery (COD)',
  payment_status TEXT DEFAULT 'Pending',
  order_status TEXT DEFAULT 'Pending',
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  delivery_charge NUMERIC(10, 2) DEFAULT 0.00,
  grand_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  brand TEXT,
  weight TEXT,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  quantity INT NOT NULL DEFAULT 1,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 6. LEGACY / COMPATIBILITY TABLES (If present from existing setup)
CREATE TABLE IF NOT EXISTS public.custom_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  badge TEXT,
  description TEXT,
  isCustom BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.custom_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  categoryLabel TEXT,
  weight TEXT,
  price NUMERIC(10, 2) NOT NULL,
  mrp NUMERIC(10, 2),
  unit TEXT,
  availability TEXT,
  badge TEXT,
  image TEXT,
  description TEXT,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.edited_overrides (
  id TEXT PRIMARY KEY,
  name TEXT,
  price NUMERIC(10, 2),
  mrp NUMERIC(10, 2),
  weight TEXT,
  description TEXT,
  badge TEXT,
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edited_overrides ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES FOR PUBLIC ANONYMOUS ACCESS

-- Products Policies: Public can read active products, anyone can insert/update for store management
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Manage Products" ON public.products;
CREATE POLICY "Public Manage Products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

-- Categories Policies
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Manage Categories" ON public.categories;
CREATE POLICY "Public Manage Categories" ON public.categories
  FOR ALL USING (true) WITH CHECK (true);

-- Orders Policies: Public can create orders & read orders
DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
CREATE POLICY "Public Create Orders" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
CREATE POLICY "Public Read Orders" ON public.orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
CREATE POLICY "Public Update Orders" ON public.orders
  FOR UPDATE USING (true) WITH CHECK (true);

-- Order Items Policies
DROP POLICY IF EXISTS "Public Create Order Items" ON public.order_items;
CREATE POLICY "Public Create Order Items" ON public.order_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Order Items" ON public.order_items;
CREATE POLICY "Public Read Order Items" ON public.order_items
  FOR SELECT USING (true);

-- Legacy Compatibility Policies
DROP POLICY IF EXISTS "Public Legacy Custom Categories" ON public.custom_categories;
CREATE POLICY "Public Legacy Custom Categories" ON public.custom_categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Legacy Custom Products" ON public.custom_products;
CREATE POLICY "Public Legacy Custom Products" ON public.custom_products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Legacy Overrides" ON public.edited_overrides;
CREATE POLICY "Public Legacy Overrides" ON public.edited_overrides FOR ALL USING (true) WITH CHECK (true);

-- 9. ENABLE SUPABASE REALTIME PUBLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
