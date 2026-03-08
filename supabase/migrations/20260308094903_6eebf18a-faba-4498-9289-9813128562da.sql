
CREATE TABLE public.landing_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text DEFAULT '',
  image_url text DEFAULT '',
  visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landing sections viewable by everyone" ON public.landing_sections FOR SELECT USING (true);
CREATE POLICY "Admins can insert landing sections" ON public.landing_sections FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update landing sections" ON public.landing_sections FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete landing sections" ON public.landing_sections FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default sections matching current landing page
INSERT INTO public.landing_sections (section_key, title, sort_order, config) VALUES
  ('hero_banner', 'Featured Products', 0, '{"type":"hero"}'),
  ('category_banner', 'Shop by Category', 1, '{"type":"categories"}'),
  ('promo_banner', 'Hot Deals', 2, '{"type":"promo"}'),
  ('product_row_cameras', '📷 Cameras', 3, '{"type":"product_row","category":"Cameras"}'),
  ('product_row_audio', '🎙 Audio Gear', 4, '{"type":"product_row","category":"Audio"}'),
  ('brands_strip', 'Brands', 5, '{"type":"brands_strip"}'),
  ('featured_brand', 'Shop by Brand', 6, '{"type":"featured_brand"}'),
  ('product_row_lenses', '🔘 Lenses', 7, '{"type":"product_row","category":"Lenses"}'),
  ('product_row_lighting', '💡 Lighting', 8, '{"type":"product_row","category":"Lighting"}'),
  ('product_row_accessories', '🛠 Accessories', 9, '{"type":"product_row","category":"Accessories"}');
