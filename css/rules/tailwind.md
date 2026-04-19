---
description: "Tailwind CSS v4+ installation and configuration for Vite projects using the official @tailwindcss/vite plugin"
applyTo: "vite.config.ts, nuxt.config.ts, **/*.css, **/*.vue"
---

# Tailwind CSS v4+ Installation with Vite

Instructions for installing and configuring Tailwind CSS version 4 and above using the official Vite plugin. Tailwind CSS v4 introduces a simplified setup that eliminates the need for PostCSS configuration and tailwind.config.js in most cases.

## Key Changes in Tailwind CSS v4

- **No PostCSS configuration required** when using the Vite plugin
- **No tailwind.config.js required** - configuration is done via CSS
- **New @tailwindcss/vite plugin** replaces the PostCSS-based approach
- **CSS-first configuration** using `@theme` directive
- **Automatic content detection** - no need to specify content paths

## Installation Steps

### Step 1: Install Dependencies

Install `tailwindcss` and the `@tailwindcss/vite` plugin:

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 2: Configure Vite Plugin

Add the `@tailwindcss/vite` plugin to your Vite configuration file:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

For Nuxt projects with Vite:

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

You should also use the `tailwindReferencePlugin` to automatically add the Tailwind CSS import to your Vue components. See [Nuxt and TailwindCSS](../nuxt/rules/nuxt-and-tailwindcss.md) for more information.

### Step 3: Import Tailwind CSS

Add the Tailwind CSS import to your main CSS file (e.g., `app/assets/css/main.css` ):

```css
@import "tailwindcss";
```

### Step 4: Verify CSS Import in Entry Point

Ensure your main CSS file is imported in your application entry point:

```javascript
// app/app.vue
import './assets/css/main.css';
```

For Nuxt projects with Vite, add the following code to the `nuxt.config.ts` file instead:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Add the main CSS file to the CSS array
  css: ['~/assets/css/main.css'],
});
```

### Step 5: Start Development Server

Run the development server to verify installation:

```bash
npm run dev
```

## What NOT to Do in Tailwind v4

### Do NOT Create tailwind.config.js

Tailwind v4 uses CSS-first configuration. Do not create a `tailwind.config.js` file unless you have specific legacy requirements.

```javascript
// ❌ NOT NEEDED in Tailwind v4
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Do NOT Create postcss.config.js for Tailwind

When using the `@tailwindcss/vite` plugin, PostCSS configuration for Tailwind is not required.

```javascript
// ❌ NOT NEEDED when using @tailwindcss/vite
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Do NOT Use Old Directives

The old `@tailwind` directives are replaced by a single import:

```css
/* ❌ OLD - Do not use in Tailwind v4 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ NEW - Use this in Tailwind v4 */
@import "tailwindcss";
```

## CSS-First Configuration (Tailwind v4)

### Custom Theme Configuration

Use the `@theme` directive in your CSS to customize your design tokens:

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --font-sans: "Inter", system-ui, sans-serif;
  --radius-lg: 0.75rem;
}
```

### Adding Custom Utilities

Define custom utilities directly in CSS:

```css
@import "tailwindcss";

@utility content-auto {
  content-visibility: auto;
}

@utility scrollbar-hidden {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### Adding Custom Variants

Define custom variants in CSS:

```css
@import "tailwindcss";

@variant hocus (&:hover, &:focus);
@variant group-hocus (:merge(.group):hover &, :merge(.group):focus &);
```

## Verification Checklist

After installation, verify:

- [ ] `tailwindcss` and `@tailwindcss/vite` are in `package.json` dependencies
- [ ] `vite.config.ts` or `nuxt.config.ts` includes the `tailwindcss()` plugin
- [ ] Main CSS file contains `@import "tailwindcss";`
- [ ] CSS file is imported in the application entry point or referenced in the `nuxt.config.ts` file
- [ ] Development server runs without errors
- [ ] Tailwind utility classes (e.g. `p-4`, `font-bold`) render correctly

## Example Usage

Test the installation with a simple component:

```vue
<template>
  <div class="min-h-screen flex items-center justify-center">
    <h1 class="text-3xl font-bold underline">
      Hello, Tailwind CSS v4!
    </h1>
  </div>
</template>
```

## Troubleshooting

### Styles Not Applying

1. Verify CSS import statement is `@import "tailwindcss";` (not old directives)
2. Ensure CSS file is imported in your entry point or referenced in the `nuxt.config.ts` file
3. Check Vite or Nuxt config includes the `tailwindcss()` plugin
4. Clear Vite cache: `rm -rf node_modules/.vite && npm run dev`

### Plugin Not Found Error

If you see "Cannot find module '@tailwindcss/vite'":

```bash
npm install @tailwindcss/vite
```

### TypeScript Errors

If TypeScript cannot find types for the Vite plugin, ensure you have the correct import:

```typescript
import tailwindcss from "@tailwindcss/vite";
```

## Reference

- Official Documentation: https://tailwindcss.com/docs/installation/using-vite
- Tailwind CSS v4 Upgrade Guide: https://tailwindcss.com/docs/upgrade-guide
- Nuxt and TailwindCSS: [nuxt/rules/nuxt-and-tailwindcss.md](../nuxt/rules/nuxt-and-tailwindcss.md)
