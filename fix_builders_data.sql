-- 1. Ensure unique constraint on slug exists to allow upsert
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'builders_slug_key') THEN
        -- Check for duplicates before adding constraint
        -- If duplicates exist, this will fail, but we assume clean state or user can handle
        ALTER TABLE builders ADD CONSTRAINT builders_slug_key UNIQUE (slug);
    END IF;
END
$$;

-- 2. Upsert Data
INSERT INTO builders (name, slug, description, logo_url, established_year, total_projects, website_url, portfolio_images)
VALUES
(
    'Inland Builders', 
    'inland-builders', 
    'Inland Builders is a premier real estate developer in Mangalore, known for its commitment to quality and architectural excellence. With nearly four decades of experience, they have shaped the skyline of Mangalore with iconic residential and commercial projects.',
    'https://inlandbuilders.net/images/logo.png',
    1986,
    45,
    'https://inlandbuilders.net',
    ARRAY['https://inlandbuilders.net/images/projects/windsors.jpg', 'https://inlandbuilders.net/images/projects/estoria.jpg']
),
(
    'Brigade Group', 
    'brigade-group', 
    'Brigade Group is one of India’s leading property developers with over three decades of expertise in building positive experiences for all stakeholders. They have transformed the real estate landscape of South India with their diverse portfolio.',
    'https://www.brigadegroup.com/assets/images/brigade-logo.png',
    1986,
    250,
    'https://www.brigadegroup.com',
    ARRAY['https://www.brigadegroup.com/assets/images/projects/pinnacle.jpg', 'https://www.brigadegroup.com/assets/images/projects/serenity.jpg']
),
(
    'Mohtisham Complexes', 
    'mohtisham-complexes', 
    'Mohtisham has been a pioneer in Mangalore’s real estate sector since 1990. Known for their integrity and transparency, they have delivered some of the city’s most landmark residential and commercial complexes.',
    'https://mohtisham.com/img/logo.png',
    1990,
    50,
    'https://mohtisham.com',
    ARRAY['https://mohtisham.com/img/projects/jumeirah.jpg', 'https://mohtisham.com/img/projects/canopy.jpg']
),
(
    'Rohan Corporation', 
    'rohan-corporation', 
    'Rohan Corporation is synonymous with innovation and quality in Mangalore. Established in 2003, they have consistently delivered premium living spaces that blend modern amenities with sustainable design.',
    'https://rohancorporation.in/wp-content/uploads/2020/06/logo.png',
    2003,
    25,
    'https://rohancorporation.in',
    ARRAY['https://rohancorporation.in/wp-content/uploads/2021/01/estate.jpg', 'https://rohancorporation.in/wp-content/uploads/2021/01/square.jpg']
),
(
    'Land Trades', 
    'land-trades', 
    'Land Trades Builders & Developers is a trusted name in Mangalore, celebrated for its timely delivery and impeccable quality. Since 1992, they have been crafting homes that offer a perfect blend of luxury and comfort.',
    'https://landtrades.in/images/logo.png',
    1992,
    40,
    'https://landtrades.in',
    ARRAY['https://landtrades.in/images/projects/solitaire.jpg', 'https://landtrades.in/images/projects/maurishka.jpg']
),
(
    'Bhandary Builders', 
    'bhandary-builders', 
    'Bhandary Builders is dedicated to creating affordable yet luxurious urban housing. With a focus on strategic locations and superior construction, they have earned a reputation for excellence in the Mangalore market.',
    'https://bhandarybuilders.com/images/logo.png',
    1999,
    15,
    'https://bhandarybuilders.com',
    ARRAY['https://bhandarybuilders.com/images/projects/heights.jpg', 'https://bhandarybuilders.com/images/projects/vertica.jpg']
),
(
    'NorthernSky Properties', 
    'northernsky-properties', 
    'NorthernSky Properties is a dynamic real estate development company focused on creating eco-friendly and sustainable living spaces. Their projects are known for their modern architecture and premium amenities.',
    'https://northernsky.in/wp-content/uploads/2019/07/logo.png',
    2006,
    18,
    'https://northernsky.in',
    ARRAY['https://northernsky.in/wp-content/uploads/2019/07/city.jpg', 'https://northernsky.in/wp-content/uploads/2019/07/palm-streak.jpg']
)
ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    logo_url = EXCLUDED.logo_url,
    established_year = EXCLUDED.established_year,
    total_projects = EXCLUDED.total_projects,
    website_url = EXCLUDED.website_url,
    portfolio_images = EXCLUDED.portfolio_images;
