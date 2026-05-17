-- Seed contractors from src/lib/mock/contractors.ts
-- Run after 001_schema.sql and 002_rls.sql

insert into public.contractors (
  id, name, company, licensed, license_number, business_number,
  region, region_key, years_experience, completed_projects,
  rating, review_count, response_hours, starting_price, badges, bio,
  profile_image, cover, portfolio, license_docs
) values
(
  'kim-warm', '김도윤', 'Warm Atelier', true,
  'Interior Design Lic. 2018-1142', '214-87-09382',
  'Mapo, Seoul', 'seoul', 9, 142,
  4.9, 87, 2, 18000000,
  array['transparent_pricing','on_time_guarantee','premium_finishing'],
  'Mid-century modern specialist focused on warm wood tones and natural light, especially in smaller homes.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  array[
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80'
  ],
  array[
    'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80'
  ]
),
(
  'lee-haus', '이서윤', 'Haus Labo', true,
  'Interior Design Lic. 2020-2231', '318-22-44102',
  'Seongdong, Seoul', 'seoul', 7, 96,
  4.8, 64, 1, 22000000,
  array['transparent_pricing','background_checked','eco_materials'],
  'Minimal white-toned spaces with eco-friendly materials. Trusted by families with allergies.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
  array[
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
  ],
  array[
    'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80'
  ]
),
(
  'park-rough', '박정훈', 'Rough Studio', true,
  'Interior Design Lic. 2017-0813', '104-55-71299',
  'Yongsan, Seoul', 'seoul', 11, 178,
  4.7, 110, 3, 25000000,
  array['on_time_guarantee','background_checked','premium_finishing'],
  'Industrial and vintage moods with exposed concrete. Strong cafe & office portfolio.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  array[
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80'
  ],
  array[
    'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80'
  ]
),
(
  'han-skandi', '한수아', 'Skandi Home', true,
  'Interior Design Lic. 2019-1771', '411-02-99182',
  'Seongnam, Gyeonggi', 'gyeonggi', 8, 121,
  4.9, 92, 2, 19000000,
  array['transparent_pricing','eco_materials','on_time_guarantee'],
  'Scandinavian minimalism with natural materials. Specializes in family-friendly living rooms.',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80',
  array[
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'
  ],
  array[
    'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80'
  ]
),
(
  'jung-classic', '정유진', 'Classic Mood', true,
  'Interior Design Lic. 2016-0392', '220-87-00321',
  'Gangnam, Seoul', 'seoul', 13, 201,
  4.8, 134, 2, 32000000,
  array['transparent_pricing','premium_finishing','background_checked'],
  'Classic-modern mix. Strong with premium materials and large-scale homes.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  array[
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=800&q=80'
  ],
  array[
    'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80'
  ]
),
(
  'min-craft', '민재호', 'Craft Room', false,
  null, null,
  'Eunpyeong, Seoul', 'seoul', 6, 58,
  4.7, 41, 4, 12000000,
  array['transparent_pricing','eco_materials'],
  'Small studio & 1-bed expert. Verified unlicensed pro with 41 verified reviews and a fair-price track record.',
  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80',
  array[
    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80'
  ],
  array[]::text[]
),
(
  'oh-natural', '오하늘', 'Natural Core', false,
  null, null,
  'Goyang, Gyeonggi', 'gyeonggi', 5, 47,
  4.8, 36, 3, 11000000,
  array['eco_materials','transparent_pricing'],
  'Former furniture maker. Natural-material finishes for compact homes at honest prices.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  array[
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
  ],
  array[]::text[]
),
(
  'seo-bold', '서지안', 'Bold Concept', false,
  null, null,
  'Haeundae, Busan', 'busan', 7, 72,
  4.6, 53, 5, 14000000,
  array['transparent_pricing','background_checked'],
  'Bold colors and patterns. Popular among Busan-area newlyweds and young professionals.',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  array[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80'
  ],
  array[]::text[]
)
on conflict (id) do nothing;
