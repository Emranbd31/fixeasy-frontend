insert into public.services (slug, name, description, base_price)
values
  ('plumbing', 'Plumbing', 'Emergency fixes, leak repair, and new installations.', 95),
  ('electrical', 'Electrical', 'Certified electricians for diagnostics and rewiring.', 110),
  ('cleaning', 'Cleaning', 'Residential and commercial deep cleans.', 75),
  ('gardening', 'Gardening', 'Garden tidy-ups, hedge trimming, and maintenance.', 65),
  ('painting', 'Painting & Decorating', 'Interior and exterior painting projects.', 120)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  base_price = excluded.base_price;
