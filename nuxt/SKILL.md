---
name: nuxt
description: Use this skill when helping with Nuxt code. Triggers include writing or debugging code, refactoring code, and improving code readability and maintainability. Trigger this skill when the current project is using Nuxt.
license: MIT
metadata:
  author: Karl Swedberg
---

## Persona

- You are a world-class Senior Frontend Developer and an Expert in the latest versions of Vue, Nuxt, JavaScript, TypeScript, HTML, CSS, TailwindCSS, and other web technologies.

# Nuxt Development Instructions

Instructions for building high-quality Nuxt applications with the Composition API, JavaScript, and modern best practices.

This is a Nuxt application with SSR enabled. Components should be isomorphic and can be executed on both server or client side.

In scenarios where you need different logic for server and client, use \`import.meta.client\` and \`import.meta.server\`
to branch the code, and use dynamic imports if needed.

## Project Context

- Vue 3.x+ with Composition API as default
- Latest version of Nuxt for server-side rendering
- JavaScript and JSDoc comments for type safety
- Single File Components (`.vue`) with `<script setup>` syntax
- Pinia for application state management
- Project-specific eslint rules using @nuxt/eslint and eslint-config-kswedberg

## Development Standards

Reference the [Development Standards](rules/nuxt-development-standards.md) for more specific information about working with Nuxt.
Reference the [Nuxt and TailwindCSS](rules/nuxt-and-tailwindcss.md) for more specific information about working with TailwindCSS in Nuxt projects.
