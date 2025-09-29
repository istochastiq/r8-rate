## Цель

Зафиксировать структурные пожелания к фронтенду: SSR для SEO‑дружелюбности, интеграция с Supabase (через секреты Vercel), разделение публичного и приватного доступа к данным, и организационные моменты в монорепозитории.

## Технологический стек
- **Фреймворк**: Next.js (app router), **vanilla JavaScript** (без TypeScript)
- **Хостинг**: Vercel (серверные роуты, секреты, ISR/Edge)
- **База**: Supabase (Postgres + RLS, Storage, при необходимости RPC)
- **Монорепо**: Rush + pnpm (`apps/r8-frontend`, `apps/r8-indexer`, `apps/r8-contracts`, `apps/r8-whitepaper`)

## Архитектура фронтенда
- **SSR/SEO**:
  - Страницы рендерятся на сервере по умолчанию. Для строго актуального HTML:
    - `export const dynamic = 'force-dynamic'` или `export const revalidate = 0`
    - использовать `noStore()` из `next/cache` и/или `fetch(..., { cache: 'no-store' })`
  - Для кэшируемых страниц — ISR: `export const revalidate = <seconds>`
  - Генерация `metadata`/`generateMetadata` для title/description/canonical/OG/Twitter
  - `app/sitemap.js` и `app/robots.js` для карты сайта и robots

- **Доступ к данным**:
  - **Публичные чтения** (строго под RLS): из серверных компонентов или напрямую в браузере по `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **Приватные/агрегированные операции**: только через серверные **Route Handlers** (`app/api/*`) с `SUPABASE_SERVICE_ROLE_KEY` (секрет Vercel). На клиенте service‑role не используется

- **API слой (Next.js Route Handlers)**:
  - Версионирование: `app/api/v1/...`
  - Ответы: JSON `{ data, error }`, коды 2xx/4xx/5xx, пагинация/лимиты
  - Троттлинг/квоты — на стороне Vercel/маршрутов при необходимости

- **Структурированные данные**:
  - Вставка JSON‑LD (Organization, WebSite, BreadcrumbList, Article/Product — по потребности)

## Интеграция с Supabase
- **Переменные окружения** (Vercel):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (только сервер)
  - При необходимости: `SUPABASE_JWT_SECRET`, `NEXT_PUBLIC_*` для публичных значений
- **RLS**:
  - Включено на всех таблицах; политика «deny by default»
  - Явные политики SELECT/INSERT/UPDATE/DELETE
  - Для публичной выборки — предпочтительно через VIEW
  - RPC с осторожностью: избегать `SECURITY DEFINER`, если это может обойти RLS

## Интеграция whitepaper → фронтенд
- Сборка `apps/r8-whitepaper` публикует PDF в `dist/whitepaper.pdf`
- Фронтенд отдаёт PDF как статический ассет (вариант: копировать в `public/` на шаге билда; позже — настроить зависимость проекта в Rush)

## Монорепо и команды
- Установка: `pnpm dlx @microsoft/rush update --full --purge`
- Сборка: `pnpm dlx @microsoft/rush build -v`
- Dev:
  - фронтенд: `pnpm -C apps/r8-frontend dev`
  - индексатор: `pnpm -C apps/r8-indexer dev`
  - контракты (опц.): `pnpm -C apps/r8-contracts build|test`

## Git/безопасность
- Игнор: `.cursor/`, `**/rush-logs/`, `**/.rush/`, `node_modules/`, сборочные артефакты, Foundry‑артефакты
- Секреты — только в переменных окружения Vercel; в репозиторий не попадают

## Открытые вопросы (нужно подтвердить/заполнить)
1) **Страницы и маршруты**: первичный список публичных страниц (маршруты, SEO‑описания)
2) **Модель данных Supabase**: таблицы/представления, поля, индексы, ключи
3) **Политики RLS**: кто что видит/меняет? формальные правила
4) **Первый набор API‑эндпоинтов** (`app/api/v1/*`): ресурсы, методы, параметры, форматы ответов
5) **Кэширование**: где динамика «всегда свежая», где можно ISR (и на сколько секунд)
6) **Аутентификация**: гостевой режим, вход/выход, сессии, роли
7) **Ограничения**: пагинация/лимиты, троттлинг, rate limiting
8) **Структурированные данные**: какие типы JSON‑LD понадобятся
9) **Домены и canonical**: основной домен, зеркала, 301‑редиректы
10) **i18n**: планируется ли мультиязычность?
11) **Наблюдаемость**: логирование, мониторинг ошибок/производительности

Напиши ответы прямо в этом файле ниже по пунктам, я синхронизирую спецификацию и подготовлю соответствующий каркас во фронтенде.


