---
name: performance
description: Performance optimization techniques
metadata:
  tags: performance, optimization, memory, worker-threads
---

# Performance in Node.js

## Avoid Blocking the Event Loop

Never perform CPU-intensive operations synchronously:

```javascript
const salt = Buffer.from('example-salt', 'utf8');

// BAD - blocks event loop
const hashPasswordSync = function(password) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
};

// GOOD - async operation
const hashPassword = function(password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key.toString('hex'));
      }
    });
  });
};
```

## Worker Threads with Piscina

Use [piscina](https://github.com/piscinajs/piscina) for CPU-intensive tasks:

```javascript
// worker.js
/** @param {{ input: string }} data */
const heavyComputation = function(data) {
  // CPU-intensive work here
  return result;
};

export default heavyComputation;
```

```javascript
// main.js
import Piscina from 'piscina';

const piscina = new Piscina({
  filename: new URL('./worker.js', import.meta.url).href,
});

const result = await piscina.run({input: 'data'});
```

Piscina handles worker pool management, task queuing, and load balancing automatically.

## Connection Pooling

Always use connection pools for databases:

```javascript
import {Pool} from 'pg';

const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const query = async function(sql, params) {
  const client = await pool.connect();

  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
};
```

## Avoid Memory Leaks

Common memory leak patterns to avoid:

```javascript
// BAD - unbounded cache
const cache = new Map();

const addToCache = function(key, value) {
  cache.set(key, value); // Never cleaned up
};

// GOOD - LRU cache with max size
import {LRUCache} from 'lru-cache';

const lruCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5,
});

const handler = function() {
  // Event handler body
};

// BAD - listener leak
const subscribeLeaks = function(emitter) {
  emitter.on('event', handler); // Never removed
};

// GOOD - cleanup listeners
const subscribe = function(emitter) {
  emitter.on('event', handler);

  return () => emitter.off('event', handler);
};
```

## Lazy Loading

Load modules only when needed:

```javascript
let heavyModule = null;

const getHeavyModule = async function() {
  if (!heavyModule) {
    const {HeavyModule} = await import('./heavy-module.js');

    heavyModule = new HeavyModule();
  }

  return heavyModule;
};
```

## Related

- [caching.md](./caching.md) - Caching patterns and libraries
- [profiling.md](./profiling.md) - Profiling and benchmarking tools
