## Обзор (на основе discovery)

### Видение
R8 — рынок соревновательных рейтингов (монетизация мнений). Участники «тянут» рейтинг спорных сущностей, покупая/продавая доли противоположных сторон. LS‑LMSR устраняет значимую часть манипуляций (path‑invariant), фокус на честной динамике.

### MVP
- Домейн первой версии: крипто‑инфлюэнсеры
- Для каждого инфлюэнсера — два бинарных LS‑LMSR рынка (оси):
  1) mindset: Normie ↔ Degen
  2) post‑quality: Alpha ↔ Shitposting
- Рынки создаёт администратор (MVP)
- Блокчейн: Base; авторизация/кошельки: Privy; расчёты в ETH

### Сущности (черновик)
- Influencer: публичная сущность (slug, display_name, bio?, socials?, state: hidden|open|exit_only)
- MarketClass (бинарный LS‑LMSR): slug, display_name, description, alpha, options[2:{slug, display_name, description}]
- MarketInstance: привязка MarketClass → конкретный Influencer (onchain адрес контракта, состояние)
- User: адрес/учётка (Privy), баланс, портфель опций
- Position/Trade: покупка/продажа опций (onchain → индексируется в Supabase)
- Message: комментарии/реплаи к событиям/рынкам (дерево тредов)

Связи
- Influencer 1:N MarketInstance (фиксировано 2 для MVP)
- User 1:N Position/Trade
- MarketInstance 1:N Position/Trade
- Message N:1 User; Message N:1 MarketInstance; Message может ссылаться на Message (thread)

Жизненный цикл
- Influencer: hidden → open → exit_only (архив/закрытие)
- MarketClass: фиксированный справочник (через сидинг, без UI)
- MarketInstance: создаётся для Influencer, публикуется, может быть закрыт для входа

### Данные и БД (Supabase, RLS)
- Базовые таблицы: influencers, market_classes, market_class_options, market_instances, users, positions, trades, messages
- Индексация onchain событий в trades/positions; агрегаты/вьюхи для отображения цен и объёмов
- Публичные данные: список инфлюэнсеров, их рынки, публичные котировки/объёмы, публичные сообщения (под RLS)
- Приватные: пользовательские балансы/портфели, операции записи — только через сервер/API с service role

RLS принципы
- Deny by default; SELECT для публичного — ограничен полями/вьюхами
- INSERT/UPDATE/DELETE только для владельцев/админов; модерация сообщений

### Страницы и маршруты (Next.js, SSR)
- /           — лендинг/обзор проекта
- /influencers — список инфлюэнсеров (SSR; пагинация/фильтры)
- /influencers/[slug] — профиль инфлюэнсера + 2 оси (SSR, всегда свежий)
- /markets/[instance] — страница конкретного рынка (SSR)
- /activity — лента событий/тредов (SSR)
- /account — кошелёк/портфель (требует входа)

SEO/SSR
- SSR by default; для всегда‑свежего: `dynamic = 'force-dynamic'` или `revalidate = 0`, `noStore()`
- sitemap.js, robots.js, metadata / generateMetadata, JSON‑LD

### API (Next.js Route Handlers, app/api/v1/*)
- GET /influencers, GET /influencers/[slug]
- GET /markets/[instance]/book|trades
- POST /markets/[instance]/trade (server‑side, service role / подпись)
- GET/POST /messages (листинг/создание, RLS + модерация)
- Аутентификация: Privy на клиенте; серверные операции — проверка сессии/подписи

### Индексатор
- Подписка на контракты MarketInstance (Base), парсинг событий
- Запись в Supabase (trades/positions), ретраи и дедупликация

### Миграции/окружения
- Миграции SQL (Supabase migrations); окружения: dev/preview/prod; секреты в Vercel/Supabase

### Риски/открытые вопросы
- Экономика комиссий/ликвидности; антиспам сообщений; модерация
- Детали LS‑LMSR (alpha) и onchain‑контракта; юридические аспекты


