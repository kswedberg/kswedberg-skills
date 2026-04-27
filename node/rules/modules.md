---
name: modules
description: ES Modules and CommonJS patterns
metadata:
  tags: modules, esm, commonjs, imports, exports
---

# Node.js Modules

## Prefer ES Modules

Use ES Modules (ESM) for new projects:

```json
// package.json
{
  "type": "module"
}
```

```javascript
// Named exports (preferred)
/** @param {unknown} data */
/** @returns {unknown} */
export const processData = function(data) {
  // ...
};

export const CONFIG = {
  timeout: 5000,
};

// Named imports
import {processData as runProcessData, CONFIG as appConfig} from './utils.js';
```

## File Extensions in ESM

Always include file extensions in ESM imports:

```javascript
// GOOD - explicit extension
import {helper} from './helper.js';
import config from './config.json' with {type: 'json'};

// BAD - missing extension (works in bundlers but not native ESM)
import {helper as helperNoExtension} from './helper';
```

## Avoid Barrel Exports

Don't use index files to simplify imports. Stick to the exact file path.

## Default vs Named Exports

Prefer named exports for better refactoring and tree-shaking:

```javascript
// GOOD - named exports
/** @param {unknown} config */
export const createServer = function(config) {
  // ...
};

/** @param {unknown} config */
export const createClient = function(config) {
  // ...
};

// AVOID - default exports
/** @param {unknown} config */
const createServerDefault = function(config) {
  // ...
};

export default createServerDefault;
```

## Dynamic Imports

Use dynamic imports for code splitting and conditional loading:

```javascript
const loadPlugin = async function(name) {
  const module = await import(`./plugins/${name}.js`);
  return module.default;
};

// Conditional loading
const {default: heavy} = await import('./heavy-module.js');
```

## __dirname and __filename in ESM

Use `import.meta.dirname` and `import.meta.filename` (Node.js 20.11+):

```javascript
import {join} from 'node:path';

const configPath = join(import.meta.dirname, 'config.json');
const currentFile = import.meta.filename;
```
