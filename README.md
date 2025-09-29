## R8‑rate

Монорепозиторий (Rush + pnpm) экспериментального проекта «R8 (R‑eight) = Rate» — рынка соревновательных рейтингов.

### О проекте
Идея близка к рынкам предсказаний, но с ключевым отличием: здесь нет внешнего оракула, «оракулом» выступает сам рынок — социальный барометр, подкреплённый финансовыми стимулами. Для ценообразования рассматриваем AMM на основе LMSR и её вариации LS‑LMSR.

Полезные материалы:
- `spec/IDEA.md` — краткая идея проекта
- `spec/LS-LMSR-Practical-Guide.pdf` — практическое руководство по LS‑LMSR

### Состав монорепозитория
- `apps/r8-frontend`: фронтенд на Next.js (дальше будет подхватывать артефакт whitepaper)
- `apps/r8-indexer`: индексатор событий на Node.js/TypeScript
- `apps/r8-contracts`: смарт‑контракты на Solidity (Foundry)
- `apps/r8-whitepaper`: сборка whitepaper (пока stub создаёт `dist/whitepaper.pdf`)

### Требования
- Node.js >= 18.17 (LTS)
- pnpm >= 9 (через Corepack или отдельно)
- Опционально: Foundry (`forge`) для сборки/тестов контрактов

### Быстрый старт
1) Установка зависимостей (через Rush):
```bash
pnpm dlx @microsoft/rush update --full --purge
```

2) Сборка всех пакетов:
```bash
pnpm dlx @microsoft/rush build -v
```

3) Запуск фронтенда (dev):
```bash
pnpm -C apps/r8-frontend dev
```

4) Индексатор (dev):
```bash
pnpm -C apps/r8-indexer dev
```

5) Whitepaper (stub‑сборка):
```bash
pnpm -C apps/r8-whitepaper build
```

6) Контракты (если установлен Foundry):
```bash
pnpm -C apps/r8-contracts build
pnpm -C apps/r8-contracts test
```

### Статус
- Каркас монорепы собран; сборка `rush build` проходит.
- Whitepaper пока создаётся как заглушка PDF в `apps/r8-whitepaper/dist/whitepaper.pdf`.
- Позже настроим автоматическую публикацию PDF в статике фронтенда и интеграцию Supabase/Vercel.



