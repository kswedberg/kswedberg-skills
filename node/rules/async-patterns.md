---
name: async-patterns
description: Async/await and Promise patterns
metadata:
  tags: async, await, promises, concurrency
---

# Async Patterns in Node.js

## Always Prefer async/await

Use async/await over raw Promises for readability:

```js
// GOOD
const processItems = async function(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);

    results.push(result);
  }

  return results;
};

// AVOID - callback-style Promise chains
const processItemsWithChains = function(items) {
  return Promise.resolve([]).then((results) => {
    return items.reduce((chain, item) => {
      return chain.then((r) => processItem(item).then((res) => [...r, res]));
    }, Promise.resolve(results));
  });
};
```

## Parallel Execution with Promise.all

Use Promise.all for independent operations:

```js
const fetchAllData = async function(ids) {
  const promises = ids.map((id) => fetchData(id));
  return Promise.all(promises);
};
```

## Controlled Concurrency

Limit concurrent operations to prevent resource exhaustion and extreme memory usage. Use [p-limit](https://github.com/sindresorhus/p-limit) or [p-map](https://github.com/sindresorhus/p-map):

```js
import pLimit from 'p-limit';

const limit = pLimit(5); // Max 5 concurrent operations

const results = await Promise.all(
  items.map((item) => limit(() => processItem(item))),
);
```

Or use p-map for cleaner syntax:

```js
import pMap from 'p-map';

const results = await pMap(items, processItem, {concurrency: 5});
```

## Promise.allSettled for Fault Tolerance

Use Promise.allSettled when some failures are acceptable:

```js
const fetchMultiple = async function(urls) {
  const results = await Promise.allSettled(
    urls.map((url) => fetch(url).then((r) => r.text())),
  );

  const map = new Map();

  urls.forEach((url, i) => {
    const result = results[i];

    map.set(url, result.status === 'fulfilled' ? result.value : result.reason);
  });

  return map;
};
```

## Avoid Async in Constructors

Constructors cannot be async. Use factory functions instead:

```js
// BAD - constructor cannot await
class DatabaseIncomplete {
  constructor() {
    // Cannot use await here
  }
}
```

```js
// GOOD - factory function (constructors cannot be async)
class Database {
  constructor(connection) {
    this.connection = connection;
  }

  static async create(config) {
    const connection = await connect(config);
    return new Database(connection);
  }
}

// Usage
const db = await Database.create(config);
```

## AbortController for Cancellation

Use AbortController to cancel long-running operations:

```js
const fetchWithTimeout = async function(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {signal: controller.signal});
  } finally {
    clearTimeout(timeoutId);
  }
};
```
