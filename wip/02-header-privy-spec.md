# Global Header + Privy Auth Spec (WIP)

Цель: согласовать поведение и API глобального хедера, навигации (брэдкрамбов) и входа через Privy перед реализацией.

## Вопросы

1) Привязка дизайна
- Tailwind уже сконфигурирован, но `globals.css` отсутствует. Используем Tailwind (добавим базовые стили) или оставляем inline CSS для MVP? 


Используем тейлвинд.

- Высота хедера? (например, 56–64px) 

Пока да, если наду увеличим, она должна быть фиксированная, но скорее от размера шрифта.

- Контейнер контента: фиксированная ширина (max-w) или флюидная?

флюидная

2) Лого
- Текстовый логотип `R8` слева или нужен SVG/PNG? Если нужен, путь к файлу? 

Пока текстовый

3) Заголовок страницы
- Брать из `metadata.title` страницы или передавать пропсами из страниц? (App Router)
Это явно из страниц будет

- Если у страницы нет явного заголовка, что показывать?
R8-Rate

4) Брэдкрамбы
- Генерировать автоматически из `usePathname()` (`/influencers/mert` → `Influencers / mert`) или определять вручную на страницах через метаданные? Там часть будет фиксированная, а чать из базы (slug)
- Лейблы для сегментов: auto-капитализация или словарь отображений? 

5) Privy
- Какой именно SDK использовать? (например, `@privy-io/react-auth`)
@privy-io/react-auth

- Способы входа: Email, Wallet, Google, Apple? Какие включить?
Email, Wallet, Twitter

- Redirect после логина? Оставляем на текущей странице?
 После логина оставляем на текущей

- Где хранить состояние пользователя? Достаточно контекста из PrivyProvider?
Нужно чтобы при навигации не моргало

6) Кнопки
- При неавторизованном состоянии: кнопка `Log in`.
- При авторизованном: аватар/инициалы + меню (`Account`, `Log out`). Подтвердите состав.
Да и еще там будет несколько внутренних страниц характерных для пользователя

## Предлагаемая структура

- `src/components/GlobalHeader.jsx`: логотип, заголовок, брэдкрамбы, логин/аккаунт
- `src/components/LoginButton.jsx`: кнопка входа/выхода через Privy
- `src/lib/breadcrumbs.js`: утилита генерации брэдкрамбов из pathname
- Интеграция провайдера в `src/app/layout.jsx`

## Зависимости

- Privy React SDK (уточнить пакет/версию)
последние
- (Опционально) Tailwind base + container классы
Нужно чтобы было красиво

## Открытые вопросы

- Нужны ли SSR-хуки для определения авторизации до рендера? Или можно Client Components?
Можно клиентские компоненты
- Тёмная тема?
Тема переключаема

Пожалуйста, отметьте варианты и добавьте комментарии. После этого приступлю к реализации.

## Принятые решения (зафиксировано)

- **Дизайн**: Tailwind, контейнер флюидный; высота хедера ориентируется на размер шрифта (~56–64px на старте)
- **Логотип**: текстовый `R8` слева
- **Заголовок страницы**: задаётся из страниц (не из `metadata`), дефолт — `R8-Rate`
- **Брэдкрамбы**: базово — авто из `usePathname()`, динамические сегменты (slug) — через оверрайды из страницы/данных; авто-капитализация с возможностью словаря
- **Privy**: пакет `@privy-io/react-auth`, методы входа — Email, Wallet, Twitter; после логина остаёмся на текущей странице; без «мигания» за счёт базовой генерации + оверрайдов
- **Компоненты**: `GlobalHeader`, `LoginButton`, `HeaderProvider`, `PageHeader`, `buildBreadcrumbs`

## API хедера

- Контекст:

```ts
type BreadcrumbItem = { label: string; href: string };
type HeaderState = {
  title?: string;
  breadcrumbOverrides?: BreadcrumbItem[]; // заменяет/дополняет авто-крошки слева-направо
  userMenuItems?: { label: string; href: string }[];
};
```

- Паттерн использования в страницах (Client Component-хелпер):

```jsx
'use client';
import { PageHeader } from '@/components/PageHeader';

export default function InfluencerPage({ params }) {
  const handle = params.handle;
  return (
    <>
      <PageHeader
        title={`@${handle}`}
        breadcrumbs={[
          { label: 'Influencers', href: '/influencers' },
          { label: `@${handle}`, href: `/influencers/${handle}` }
        ]}
        userMenuItems={[
          { label: 'Account', href: '/account' }
        ]}
      />
      {/* page content */}
    </>
  );
}
```

