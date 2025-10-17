# WIP: Smooth Navigation Plan

This document outlines the plan to refactor the navigation and header state management to eliminate full-page reloads and flickering content.

## Problem Analysis

The current implementation uses a `HeaderProvider` with `useState` to manage the header's title and breadcrumbs. While the providers are correctly placed in the root layout, page components use a `useEffect` hook to update this shared state after they mount. This creates a noticeable flicker:

1.  User clicks a link.
2.  Next.js navigates to the new page. The root layout and `GlobalHeader` persist.
3.  For a brief moment, the `GlobalHeader` renders with the *previous* or *default* state from `HeaderProvider`.
4.  The new page component mounts.
5.  The `useEffect` in the new page component fires.
6.  The `setState` call from the effect updates the `HeaderProvider`, causing the `GlobalHeader` to re-render with the correct title.

This sequence of events is what creates the illusion of a full reload.

## Proposed Solution

The solution is to make the header state deterministic and derive it directly from the application's URL (`pathname`), rather than relying on side effects from child components. This eliminates the need for the `HeaderProvider` context entirely.

### Detailed Steps:

1.  **Remove `HeaderProvider.jsx`**:
    *   Delete the file `apps/r8-frontend/src/components/HeaderProvider.jsx`.
    *   This component and its context are the source of the state management issue.

2.  **Update `Providers.jsx`**:
    *   Remove the `HeaderProvider` wrapper from `apps/r8-frontend/src/components/Providers.jsx`.
    *   The component will now only be responsible for the `PrivyProvider`.

3.  **Refactor `GlobalHeader.jsx`**:
    *   Remove the `useHeader` hook.
    *   The component already uses `usePathname` to get the current route. We will expand on this.
    *   Implement logic directly inside `GlobalHeader` to derive the `title` and `breadcrumbs` from the `pathname`. This can be a simple mapping or a utility function.
    *   This centralizes the header's display logic in one place, making it predictable and synchronous with route changes.

4.  **Update `activity/page.jsx`**:
    *   Remove the `useHeader` hook and the corresponding `useEffect` that was used to set the page title. This logic is no longer needed as the `GlobalHeader` will handle it.

5.  **Add Navigation Links to `page.jsx` (Home Page)**:
    *   To demonstrate the smooth navigation, add explicit `next/link` components to the home page for navigating to other pages, such as `/activity`.

This plan will result in a much smoother user experience, where header content updates instantly and synchronously with page transitions, fully leveraging the client-side navigation capabilities of the Next.js App Router.
