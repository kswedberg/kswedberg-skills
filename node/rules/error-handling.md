---
name: error-handling
description: Error handling patterns in Node.js
metadata:
  tags: errors, exceptions, try-catch, error-handling
---

# Error Handling in Node.js

## Minimal Error Code Implementation

If you prefer no dependencies, use this minimal pattern:

```javascript
/**
 * @typedef {object} AppErrorOptions
 * @property {string} code
 * @property {number} [statusCode]
 * @property {Error} [cause]
 */

/**
 * @param {string} message
 * @param {AppErrorOptions} options
 * @returns {Error}
 */
const createAppError = function(message, options) {
  const error = new Error(message, {cause: options.cause});

  error.code = options.code;
  error.statusCode = options.statusCode ?? 500;
  Error.captureStackTrace(error, createAppError);

  return error;
};

// Factory functions for common errors
/** @param {string} resource */
const notFound = function(resource) {
  return createAppError(`${resource} not found`, {code: 'NOT_FOUND', statusCode: 404});
};

/** @param {string} message */
const validationError = function(message) {
  return createAppError(message, {code: 'VALIDATION_ERROR', statusCode: 400});
};

/**
 * @param {string} message
 * @param {Error} [cause]
 */
const databaseError = function(message, cause) {
  return createAppError(message, {code: 'DATABASE_ERROR', statusCode: 500, cause});
};

/**
 * @param {unknown} error
 * @returns {error is Error & { code: string; statusCode: number }}
 */
const isAppError = function(error) {
  return error instanceof Error && 'code' in error && 'statusCode' in error;
};

/** @param {string} id */
const fetchUser = async function(id) {
  try {
    const user = await db.users.findById(id);

    if (!user) {
      throw notFound('User');
    }

    return user;
  } catch (error) {
    if (isAppError(error)) {
      throw error;
    }
    throw databaseError('Failed to fetch user', error instanceof Error ? error : undefined);
  }
};

/** @param {string} id */
const loadUserForRequest = async function(id) {
  try {
    await fetchUser(id);
  } catch (error) {
    if (isAppError(error) && error.code === 'NOT_FOUND') {
      return null;
    }
    throw error;
  }
};

// Usage
throw notFound('User');
```

```javascript
throw validationError('Email is required');
```

## Checking Error Codes

Check errors by code, not by class. The example above defines `isAppError` and uses it inside `fetchUser` so you branch on `error.code` instead of matching custom subclasses.

## Async Error Handling

Always use try-catch with async/await and propagate errors properly. The `fetchUser` and `loadUserForRequest` functions in the example above show wrapping persistence calls, re-throwing known app errors, and mapping unknown failures to `databaseError`.

## Unhandled Rejections and Exceptions

Do not handle `unhandledRejection` and `uncaughtException` manually.

## Never Swallow Errors

Never use empty catch blocks that hide errors:

```javascript
// BAD - error is swallowed
try {
  await riskyOperation();
} catch (error) {
  // Do nothing
}

// GOOD - handle or re-throw
try {
  await riskyOperation();
} catch (error) {
  logger.error({err: error}, 'Operation failed');
  throw error;
}
```

## Error Cause Chain

Use the `cause` option to preserve error chains:

```javascript
try {
  await externalService.call();
} catch (error) {
  throw new Error('Service call failed', {cause: error});
}
```
