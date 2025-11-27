
-- Run this in your Supabase SQL Editor to seed the builders
INSERT INTO builders (name, slug) VALUES
('Prestige Group', 'prestige-group'),
('Brigade Group', 'brigade-group'),
('NorthernSky Properties', 'northernsky-properties'),
('Land Trades', 'land-trades')
ON CONFLICT (slug) DO NOTHING;
