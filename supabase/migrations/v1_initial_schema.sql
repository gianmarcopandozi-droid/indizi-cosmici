-- ============================================================
-- Indizi Cosmici — V1 Schema
-- Run manually in Supabase SQL Editor:
--   https://supabase.com/dashboard/project/jlrvxarbthgubvjvcjds/sql/new
-- ============================================================

-- 1. subscribers
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  nome text not null,
  giorno_nascita int not null check (giorno_nascita between 1 and 31),
  mese_nascita int not null check (mese_nascita between 1 and 12),
  segno text not null check (segno in ('ariete','toro','gemelli','cancro','leone','vergine','bilancia','scorpione','sagittario','capricorno','acquario','pesci')),
  source text default 'direct',
  opt_in_newsletter boolean not null default false,
  confirmed boolean not null default false,
  confirm_token text unique,
  confirmed_at timestamptz,
  unsubscribe_token text unique not null default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now()
);
create index if not exists subscribers_email_idx on subscribers(email);
create index if not exists subscribers_created_at_idx on subscribers(created_at desc);

-- 2. consent_log
create table if not exists public.consent_log (
  id bigserial primary key,
  subscriber_id uuid references subscribers(id) on delete cascade,
  consent_type text not null check (consent_type in ('download','newsletter')),
  consent_version text not null,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists consent_log_subscriber_idx on consent_log(subscriber_id);

-- 3. spirit_guides
create table if not exists public.spirit_guides (
  id uuid primary key default gen_random_uuid(),
  share_id text unique not null,
  subscriber_id uuid references subscribers(id) on delete set null,
  nome_visualizzato text not null,
  segno text not null,
  mantra text not null,
  dedicato_a text,
  image_url text,
  created_at timestamptz not null default now()
);
create index if not exists spirit_guides_share_id_idx on spirit_guides(share_id);

-- 4. share_events
create table if not exists public.share_events (
  id bigserial primary key,
  spirit_guide_id uuid references spirit_guides(id) on delete cascade,
  channel text not null check (channel in ('whatsapp','copy_link','telegram','other')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS
-- ============================================================
alter table subscribers enable row level security;
alter table consent_log enable row level security;
alter table spirit_guides enable row level security;
alter table share_events enable row level security;

-- subscribers, consent_log: only service_role writes (default deny for anon)

-- spirit_guides: anon can read by share_id (for OG share pages)
drop policy if exists "anon read spirit_guides by share_id" on spirit_guides;
create policy "anon read spirit_guides by share_id"
  on spirit_guides for select to anon using (true);

-- share_events: anon can insert (track WhatsApp/copy clicks from client)
drop policy if exists "anon insert share_events" on share_events;
create policy "anon insert share_events"
  on share_events for insert to anon with check (true);
