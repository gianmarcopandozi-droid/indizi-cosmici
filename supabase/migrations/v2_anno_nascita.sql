-- v2: anno di nascita (nullable: le righe esistenti non lo hanno)
alter table public.subscribers
  add column if not exists anno_nascita int
  check (anno_nascita between 1900 and 2026);
