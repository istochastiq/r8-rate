-- market_classes (минимальный DDL)
-- Примечания:
-- - gen_random_uuid() → требует расширение pgcrypto
-- - включаем RLS (политики добавим отдельно)

create extension if not exists "pgcrypto";

-- helper-триггер для updated_at (идемпотентно)
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create table if not exists public.market_classes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  description text,
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

-- индексы
create index if not exists idx_market_classes_display_name on public.market_classes (display_name);


