# TlyCode Documentation

TlyCode is a serverless web framework built on the TypeForge platform. It compiles TypeScript to Lua using TSTL. UI rendering is handled by React components embedded in server-generated HTML pages.

Currently the application serves a single Hello World page at `/`.

## Guides

- [Architecture](architecture.md) — Project structure and compilation pipeline
- [Routing](routing.md) — Route definitions and request handling
- [React Integration](react.md) — React component rendering and registry
- [Runtime API](runtime-api.md) — Globally available Lua runtime functions
- [TSTL Gotchas](tstl-gotchas.md) — Critical Lua/JS differences
- [Validation](validation.md) — Decorator-based form validation
- [Patterns](patterns.md) — Common code patterns for handlers, repositories, and components
