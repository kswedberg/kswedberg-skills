# Nuxt Development Standards

## Code Style and Structure

- Write concise, technical JavaScript code with accurate examples.
- Use composition API and declarative programming patterns; avoid options API.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, composables, helpers, static content, types.

## Architecture

- Follow Nuxt's recommended directory structure: [Nuxt Directory Structure](https://nuxt.com/docs/4.x/directory-structure)
- Favor the Composition API (`setup` functions and composables) over the Options API
- Use file-based routing in the `app/pages/` directory.
- Organize components and composables by feature or domain for scalability
- Extract reusable logic into composable functions in the `app/composables/` directory
- Structure store modules (Pinia) by domain, with clearly defined state, getters, and actions

## JavaScript Integration

- Use `<script setup>` with `defineProps` and `defineEmits`
- In `defineProps`, use `type` property and either `required` or `default` property to define the type of the prop
- Implement generic components and composables where applicable

## Auto-imports

- This Nuxt project is configured to have auto-imports enabled.
- For example, Vue APIs (ref, computed, watch, etc.) are auto-imported, so you can directly use them in your code without import statements.
- You can also directly use components, composables, stores, and utilities without importing them.
- Within the `server/` directory, you can directly use server-side APIs and utilities without importing them.
- From either the `server/` or `app/` directory, you can directly use utilities from the `/shared/utils/` directory without importing them.
- If Nuxt Layers are being used, their components, composables, stores, utilities, etc. will be automatically imported and available in the code as well.

## Component Design

- Use kebab-case for file names and component names
- Keep components small and focused on one concern
- Use `<script setup>` syntax for brevity and performance
- Use props for passing data down to child components
- Use emits for communicating events up to parent components
- Validate props with `type` and `required` or `default` properties; use runtime checks only when necessary
- Favor slots and scoped slots for flexible composition
- Use defineModel for two-way binding between parent and child components
- Always structure Vue Single File Components in this exact order:
  1. `<template>` section first
  2. `<script setup>` section second
  3. `<style>` section last (if needed)

## State Management

- Use Pinia for global state: define stores with `defineStore`
- For simple local state, use `ref` and `reactive` within `setup`
- Use `computed` for derived state
- Keep state normalized for complex structures
- Use actions in Pinia stores for asynchronous logic

## Composition API Patterns

- Create reusable composables for shared logic, e.g., `useNavigation`, `useAuth`
- Use `watch` and `watchEffect` with precise dependency lists
- Cleanup side effects in `onUnmounted` or `watch` cleanup callbacks
- Use `provide`/`inject` sparingly for deep dependency injection

## Performance Optimization

- Leverage Nuxt's built-in performance optimizations.
- Use the `lazy-` prefix for components that are not needed on the initial page load.
- Lazy-load components with dynamic imports and `defineAsyncComponent`
- Apply `v-once` and `v-memo` for static or infrequently changing elements
- Profile with Vue DevTools Performance tab
- Avoid unnecessary watchers; prefer `computed` where possible
- Tree-shake unused code and leverage Nuxt’s optimization features
- Optimize Web Vitals (LCP, CLS, FID).

## Data Fetching

- Use Nuxt’s `useFetch` or `useAsyncData` when appropriate. Use project-specific `$fetch` wrappers when possible.
- Handle loading, error, and success states explicitly
- Cancel stale requests on component unmount or param change
- Implement optimistic updates with rollbacks on failure
- Cache responses and use background revalidation

## Error Handling

- Wrap risky logic in `try/catch`; provide user-friendly messages
- Display fallback UI or error alerts gracefully
- Use the `b-banners` component and the `useBanner` composable, if available, for displaying errors and warnings

## Forms and Validation

- Use the FormKit library, if available, for building forms and validation
- Ensure accessible labeling, error announcements, and focus management

## Routing

- Use the Nuxt Router module for routing
- Implement nested routes and route-level code splitting
- Protect routes with navigation guards in the `middleware` directory
- Use the `navigateTo` function and the `useRoute` and `useRouter` composables in `setup` for programmatic navigation
- Prefer the `navigateTo` function over the `useRouter` composable or `$router.push` method for programmatic navigation
- Use the `useRouteQuery` composable, if available, for managing query parameters
- Manage query params and dynamic segments properly

## Testing

- Write unit tests with Vitest
- Focus on behavior, not implementation details
- Use the `mount` and `shallowMount` composables for component isolation
- Mock global plugins (router, Pinia) as needed
- Add end-to-end tests with Playwright

## Implementation Process

1. Plan component and composable architecture
2. Initialize Nuxt project with JavaScript
3. Define Pinia stores and composables
4. Create core UI components and layout
5. Integrate routing and navigation
6. Implement data fetching and state logic
7. Build forms with validation and error states
8. Add global error handling and fallback UIs
9. Add unit and E2E tests
10. Optimize performance and bundle size
11. Ensure accessibility compliance
12. Document components, composables, and stores

## Additional Guidelines

- Follow the official Nuxt.js and Vue.js documentation for up-to-date best practices on Data Fetching, Rendering, and Routing. [Nuxt.js Documentation](https://nuxt.com/docs) [Vue.js Documentation](https://vuejs.org/guide/introduction.html)
- Use ESLint (with `@nuxt/eslint-config` and `eslint-config-kswedberg/flat/nuxt.mjs`) for code consistency
- Use VueUse for common composables and utility functions.
- Document complex logic with JSDoc
- Use Vue DevTools for debugging and profiling

## Common Patterns

- Renderless components and scoped slots for flexible UI
- Teleport for modals and overlays
- Plugin system for global utilities (i18n, analytics)
- Composable factories for parameterized logic
