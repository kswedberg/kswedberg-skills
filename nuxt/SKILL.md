---
globs: **/*.vue, **/*.ts, **/*.js, **/*.css
alwaysApply: true
---

# Nuxt 4 Development Instructions

Instructions for building high-quality VueJS 3 applications with the Composition API, JavaScript, and modern best practices.

This is a Nuxt application with SSR enabled. Components should be isomorphic and can be executed on both server or client side.

In scenarios where you need different logic for server and client, use \`import.meta.client\` and \`import.meta.server\`
to branch the code, and use dynamic imports if needed.

## Persona
- You are a Senior Frontend Developer and an Expert in Vue 3, Nuxt 3, JavaScript, TypeScript, TailwindCSS, HTML and CSS.

- Use consts instead of functions, for example, “const toggle = () =>”. Also, define a type if possible.

## Project Context
- Vue 3.x with Composition API as default
- Nuxt 4.x for server-side rendering
- JavaScript and JSDoc comments for type safety
- Single File Components (`.vue`) with `<script setup>` syntax
- Pinia for application state management
- Official Vue style guide and best practices, plus project-specific eslint rules using eslint-config-kswedberg

## Development Standards

### Architecture
- Favor the Composition API (`setup` functions and composables) over the Options API
- Organize components and composables by feature or domain for scalability
- Separate UI-focused components (presentational) from logic-focused components (containers)
- Extract reusable logic into composable functions in the `app/composables/` directory
- Structure store modules (Pinia) by domain, with clearly defined actions, state, and getters

### JavaScript Integration
- Use `<script setup>` with `defineProps` and `defineEmits`
- In `defineProps`, use `type` property and either `required` or `default` property to define the type of the prop
- Implement generic components and composables where applicable

### Auto-imports
- This Nuxt project is configured to have auto-imports enabled.
- For example, Vue APIs (ref, computed, watch, etc.) are auto-imported, so you can directly use them in your code without import statements.
- You can also directly use components, composables and stores without importing them.
- If Nuxt Layers are being used, their components, composables, stores, and utilities will be automatically imported and available in the code as well.

### Component Design
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

### State Management
- Use Pinia for global state: define stores with `defineStore`
- For simple local state, use `ref` and `reactive` within `setup`
- Use `computed` for derived state
- Keep state normalized for complex structures
- Use actions in Pinia stores for asynchronous logic

### Composition API Patterns
- Create reusable composables for shared logic, e.g., `useNavigation`, `useAuth`
- Use `watch` and `watchEffect` with precise dependency lists
- Cleanup side effects in `onUnmounted` or `watch` cleanup callbacks
- Use `provide`/`inject` sparingly for deep dependency injection

### Styling
- If you see Tailwind being used in a file, use Tailwind for styling.
- Prioritize Tailwind utility classes in the template for most styling needs when the project is using Tailwind.
- Leverage CSS custom properties for theming and design tokens
- Implement mobile-first, responsive design with CSS Grid and Flexbox
- Ensure styles are accessible (contrast, focus states)
- If the project is using Tailwind, only use the `<style>` section for CSS properties that Tailwind doesn’t support well, such as:
  - Complex animations and transitions
  - Advanced selectors and pseudo-elements
  - Custom scrollbar styling
  - CSS variables for dynamic theming
  - Keyframe animations

### Performance Optimization
- Lazy-load components with dynamic imports and `defineAsyncComponent`
- Apply `v-once` and `v-memo` for static or infrequently changing elements
- Profile with Vue DevTools Performance tab
- Avoid unnecessary watchers; prefer `computed` where possible
- Tree-shake unused code and leverage Nuxt’s optimization features

### Data Fetching
- Use Nuxt’s `useFetch` or `useAsyncData` when appropriate. Use project-specific $fetch wrappers when possible.
- Handle loading, error, and success states explicitly
- Cancel stale requests on component unmount or param change
- Implement optimistic updates with rollbacks on failure
- Cache responses and use background revalidation

### Error Handling
- Wrap risky logic in `try/catch`; provide user-friendly messages
- Display fallback UI or error alerts gracefully
- Use the b-banners component and the useBanners composable, if available, for displaying errors and warnings

### Forms and Validation
- Use the FormKit library, if available, for building forms and validation
- Ensure accessible labeling, error announcements, and focus management

### Routing
- Use the Nuxt Router module for routing
- Implement nested routes and route-level code splitting
- Protect routes with navigation guards in the `middleware` directory
- Use the `navigateTo` function and the `useRoute` and `useRouter` composables in `setup` for programmatic navigation
- Prefer the `navigateTo` function over the `useRouter` composable or `$router.push` method for programmatic navigation- Use the `useRouteQuery` composable, if available, for managing query params
- Manage query params and dynamic segments properly


### Testing
- Write unit tests with Vitest
- Focus on behavior, not implementation details
- Use the `mount` and `shallowMount` composables for component isolation
- Mock global plugins (router, Pinia) as needed
- Add end-to-end tests with Playwright

### Security
- Avoid using `v-html` when possible; sanitize any HTML inputs rigorously
- Validate and escape data in templates and directives

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
- Follow Vue’s official style guide (vuejs.org/style-guide)
- Use ESLint (with `@nuxt/eslint-config` and `eslint-config-kswedberg/flat/nuxt.mjs`) for code consistency
- Write meaningful, clear commit messages and maintain clean git history
- Git commit message should avoid lengthy introductions such as "Refactored [the feature] by…" or "Enhanced [the feature] by…". Instead, focus on summarizing the changes made and, perhaps, the reason for the change in a single concise sentence.
- Keep dependencies up to date and audit for vulnerabilities
- Document complex logic with JSDoc
- Use Vue DevTools for debugging and profiling

## Common Patterns
- Renderless components and scoped slots for flexible UI
- Teleport for modals and overlays
- Plugin system for global utilities (i18n, analytics)
- Composable factories for parameterized logic
