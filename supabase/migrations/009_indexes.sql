-- Extra indexes for contractor search/filter (Phase E).

create index if not exists idx_contractors_rating
  on public.contractors(rating desc);

create index if not exists idx_contractors_price
  on public.contractors(starting_price);
