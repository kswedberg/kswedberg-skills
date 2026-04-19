# Nuxt and TailwindCSS

This file provides a general overview of TailwindCSS best practices and guidelines when used in a Nuxt project. Only trigger these rules when the project is using TailwindCSS.

## Overview

- If you see Tailwind being used in a file, use Tailwind for styling.
- If the project is using Tailwind, prioritize Tailwind utility classes in the template for most styling needs.
- If the project is using Tailwind, only use the `<style>` section for CSS properties that Tailwind doesn’t support well, such as:
  - Complex animations and transitions
  - Advanced selectors and pseudo-elements
  - Custom scrollbar styling
  - CSS variables for dynamic theming
  - Keyframe animations

## Ensure Tailwind is imported into Vue components

If the project is using Tailwind, ensure Tailwind is imported into Vue components.

### Tailwind Reference Plugin

Place the following code in a file called `vite/tailwind-reference-plugin.js`:

```javascript
import { resolve } from "node:path";
import { createFilter } from "vite";

/**
 * A callback that determines which "@reference" should be added by the tailwindAutoReference plugin.
 *
 * @callback CssFileFn
 * @param {string} [code] - The content of the file being transformed.
 * @param {string} [id] - The unique identifier of the file being transformed.
 * @returns {string|string[]|Promise<string|string[]>} The path(s) to the Tailwind CSS file(s).
 */

/**
 * A callback that determines whether a file should be skipped by the tailwindAutoReference plugin.
 *
 * @callback SkipFn
 * @param {string} [code] - The content of the file being transformed.
 * @param {string} [id] - The unique identifier of the file being transformed.
 * @returns {boolean} Returns true if the file should be skipped, false otherwise.
 */

const defaultOpts = {
  include: [/\.vue\?.*type=style/],
  exclude: [],
  skip: () => false,
};

const resolveFn = (fn, ...args) =>
  Promise.resolve(fn instanceof Function ? fn(args) : fn);

/**
 * Applies the `@reference` directive to vue files that use `@apply` in their styles.
 *
 * @function tailwindReferencePlugin
 * @param {string|string[]|CssFileFn} [cssFile="./src/index.css"] - The path to the Tailwind CSS file or an array of them or a sync or async function that returns it or them.
 * @param {Object} [opts] - An options object.
 * @param {Array<RegExp|string>} [opts.include=[/\.vue/]] - A list of picomatch patterns that match files to be transformed.
 * @param {Array<RegExp|string>} [opts.exclude=[]] - A list of picomatch patterns that match files to be excluded from transformation.
 * @param {SkipFn} [opts.skip] - A function that determines whether a file should be skipped. It takes the code and id as arguments and returns a boolean.
 * @returns {import('vite').Plugin} - The plugin configuration object for Vite.
 */
export const tailwindReferencePlugin = (
  cssFile = "assets/css/main.css",
  opts = {},
) => {
  const { include, exclude, skip } = { ...defaultOpts, ...opts };
  let root, fileFilter;

  const getReferenceStr = (reference) =>
    (Array.isArray(reference) ? reference : [reference]).reduce(
      (acc, file) => `${acc}\n@reference "${resolve(root, file)}";`,
      "",
    );

  return {
    name: "tailwind-reference-plugin",
    enforce: "pre",
    configResolved: (config) => {
      root = config.root;
      fileFilter = createFilter(include, exclude, { resolve: root });
    },
    transform: async (code, id) => {
      if (!fileFilter(id)) {
        return null;
      }
      const hasTailwindDirective =
        code.includes("@apply ") || code.includes("@variant ");

      if (!hasTailwindDirective || skip(code, id)) {
        return null;
      }

      const lastUseMatch = [...code.matchAll(/^\s*@use.*\n/gm)].at(-1);
      const map = { mappings: "" };

      if (!lastUseMatch) {
        return {
          code: `${getReferenceStr(await resolveFn(cssFile, code, id))}\n${code}`,
          map,
        };
      }

      const before = code.slice(0, lastUseMatch.index);
      const after = code.slice(lastUseMatch.index + lastUseMatch[0].length);

      return {
        code: `${before}${getReferenceStr(await resolveFn(cssFile, code, id))}\n${after}`,
        map,
      };
    },
  };
};
```

### Nuxt Configuration

In the `nuxt.config.ts` file:

- Import `tailwindcss/vite` and the newly created `tailwindReferencePlugin` file.

```typescript
import tailwindcss from "@tailwindcss/vite";
import { tailwindReferencePlugin } from "./vite/tailwind-reference-plugin";
```

- Add the `tailwindcss` and `tailwindReferencePlugin` plugins to the `vite.plugins` section of the Nuxt configuration.

```typescript
  vite: {
    plugins: [tailwindReferencePlugin(path.join(currentDir, 'app/assets/css/main.css')), tailwindcss()],
  },
```
