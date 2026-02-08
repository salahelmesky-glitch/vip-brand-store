-- VIP Brand Supabase Database Schema (Updated for Production)
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    category TEXT DEFAULT 'men',
    images TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 50,
    rating DECIMAL(2,1) DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SETTINGS TABLE (for profit margin, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow upsert on settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public settings access" ON settings;
CREATE POLICY "Public settings access" ON settings FOR ALL USING (true);

-- ============================================
-- ORDERS TABLE (Enhanced for Checkout)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE DEFAULT 'VIP-' || EXTRACT(EPOCH FROM NOW())::TEXT,
    
    -- Customer Info
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    
    -- Order Details
    items JSONB NOT NULL, -- Array of {product_id, name, price, quantity, size, color}
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) DEFAULT 50.00,
    total DECIMAL(10,2) NOT NULL,
    
    -- Options
    gift_wrap BOOLEAN DEFAULT false,
    notes TEXT,
    
    -- Payment
    payment_method TEXT NOT NULL, -- 'vodafone_cash', 'whatsapp', 'cod'
    payment_screenshot TEXT, -- URL to uploaded screenshot
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    
    -- Order Status
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public read access to products
DROP POLICY IF EXISTS "Public read access" ON products;
CREATE POLICY "Public read access" ON products
    FOR SELECT USING (true);

-- Admin full access to products
DROP POLICY IF EXISTS "Admin full access" ON products;
CREATE POLICY "Admin full access" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- Public can create orders (customers)
DROP POLICY IF EXISTS "Public can create orders" ON orders;
CREATE POLICY "Public can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Public can view their own orders by phone
DROP POLICY IF EXISTS "Public view own orders" ON orders;
CREATE POLICY "Public view own orders" ON orders
    FOR SELECT USING (true);

-- Admin full access to orders
DROP POLICY IF EXISTS "Admin orders access" ON orders;
CREATE POLICY "Admin orders access" ON orders
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run in Supabase Dashboard > Storage:
-- 1. Create bucket: "payment-screenshots" (public)
-- 2. Create bucket: "products" (public)

-- Storage policies (run in SQL Editor):
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to payment-screenshots
CREATE POLICY "Public upload payment screenshots" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots');

CREATE POLICY "Public read payment screenshots" ON storage.objects
    FOR SELECT USING (bucket_id = 'payment-screenshots');

-- Allow public read for products
CREATE POLICY "Public read products" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');
