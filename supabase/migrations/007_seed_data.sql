-- Seed data for the extended schema (005).
-- Sources of truth before this migration lived in src/lib/mock/*; those
-- files now act only as input documentation for this seed.

-- ─── style_briefs ─────────────────────────────────────────────
insert into public.style_briefs (style_key, label, intro, mood_images, match_terms) values
('midcentury',  'Mid-century Modern',
 'I picked Mid-century Modern: warm woods, curved furniture, plenty of natural light.',
 array[
   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
   'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=800&q=80',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
   'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=800&q=80'
 ],
 array['mid','century','wood']),
('minimalist',  'Minimalist White',
 'I curated a minimalist setup: clean whites, restrained lines, calm space.',
 array[
   'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
   'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
   'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80'
 ],
 array['minimal','white','simple']),
('industrial',  'Industrial',
 'Exposed concrete and metal details. An industrial mood board for you.',
 array[
   'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
   'https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=800&q=80',
   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
 ],
 array['industrial','concrete','vintage']),
('scandinavian','Scandinavian',
 'Bright tones and natural materials. Scandinavian, distilled.',
 array[
   'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80',
   'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80',
   'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80'
 ],
 array['skandi','scandinavian','natural','nordic'])
on conflict (style_key) do nothing;

-- ─── design_options (33 rows from src/lib/mock/design-options.ts) ─
insert into public.design_options (id, category, style_key, name, description, image, swatch, sort_order) values
('style-random',     'style','random',      'Random (5 styles)',  'AI proposes 5 styles at once',  '/images/scenarios/random/style-warm.webp', null, 0),
('style-mc',         'style','midcentury',  'Mid-century Modern', 'Warm wood, curved forms',       'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', null, 1),
('style-min',        'style','minimalist',  'Minimalist White',   'Clean lines, white tones',      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80', null, 2),
('style-ind',        'style','industrial',  'Industrial',         'Exposed concrete, metal',       'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', null, 3),
('style-sc',         'style','scandinavian','Scandinavian',       'Bright tones, natural',         'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80', null, 4),
('tone-warm-beige',  'tone', 'midcentury',  'Warm beige',         'Cozy and stable',               null, '#E6D7C0', 0),
('tone-natural-white','tone','scandinavian','Natural white',      'Bright clean base',             null, '#F5F0E8', 1),
('tone-cool-gray',   'tone', 'minimalist',  'Cool gray',          'Calm and modern',               null, '#C5CAD0', 2),
('tone-charcoal',    'tone', 'industrial',  'Charcoal',           'Bold and sleek',                null, '#3A3633', 3),
('tone-terracotta',  'tone', 'midcentury',  'Terracotta',         'Warm accent color',             null, '#C97B5A', 4),
('tone-deep-green',  'tone', 'scandinavian','Deep green',         'Calm natural accent',           null, '#3F4A3C', 5),
('floor-oak',        'flooring','midcentury','Oak hardwood',      'Premium · $109/m²',
   'https://images.unsplash.com/photo-1737098192036-34ab3642e1c6?auto=format&fit=crop&w=800&q=80', null, 0),
('floor-walnut',     'flooring','industrial','Walnut hardwood',   'Premium · deep tone',
   'https://images.unsplash.com/photo-1736506159893-22cca29b8018?auto=format&fit=crop&w=800&q=80', null, 1),
('floor-laminate-oak','flooring','scandinavian','Laminate (oak)', 'Standard · $59/m²',
   'https://images.unsplash.com/photo-1617262869711-2f5006b61073?auto=format&fit=crop&w=800&q=80', null, 2),
('floor-concrete',   'flooring','industrial','Polished concrete', 'Premium · industrial',
   'https://images.unsplash.com/photo-1515895309288-a3815ab7cf81?auto=format&fit=crop&w=800&q=80', null, 3),
('floor-white-tile', 'flooring','minimalist','White tile',        'Kitchen · bath',
   'https://images.unsplash.com/photo-1706629503586-2731f65587ae?auto=format&fit=crop&w=800&q=80', null, 4),
('wall-paint-eco',   'wall','minimalist',   'Low-VOC paint',      'Benjamin Moore · safe',
   'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80', null, 0),
('wall-wood-panel',  'wall','midcentury',   'Wood paneling',      'Walnut or oak',
   'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80', null, 1),
('wall-tile-accent', 'wall','industrial',   'Tile accent wall',   'Kitchen / bath accent',
   'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', null, 2),
('wall-natural-paper','wall','scandinavian','Natural wallpaper',  'Textured · bedroom',
   'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80', null, 3),
('furniture-chair',  'furniture','random',  'Lounge chair',       'Curved wood frame · fabric seat',
   '/images/scenarios/random/chair.webp', null, 0),
('furniture-lamp',   'furniture','random',  'Floor lamp',         'Warm ambient light',
   '/images/scenarios/random/lamp.webp', null, 1)
on conflict (id) do nothing;

-- ─── material_catalog (25 base items for 5 random styles) ─────
-- variants ordered: [warm, scandinavian, vintage, cafe, natural]
insert into public.material_catalog (id, code, style_key, slot_key, category, name, brand, tier, unit, qty, unit_price) values
-- Warm minimalism
('11111111-0000-0000-0000-000000000001'::uuid, 'wm-walls',   'warm',        'walls',     'Walls',     'Low-VOC paint (warm beige)',      'Benjamin Moore', 'premium',  'L',   22, 28000),
('11111111-0000-0000-0000-000000000002'::uuid, 'wm-floor',   'warm',        'floor',     'Floor',     'Engineered oak (light)',          'Gujung Maru',    'premium',  'm²',  78, 145000),
('11111111-0000-0000-0000-000000000003'::uuid, 'wm-light',   'warm',        'lighting',  'Lighting',  'Dimmable LED downlight 3000K',    'Philips Hue',    'premium',  'ea',  14, 38000),
('11111111-0000-0000-0000-000000000004'::uuid, 'wm-kitchen', 'warm',        'kitchen',   'Kitchen',   'Birch ply cabinets + quartz',     null,             'premium',  'set',  1, 5200000),
('11111111-0000-0000-0000-000000000005'::uuid, 'wm-finish',  'warm',        'finishing', 'Finishing', 'Hidden minimal molding',          null,             'premium',  'set',  1, 2400000),
-- Scandinavian
('22222222-0000-0000-0000-000000000001'::uuid, 'sc-walls',   'scandinavian','walls',     'Walls',     'Low-VOC paint (snow white)',      'Dulux',          'standard', 'L',   24, 18000),
('22222222-0000-0000-0000-000000000002'::uuid, 'sc-floor',   'scandinavian','floor',     'Floor',     'Laminate (light birch)',          'Donghwa Natural','standard', 'm²',  78, 78000),
('22222222-0000-0000-0000-000000000003'::uuid, 'sc-light',   'scandinavian','lighting',  'Lighting',  'Pendant + downlight 4000K',       'IKEA',           'standard', 'ea',  18, 22000),
('22222222-0000-0000-0000-000000000004'::uuid, 'sc-kitchen', 'scandinavian','kitchen',   'Kitchen',   'White doors + laminate top',      'Hanssem',        'standard', 'set',  1, 2900000),
('22222222-0000-0000-0000-000000000005'::uuid, 'sc-finish',  'scandinavian','finishing', 'Finishing', 'Simple molding + skirting',       null,             'standard', 'set',  1, 1100000),
-- Modern vintage
('33333333-0000-0000-0000-000000000001'::uuid, 'mv-walls',   'vintage',     'walls',     'Walls',     'Deep matte paint (forest)',       'Farrow & Ball',  'premium',  'L',   26, 42000),
('33333333-0000-0000-0000-000000000002'::uuid, 'mv-floor',   'vintage',     'floor',     'Floor',     'Engineered walnut (dark)',        'Gujung Maru',    'premium',  'm²',  78, 168000),
('33333333-0000-0000-0000-000000000003'::uuid, 'mv-light',   'vintage',     'lighting',  'Lighting',  'Brass pendants + dimming 2700K',  'Mid-century Modern','premium','ea', 16, 58000),
('33333333-0000-0000-0000-000000000004'::uuid, 'mv-kitchen', 'vintage',     'kitchen',   'Kitchen',   'Walnut veneer + brass pulls',     null,             'premium',  'set',  1, 6400000),
('33333333-0000-0000-0000-000000000005'::uuid, 'mv-finish',  'vintage',     'finishing', 'Finishing', 'Detailed crown molding',          null,             'premium',  'set',  1, 2800000),
-- Home cafe
('44444444-0000-0000-0000-000000000001'::uuid, 'hc-walls',   'cafe',        'walls',     'Walls',     'Textured plaster (latte)',        'Rakeli',         'premium',  'L',   24, 32000),
('44444444-0000-0000-0000-000000000002'::uuid, 'hc-floor',   'cafe',        'floor',     'Floor',     'Engineered oak (warm)',           'Gujung Maru',    'premium',  'm²',  78, 152000),
('44444444-0000-0000-0000-000000000003'::uuid, 'hc-light',   'cafe',        'lighting',  'Lighting',  'Pendant + wash light 2700K',      'Modular',        'premium',  'ea',  18, 42000),
('44444444-0000-0000-0000-000000000004'::uuid, 'hc-kitchen', 'cafe',        'kitchen',   'Kitchen',   'Open shelving + cafe counter',    null,             'standard', 'set',  1, 3600000),
('44444444-0000-0000-0000-000000000005'::uuid, 'hc-finish',  'cafe',        'finishing', 'Finishing', 'Chair rail + detail trim',        null,             'standard', 'set',  1, 1900000),
-- Natural planterior
('55555555-0000-0000-0000-000000000001'::uuid, 'np-walls',   'natural',     'walls',     'Walls',     'Clay paint (off-white)',          'Earthborn',      'premium',  'L',   24, 26000),
('55555555-0000-0000-0000-000000000002'::uuid, 'np-floor',   'natural',     'floor',     'Floor',     'Bamboo flooring (light)',         'Eco Maru',       'standard', 'm²',  78, 95000),
('55555555-0000-0000-0000-000000000003'::uuid, 'np-light',   'natural',     'lighting',  'Lighting',  'Full-spectrum LED + grow spot',   'Sansi',          'standard', 'ea',  22, 24000),
('55555555-0000-0000-0000-000000000004'::uuid, 'np-kitchen', 'natural',     'kitchen',   'Kitchen',   'Natural wood + herb garden',      null,             'standard', 'set',  1, 3300000),
('55555555-0000-0000-0000-000000000005'::uuid, 'np-finish',  'natural',     'finishing', 'Finishing', 'Natural wood trim + planter shelf',null,            'standard', 'set',  1, 1500000)
on conflict (code) do nothing;

-- ─── material_alternatives (2 per base = 50 total) ────────────
-- Walls
insert into public.material_alternatives (base_id, name, tier, unit_price) values
('11111111-0000-0000-0000-000000000001'::uuid, 'Eco paint (basic)',     'standard', 18000),
('11111111-0000-0000-0000-000000000001'::uuid, 'Standard latex',        'basic',     9500),
('22222222-0000-0000-0000-000000000001'::uuid, 'Premium low-VOC',       'premium',  28000),
('22222222-0000-0000-0000-000000000001'::uuid, 'Standard latex',        'basic',     9500),
('33333333-0000-0000-0000-000000000001'::uuid, 'Premium low-VOC',       'standard', 28000),
('33333333-0000-0000-0000-000000000001'::uuid, 'Standard latex',        'basic',     9500),
('44444444-0000-0000-0000-000000000001'::uuid, 'Low-VOC paint',         'standard', 18000),
('44444444-0000-0000-0000-000000000001'::uuid, 'Standard latex',        'basic',     9500),
('55555555-0000-0000-0000-000000000001'::uuid, 'Low-VOC paint',         'standard', 18000),
('55555555-0000-0000-0000-000000000001'::uuid, 'Standard latex',        'basic',     9500),
-- Floor
('11111111-0000-0000-0000-000000000002'::uuid, 'Laminate oak',          'standard', 78000),
('11111111-0000-0000-0000-000000000002'::uuid, 'Vinyl sheet',           'basic',    18000),
('22222222-0000-0000-0000-000000000002'::uuid, 'Engineered oak',        'premium', 145000),
('22222222-0000-0000-0000-000000000002'::uuid, 'Vinyl sheet',           'basic',    18000),
('33333333-0000-0000-0000-000000000002'::uuid, 'Laminate walnut',       'standard', 88000),
('33333333-0000-0000-0000-000000000002'::uuid, 'Vinyl dark',            'basic',    22000),
('44444444-0000-0000-0000-000000000002'::uuid, 'Laminate oak',          'standard', 78000),
('44444444-0000-0000-0000-000000000002'::uuid, 'Vinyl sheet',           'basic',    18000),
('55555555-0000-0000-0000-000000000002'::uuid, 'Engineered oak',        'premium', 145000),
('55555555-0000-0000-0000-000000000002'::uuid, 'Vinyl wood',            'basic',    20000),
-- Lighting
('11111111-0000-0000-0000-000000000003'::uuid, 'Standard LED downlight','standard', 18000),
('11111111-0000-0000-0000-000000000003'::uuid, 'Generic LED',           'basic',     7500),
('22222222-0000-0000-0000-000000000003'::uuid, 'Designer pendant',      'premium',  65000),
('22222222-0000-0000-0000-000000000003'::uuid, 'Generic LED',           'basic',     7500),
('33333333-0000-0000-0000-000000000003'::uuid, 'Metal pendant',         'standard', 32000),
('33333333-0000-0000-0000-000000000003'::uuid, 'Generic LED',           'basic',     7500),
('44444444-0000-0000-0000-000000000003'::uuid, 'Standard LED downlight','standard', 18000),
('44444444-0000-0000-0000-000000000003'::uuid, 'Generic LED',           'basic',     7500),
('55555555-0000-0000-0000-000000000003'::uuid, 'Dimmable designer LED', 'premium',  42000),
('55555555-0000-0000-0000-000000000003'::uuid, 'Generic LED',           'basic',     7500),
-- Kitchen
('11111111-0000-0000-0000-000000000004'::uuid, 'MDF + laminate',        'standard', 3100000),
('11111111-0000-0000-0000-000000000004'::uuid, 'PB + faux top',         'basic',    1800000),
('22222222-0000-0000-0000-000000000004'::uuid, 'Birch ply + quartz',    'premium',  4800000),
('22222222-0000-0000-0000-000000000004'::uuid, 'PB + faux top',         'basic',    1700000),
('33333333-0000-0000-0000-000000000004'::uuid, 'MDF + laminate',        'standard', 3200000),
('33333333-0000-0000-0000-000000000004'::uuid, 'PB + faux top',         'basic',    1800000),
('44444444-0000-0000-0000-000000000004'::uuid, 'Full birch ply kitchen','premium',  5400000),
('44444444-0000-0000-0000-000000000004'::uuid, 'PB + faux top',         'basic',    1800000),
('55555555-0000-0000-0000-000000000004'::uuid, 'Birch ply + quartz',    'premium',  4800000),
('55555555-0000-0000-0000-000000000004'::uuid, 'PB + faux top',         'basic',    1700000),
-- Finishing
('11111111-0000-0000-0000-000000000005'::uuid, 'Standard molding',      'standard', 1200000),
('11111111-0000-0000-0000-000000000005'::uuid, 'Basic molding',         'basic',     600000),
('22222222-0000-0000-0000-000000000005'::uuid, 'Hidden molding pkg',    'premium',  2400000),
('22222222-0000-0000-0000-000000000005'::uuid, 'Basic molding',         'basic',     600000),
('33333333-0000-0000-0000-000000000005'::uuid, 'Standard molding',      'standard', 1200000),
('33333333-0000-0000-0000-000000000005'::uuid, 'Basic molding',         'basic',     600000),
('44444444-0000-0000-0000-000000000005'::uuid, 'Hidden molding pkg',    'premium',  2400000),
('44444444-0000-0000-0000-000000000005'::uuid, 'Basic molding',         'basic',     600000),
('55555555-0000-0000-0000-000000000005'::uuid, 'Hidden molding pkg',    'premium',  2400000),
('55555555-0000-0000-0000-000000000005'::uuid, 'Basic molding',         'basic',     600000);

-- ─── ban_records (39 rows from MONTHLY_BANS × REASON_DISTRIBUTION) ─
-- Distributed roughly by share, dated across the last 12 months.
insert into public.ban_records (reason, created_at, notes) values
-- quote_fraud (14 total)
('quote_fraud',   '2025-05-12'::timestamptz, 'Extra billing after final inspection'),
('quote_fraud',   '2025-06-04'::timestamptz, 'Hidden change orders'),
('quote_fraud',   '2025-06-19'::timestamptz, 'Inflated material costs'),
('quote_fraud',   '2025-08-02'::timestamptz, 'Mid-project price bump without consent'),
('quote_fraud',   '2025-09-11'::timestamptz, 'Padded labor hours'),
('quote_fraud',   '2025-10-08'::timestamptz, 'Undisclosed disposal fees'),
('quote_fraud',   '2025-11-17'::timestamptz, 'Refused stage-payment breakdown'),
('quote_fraud',   '2025-11-29'::timestamptz, 'Refused itemized invoice'),
('quote_fraud',   '2026-01-05'::timestamptz, 'Triple-billed for permits'),
('quote_fraud',   '2026-01-22'::timestamptz, 'Added "VAT surcharge" outside contract'),
('quote_fraud',   '2026-02-10'::timestamptz, 'Hidden subcontractor markup'),
('quote_fraud',   '2026-03-14'::timestamptz, 'Falsified material qty'),
('quote_fraud',   '2026-03-26'::timestamptz, 'Demanded cash discount kickback'),
('quote_fraud',   '2026-04-08'::timestamptz, 'Refused to honor original quote'),
-- material_swap (11 total)
('material_swap', '2025-05-22'::timestamptz, 'Substituted oak with laminate'),
('material_swap', '2025-07-09'::timestamptz, 'Generic LED swapped for specified Philips'),
('material_swap', '2025-08-18'::timestamptz, 'Standard latex instead of low-VOC'),
('material_swap', '2025-09-26'::timestamptz, 'PB instead of birch ply cabinets'),
('material_swap', '2025-11-04'::timestamptz, 'Vinyl sheet instead of engineered floor'),
('material_swap', '2025-12-12'::timestamptz, 'Brass-effect plastic instead of brass'),
('material_swap', '2026-02-01'::timestamptz, 'MDF top instead of quartz'),
('material_swap', '2026-03-04'::timestamptz, 'Faux marble instead of quartz'),
('material_swap', '2026-03-19'::timestamptz, 'Off-spec paint sheen'),
('material_swap', '2026-04-12'::timestamptz, 'Lower-tier tile pulled in'),
('material_swap', '2026-04-25'::timestamptz, 'Standard hardware instead of premium'),
-- abandonment (8 total)
('abandonment',   '2025-08-30'::timestamptz, 'Walked off mid-electrical'),
('abandonment',   '2025-10-26'::timestamptz, 'Stopped responding for 14 days'),
('abandonment',   '2025-11-12'::timestamptz, 'Subcontractor pulled, no plan B'),
('abandonment',   '2025-12-21'::timestamptz, 'Quit after demolition'),
('abandonment',   '2026-01-30'::timestamptz, 'Refused warranty visits'),
('abandonment',   '2026-02-25'::timestamptz, 'Disappeared after deposit'),
('abandonment',   '2026-03-22'::timestamptz, 'Mid-painting walkout'),
('abandonment',   '2026-04-20'::timestamptz, 'No-show for final inspection'),
-- false_license (4 total)
('false_license', '2025-07-17'::timestamptz, 'License # belonged to another firm'),
('false_license', '2025-12-04'::timestamptz, 'Lapsed license presented as active'),
('false_license', '2026-01-13'::timestamptz, 'Fake business number'),
('false_license', '2026-04-02'::timestamptz, 'Counterfeit license document'),
-- abuse (2 total)
('abuse',         '2025-11-22'::timestamptz, 'Verbal abuse toward client'),
('abuse',         '2026-04-15'::timestamptz, 'Threatening behavior on site');

-- ─── reviews (15 prototype reviews) ───────────────────────────
-- These predate user-generated reviews so they have null user_id/project_id
-- and carry display_name + avatar_url directly. rowToReview() prefers
-- those when user_id is null.
insert into public.reviews (id, contractor_id, rating, title, body, photos, display_name, avatar_url, created_at) values
(gen_random_uuid(), 'kim-warm',     5, 'On budget, on schedule', 'Zero surprise costs from quote to handover. Daily photo updates kept me at ease.', array[
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
], 'Minji K.',   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80', '2026-03-12'::timestamptz),
(gen_random_uuid(), 'kim-warm',     5, 'My living room looks like a magazine', 'Phenomenal eye for natural light. The small space feels twice as large now.', array[
  'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=800&q=80'
], 'Seojun P.',  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', '2026-02-21'::timestamptz),
(gen_random_uuid(), 'kim-warm',     4, 'Crisp finishing', 'Quick follow-up support. Slight delay, but the result is excellent.', array[]::text[],
 'Haneul L.',    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', '2026-01-08'::timestamptz),
(gen_random_uuid(), 'lee-haus',     5, 'Truly eco materials', 'My child has allergies, and they shared every eco-certification.', array[
  'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80'
], 'Gaeun C.',   'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80', '2026-03-02'::timestamptz),
(gen_random_uuid(), 'lee-haus',     5, 'Replies within an hour', 'Even after-hours messages get a same-day reply. Trust earned.', array[]::text[],
 'Dohyeon J.',   'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80', '2026-02-14'::timestamptz),
(gen_random_uuid(), 'park-rough',   5, 'Exposed concrete finish is art', 'Years of cafe work shows. The details are on another level.', array[
  'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80'
], 'Yejin H.',   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', '2026-03-19'::timestamptz),
(gen_random_uuid(), 'park-rough',   4, 'Communication slow at first', 'Once kicked off, fast and precise. Just a slow quote phase.', array[]::text[],
 'Minji K.',     'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80', '2026-02-04'::timestamptz),
(gen_random_uuid(), 'han-skandi',   5, 'Family-friendly done right', 'Even the corner softening for the kids. Incredibly thoughtful.', array[
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80'
], 'Seojun P.',  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', '2026-03-25'::timestamptz),
(gen_random_uuid(), 'han-skandi',   5, 'Scandinavian tone, perfect', 'Got my taste right without me even sharing references.', array[]::text[],
 'Haneul L.',    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', '2026-01-29'::timestamptz),
(gen_random_uuid(), 'jung-classic', 5, 'Trust at scale', '230m² felt risky, but the project management was flawless.', array[
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=800&q=80'
], 'Gaeun C.',   'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80', '2026-03-08'::timestamptz),
(gen_random_uuid(), 'jung-classic', 4, 'Premium material options', 'Five tone options laid side-by-side. Easy decision.', array[]::text[],
 'Dohyeon J.',   'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80', '2026-02-11'::timestamptz),
(gen_random_uuid(), 'min-craft',    5, 'Treated like a big project', '30m² studio treated with the same care as a full home. Verified, peace of mind.', array[
  'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=800&q=80'
], 'Yejin H.',   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', '2026-03-15'::timestamptz),
(gen_random_uuid(), 'min-craft',    4, 'Best value', '70% of competing quotes for comparable finishing quality.', array[]::text[],
 'Minji K.',     'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80', '2026-02-22'::timestamptz),
(gen_random_uuid(), 'oh-natural',   5, 'Wood furniture included', 'Even built a custom oak shelf. A detail no one else offered.', array[
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80'
], 'Seojun P.',  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', '2026-03-21'::timestamptz),
(gen_random_uuid(), 'seo-bold',     5, 'Newlywed color tone, perfect', 'Terracotta + off-white combo. Couldn''t be happier.', array[
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
], 'Haneul L.',  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', '2026-03-30'::timestamptz);