- `GlobalHeader` вычисляет базовые крошки через `buildBreadcrumbs(usePathname())` и сливает с `breadcrumbOverrides`; заголовок берётся из контекста, а если его нет — из последней крошки, иначе `R8-Rate`.

## Privy интеграция

```jsx
// layout.jsx (фрагмент)
import { PrivyProvider } from '@privy-io/react-auth';
import { HeaderProvider } from '@/components/HeaderProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
          loginMethods={['email', 'wallet', 'twitter']}
        >
          <HeaderProvider>
            {/* <GlobalHeader /> */}
            {children}
          </HeaderProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
```

- Кнопка логина:

```jsx
'use client';
import { usePrivy } from '@privy-io/react-auth';

export function LoginButton() {
  const { ready, authenticated, login, logout } = usePrivy();
  if (!ready) return null;
  return authenticated ? (
    <button onClick={logout}>Log out</button>
  ) : (
    <button onClick={login}>Log in</button>
  );
}
```

## Шаги реализации

1) Создать `src/app/globals.css` с Tailwind base и импортировать в `app/layout.jsx`
2) Добавить `HeaderProvider`, `GlobalHeader`, `LoginButton`, `PageHeader`
3) Реализовать `buildBreadcrumbs(pathname)` с авто-лейблами и слиянием оверрайдов
4) Подключить `PrivyProvider` в `app/layout.jsx` с `NEXT_PUBLIC_PRIVY_APP_ID`
5) Вставить `GlobalHeader` над `{children}` в `layout.jsx`

## Требуется от вас

- Предоставить значение `NEXT_PUBLIC_PRIVY_APP_ID` (из Privy Dashboard)
- Подтвердить, что можно приступать к реализации по плану выше

## Переменные окружения Privy

- `NEXT_PUBLIC_PRIVY_APP_ID` — обязателен. Используется для инициализации `PrivyProvider` на фронтенде
- `NEXT_PUBLIC_PRIVY_CLIENT_ID` — опционален. Используется для клиент-специфичных настроек; если задан, пробрасываем в провайдер как `clientId`

### Вариант провайдера с CLIENT_ID (опционально)

```jsx
<PrivyProvider
  appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
  clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
  loginMethods={["email", "wallet", "twitter"]}
>
  {/* ... */}
</PrivyProvider>
```

Примечание: при отсутствии `NEXT_PUBLIC_PRIVY_CLIENT_ID` используем конфигурацию только с `appId` (поведение по умолчанию сохраняется).

## Замечания по Privy React Quickstart

Ссылка: [Privy React Quickstart](https://docs.privy.io/basics/react/quickstart)

- **Email OTP**: рекомендованный способ — хук `useLoginWithEmail`, который отдаёт `sendCode` и `loginWithCode` для ручного UI OTP.

```jsx
import {useState} from 'react';
import {useLoginWithEmail} from '@privy-io/react-auth';

export function LoginWithEmailInline() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const {sendCode, loginWithCode} = useLoginWithEmail();
  return (
    <div>
      <input onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
      <button onClick={() => sendCode({email})}>Send Code</button>
      <input onChange={(e) => setCode(e.currentTarget.value)} value={code} />
      <button onClick={() => loginWithCode({code})}>Login</button>
    </div>
  );
}
```

- **Для нашего MVP**: чтобы не собирать форму OTP, используем кнопку `Log in`, вызывающую `login()` из `usePrivy()` — это откроет модал Privy с методами (email/wallet/twitter), заданными в конфиге/дашборде. Позже при необходимости можно заменить на inline-OTP через `useLoginWithEmail`.

```jsx
'use client';
import {usePrivy} from '@privy-io/react-auth';

export function LoginButton() {
  const {ready, authenticated, login, logout} = usePrivy();
  if (!ready) return null;
  return authenticated ? (
    <button onClick={logout}>Log out</button>
  ) : (
    <button onClick={login}>Log in</button>
  );
}
```

- **Embedded wallet**: кошелёк может создаваться автоматически при логине (EVM/Solana) — контролируется настройками в Privy Dashboard. Это не меняет наш хедер, но влияет на UX после входа (например, наличие кошелька в меню пользователя).

- **Транзакции**: для отправки транзакций доступен `useSendTransaction` и др. Это вне области хедера, но совместимо с текущей провайдерной архитектурой.

В итоге подтверждаем стратегию: `PrivyProvider` (+`clientId` при наличии), кнопка `Log in` открывает модал со списком методов, позже опционально добавим кастомный inline-логин по email через `useLoginWithEmail`.
