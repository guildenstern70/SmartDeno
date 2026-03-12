# AGENTS Guide for SmartDeno

## Project Snapshot
- Stack: Deno + TypeScript, Oak HTTP server, Oak Sessions, Deno KV, Eta templates, DyeLog logger, Bootstrap UI.
- Runtime entrypoint is `src/main.ts`; app serves HTML pages and JSON REST endpoints from the same Oak app.
- Goal is Deno + Deno Deploy compatibility; prefer JSR imports where possible (`deno.json` imports map).

## Architecture and Data Flow
- `src/main.ts` wires everything in this order: logging middleware -> response-time middleware -> KV bootstrap -> sessions middleware -> web router -> REST router -> static file handler.
- Web routes are in `src/controller/web.ts`; each route instantiates a page class and calls `render()` / `post()`.
- Page layer (`src/page/*.ts`) extends `Page` (`src/page/page.ts`) to share session lookup (`logged-user`) and Eta rendering via `static/templates`.
- REST routes are in `src/controller/rest.ts`; each handler creates a `DenoKV` instance and returns JSON with Oak `Status` codes.
- Persistence is isolated in `src/db/denokv.ts` using KV keys like `["users", username]`; startup seeds default users (`alessio`, `guest`) if DB is empty.

## Conventions You Should Follow
- Keep routes thin and delegate logic to page/DB classes (current pattern in both controllers).
- Session key is exactly `"logged-user"` (used by login/logout and layout/footer behavior).
- Templates expect specific payload names; preserve them when editing pages (for example `sessionUser`, `appname`, `appversion`, `loginerrors`).
- New HTML pages should follow the existing trio: page class in `src/page/`, route in `src/controller/web.ts`, Eta template in `static/templates/`, optional page JS in `static/js/`.
- Menu highlighting relies on `menuitem0..3` IDs and `setFeatureActive(index)` in `static/js/menuitems.js`.
- Logging is intentionally verbose (`LogLevel.TRACE`); add useful `logger.info/warn/error` calls near route and DB boundaries.

## Developer Workflows
- Start locally: `deno task start` (see `deno.json` and `run.sh`).
- Lint: `deno lint src` (see `lint.sh`); lint config excludes `no-explicit-any`, so `any` is tolerated in route/page context plumbing.
- No test suite is currently present; validate changes by running app and exercising `/`, `/login`, `/features`, `/restapi`, and `/api/v1/user` endpoints.

## Integration and Deployment Notes
- Import policy: mostly JSR (`@oak/oak`, `@littlelite/dyelog`, `eta`), with `oak_sessions` currently from `deno.land/x`.
- Static assets are served from `<cwd>/static` in `src/main.ts`; keep template and asset paths relative to this assumption.
- Deno Deploy requires an attached KV database (documented in `README.md` FAQ).

