
-- Brands table
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands viewable by everyone" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admins can insert brands" ON public.brands FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update brands" ON public.brands FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete brands" ON public.brands FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Subcategories table
CREATE TABLE public.subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(name, category_id)
);

ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subcategories viewable by everyone" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Admins can insert subcategories" ON public.subcategories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update subcategories" ON public.subcategories FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subcategories" ON public.subcategories FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Seed existing brands
INSERT INTO public.brands (name) VALUES 
  ('Sony'), ('Canon'), ('Nikon'), ('Blackmagic'), ('Rode'), 
  ('Shure'), ('Zoom'), ('Aputure'), ('Godox'), ('Peak Design'), ('DJI');

-- Seed existing categories + subcategories
INSERT INTO public.categories (name) VALUES 
  ('Cameras'), ('Lenses'), ('Audio'), ('Lighting'), ('Accessories');

INSERT INTO public.subcategories (name, category_id)
SELECT sub.name, c.id FROM public.categories c
CROSS JOIN LATERAL (VALUES 
  ('Cameras', 'DSLR'), ('Cameras', 'Mirrorless'), ('Cameras', 'Cinema'),
  ('Lenses', 'Prime'), ('Lenses', 'Zoom'), ('Lenses', 'Telephoto'),
  ('Audio', 'Microphones'), ('Audio', 'Mixers'),
  ('Lighting', 'LED Panels'), ('Lighting', 'Strobes'),
  ('Accessories', 'Tripods'), ('Accessories', 'Stabilizers'), ('Accessories', 'Wireless')
) AS sub(cat, name)
WHERE c.name = sub.cat;
