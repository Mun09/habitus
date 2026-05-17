-- Reviews are surfaced on the public contractor detail page, so any
-- signed-in user (or anonymous, if your project allows it) can read
-- them. Writes stay owner-scoped via the existing "reviews owner all"
-- policy from 002_rls.sql.

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read"
  on public.reviews for select
  using (true);
