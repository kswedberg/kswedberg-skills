---
name: nginx
description: Use this skill when helping with Nginx development tasks. Triggers include writing or debugging Nginx configuration (server blocks, location blocks, upstreams, proxy_pass, rewrites, maps, try_files) and Nginx performance tuning (buffer sizing, keepalive tuning, caching, connection pooling, benchmarking). Also use when the user mentions .conf files, nginx.conf, or any directive-level Nginx questions. Do NOT use for Apache, Caddy, HAProxy, or general web server questions unrelated to Nginx.
license: MIT
metadata:
  author: Nejc Lovrencic
  version: "1.0"
  source_repo: https://github.com/nejclovrencic/nginx-agent-skills
---

# Nginx Development

## Core Guidance

When writing or reviewing Nginx configuration:

1. Always consider the **directive inheritance model**. Child blocks inherit from parent unless they redefine the directive. For example, adding one `proxy_set_header` in a location block wipes all inherited `proxy_set_header` directives from the server block.
2. Prefer `map` over `if` for conditional logic. `if` in location context is dangerous and only reliably supports `return` and `rewrite`. See references/nginx-gotchas.md for the full list.
3. Always clarify `proxy_pass` trailing-slash behavior — it is the single most common source of subtle bugs.
4. When writing `upstream` blocks, always include keepalive configuration and explain connection pooling implications.
5. When writing Nginx directives, always check [docs](https://nginx.org/en/docs/), specifically module references, to verify that a directive actually exists, and what values it accepts (on/off, variable, fixed values, etc).

When advising on performance:

2. Always consider the full request path: client → Nginx → upstream, and tune each segment.
3. Buffer sizing has cascading effects — refer to the buffer tuning section in references/nginx-gotchas.md.

## Reference Files

Load these as needed based on the task:

- **[references/nginx-gotchas.md](references/nginx-gotchas.md)** — Directive behavior gotchas, inheritance rules, location matching, common misconfigurations. Read when writing or debugging any Nginx config.
