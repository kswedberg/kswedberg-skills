---
name: streams
description: Working with Node.js streams
metadata:
  tags: streams, readable, writable, transform, pipeline
---

# Node.js Streams

## High-signal triggers

If the prompt mentions **CSV**, **ETL**, **ingestion**, **large files**, **transform streams**, **backpressure**, or **line-by-line processing**, prioritize `pipeline()` + explicit async-generator transforms.

## Use pipeline for Stream Composition

Always use `pipeline` instead of `.pipe()` for proper error handling:

```javascript
import {pipeline} from 'node:stream/promises';
import {createReadStream, createWriteStream} from 'node:fs';
import {createGzip} from 'node:zlib';

const compressFile = async function(input, output) {
  await pipeline(
    createReadStream(input),
    createGzip(),
    createWriteStream(output)
  );
};
```

### Async Generators in Pipeline

Use async generators for transformation:

```javascript
import {pipeline} from 'node:stream/promises';
import {createReadStream, createWriteStream} from 'node:fs';

const toUpperCase = async function*(source) {
  for await (const chunk of source) {
    yield chunk.toString().toUpperCase();
  }
};

const processFile = async function(input, output) {
  await pipeline(
    createReadStream(input),
    toUpperCase,
    createWriteStream(output)
  );
};
```

### CSV/ETL pattern: pipeline + async transform + deduplicated enrichment

For ingestion-style tasks, show an explicit `async function*` transform and integrate deduped async lookups:

```javascript
import {pipeline} from 'node:stream/promises';
import {createReadStream, createWriteStream} from 'node:fs';
import {createCache} from 'async-cache-dedupe';

const cache = createCache({
  ttl: 60,
  stale: 5,
  storage: {type: 'memory'},
});

cache.define('lookupPlan', async(planId) => {
  return await fetch(`https://billing.internal/plans/${planId}`).then(async(res) => await res.json());
});

const enrichCsvRows = async function*(source) {
  let tail = '';

  for await (const chunk of source) {
    tail += chunk.toString('utf8');
    const lines = tail.split('\n');

    tail = lines.pop() ?? '';

    for (const line of lines) {
      if (line.trim().length === 0) {
        continue;
      }
      const [userId, planId] = line.split(',');
      const plan = await cache.lookupPlan(planId); // concurrent requests dedupe by key

      yield`${userId},${planId},${plan.tier}\n`;
    }
  }

  if (tail.trim().length > 0) {
    const [userId, planId] = tail.split(',');
    const plan = await cache.lookupPlan(planId);

    yield`${userId},${planId},${plan.tier}\n`;
  }
};

await pipeline(
  createReadStream('users.csv'),
  enrichCsvRows,
  createWriteStream('users-enriched.csv')
);
```

### Multiple Transformations

Chain multiple async generators:

```javascript
import {pipeline} from 'node:stream/promises';

const parseLines = async function*(source) {
  let buffer = '';

  for await (const chunk of source) {
    buffer += chunk.toString();
    const lines = buffer.split('\n');

    buffer = lines.pop() ?? '';
    for (const line of lines) {
      yield line;
    }
  }
  if (buffer) {
    yield buffer;
  }
};

const filterNonEmpty = async function*(source) {
  for await (const line of source) {
    if (line.trim()) {
      yield`${line}\n`;
    }
  }
};

await pipeline(
  createReadStream('input.txt'),
  parseLines,
  filterNonEmpty,
  createWriteStream('output.txt')
);
```

## Async Iterators with Streams

Use async iterators for consuming streams:

```javascript
import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';

const processLine = async function(line) {
  // Process one line (parse, validate, persist, etc.)
};

const processLines = async function(filePath) {
  const fileStream = createReadStream(filePath);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    await processLine(line);
  }
};
```

## Readable.from for Creating Streams

Create readable streams from iterables:

```javascript
import {Readable} from 'node:stream';

const generateData = async function*() {
  for (let i = 0; i < 100; i++) {
    yield`${JSON.stringify({id: i, timestamp: Date.now()})}\n`;
  }
};

const stream = Readable.from(generateData());
```

## Backpressure Handling

Respect backpressure signals using `once` from events:

```javascript
import {Writable} from 'node:stream';
import {once} from 'node:events';

const writeData = async function(writable, data) {
  for (const chunk of data) {
    const canContinue = writable.write(chunk);

    if (!canContinue) {
      await once(writable, 'drain');
    }
  }
};
```

## Stream Consumers (Node.js 18+)

Use stream consumers for common operations:

```javascript
import {text, json, buffer} from 'node:stream/consumers';
import {Readable} from 'node:stream';

/**
 * @template T
 * @param {import('node:stream').Readable} stream
 * @returns {Promise<T>}
 */
const readStreamAsJson = async function(stream) {
  return json(stream);
};

/** @param {import('node:stream').Readable} stream */
const readStreamAsText = async function(stream) {
  return text(stream);
};
```
