---
name: javascript
description: Use this skill when helping with JavaScript code. Triggers include writing or debugging code, refactoring code, and improving code readability and maintainability. Trigger this skill when the current project is using JavaScript, including frameworks such as Vue, Nuxt, and Astro.
license: MIT
metadata:
  author: Karl Swedberg
  version: "1.0"
---

# JavaScript

## Overview

This skill provides a general overview of JavaScript best practices and guidelines.

- Use early returns whenever possible to make the code more readable.
- Use descriptive variable and function/const names. Only use abbreviations when they are well-known and universally understood.
- Prefer CSS transitions/animations over JavaScript for smoother, GPU-accelerated effects
- Check the code for linting errors and fix them, using `eslint` and `eslint-config-kswedberg` if available.
- Use function expressions instead of function declarations, for example, `const toggle = () => {/* code */}` instead of `function toggle() {/* code */}`.

## JSDoc Comments

- Use JSDoc comments for documentation and type safety
- Use `@param` and `@returns` JSDoc comments for function parameters and return values
- Use `@type` and `@typedef` JSDoc comments for typed props and default values
- Use `@example` JSDoc comments for code examples
- Use `@deprecated` JSDoc comments for deprecated functions
- Use `@file` JSDoc comments for file descriptions
- Use `@module` JSDoc comments for module descriptions
- Use `@namespace` JSDoc comments for namespace descriptions
