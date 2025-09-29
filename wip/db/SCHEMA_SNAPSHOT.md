## Supabase schema snapshot (current)

Источник: live проект; RLS включён на перечисленных таблицах.

### public.market_classes
- primary key: id (varchar)
- columns:
  - id: varchar
  - created_at: timestamptz default now()
  - display_name: varchar
  - description: text
- relations:
  - referenced by: public.options.market_class_id → public.market_classes.id

### public.options
- primary key: (market_class_id, option)
- columns:
  - market_class_id: varchar (FK → public.market_classes.id)
  - option: varchar
  - order: int8
  - display_name: varchar
  - description: text

### public.influencers
- primary key: id (int8)
- columns:
  - id: int8
  - created_at: timestamptz default now()
  - twitter_handle: varchar (unique)
  - twitter_profile_pic: varchar (nullable)

Примечания
- Типы и ключи отличаются от черновых DDL (wip/db/0001_*.sql). Эта страница отражает фактическое состояние БД.
- Таблицы `users`, `market_instances`, `positions`, `trades`, `messages` — пока отсутствуют.


