-- Core tables: market_classes, influencers, users
-- Notes:
-- - Uses gen_random_uuid() for primary keys → requires pgcrypto
-- - Enables RLS (policies to be added in follow-up migration)

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type influencer_state as enum ('hidden','open','exit_only');
exception when duplicate_object then null; end $$;

-- Helper: updated_at trigger
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- 1) market_classes
create table if not exists public.market_classes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  description text,
  -- LS-LMSR alpha parameter (> 0)
  alpha numeric(18,8) not null check (alpha > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_market_classes_updated
before update on public.market_classes
for each row execute function set_updated_at();

alter table public.market_classes enable row level security;

comment on table public.market_classes is 'Catalog of binary LS-LMSR market classes';
comment on column public.market_classes.slug is 'URL-friendly identifier';
comment on column public.market_classes.alpha is 'Liquidity sensitivity parameter for LS-LMSR';

-- 2) influencers
create table if not exists public.influencers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  bio text,
  twitter_handle text,
  state influencer_state not null default 'hidden',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_influencers_updated
before update on public.influencers
for each row execute function set_updated_at();

alter table public.influencers enable row level security;

comment on table public.influencers is 'Public influencer entity managed by admins in MVP';
comment on column public.influencers.state is 'Visibility/state: hidden | open | exit_only';

-- 3) users (application profile, linked to Supabase auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  wallet_address text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_users_updated
before update on public.users
for each row execute function set_updated_at();

alter table public.users enable row level security;

comment on table public.users is 'Application-level user profile linked to auth.users';
comment on column public.users.wallet_address is 'Primary wallet (Privy)';

-- Suggested indexes (in addition to UNIQUEs)
create index if not exists idx_influencers_display_name on public.influencers (display_name);
create index if not exists idx_market_classes_display_name on public.market_classes (display_name);


