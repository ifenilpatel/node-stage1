# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

Node.js REST API (Express 5) with PostgreSQL (Sequelize), Redis (ioredis), and BullMQ job queues. CommonJS throughout. Two build targets via `BUILD`: `development` and `client`.

## Entry points

| File         | Responsibility                                                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server.js`  | Process lifecycle only: uncaught errors, DB/Redis connect, `app.listen()`, graceful shutdown (`SIGTERM` / `SIGINT`). **Do not** add Express middleware or routes here. |
| `src/app.js` | Express application: `env.js`, middleware, routes, 404, error handler. Exports the `app` instance. **Do not** call `listen()` or open DB/Redis here.                   |
| `env.js`     | Loads `.env.development` or `.env.client` based on `process.env.BUILD`.                                                                                                |

## Directory layout

```
server.js, env.js             # Root bootstrap
config/                       # database.js, redis.js
models/                       # Sequelize models (auto-loaded via models/index.js)
migrations/                   # sequelize-cli migrations (empty — add when rebuilding schema)
src/
  app.js                      # Express app setup
  routes/                     # Express routers; mounted from index.route.js
  controllers/                # Request handlers (add when rebuilding features)
  services/                   # Business logic and DB access (add when rebuilding features)
  validators/                 # common.validation.js (shared Zod schemas; required)
  middlewares/                # auth, validate, error
  classes/                    # APIResponse, APIError
  constants/                  # httpStatus, httpCode
  queues/                     # emailQueue + pushNotificationQueue (jobs/, workers/)
  utils/                      # logger, tokens, redis helpers, asyncHandler
```

## Architecture conventions

Feature modules (controllers, services, migrations, feature validators, DTOs) were cleared for a fresh rebuild. Keep `src/validators/common.validation.js` for shared schemas (pagination, token, password). Existing scaffolding: middlewares, `APIError` / `APIResponse`, models, queues.

When adding features:

- **Routes** wire `auth` → `validate(schema)` → controller. API paths use `/v1/api_*` naming.
- **Controllers** use `asyncHandler`; success responses use `APIResponse` with `HTTP_STATUS` and `HTTP_CODE`.
- **Services** throw `APIError` static helpers; unexpected errors propagate to `error.middleware.js`.
- **Validation**: reuse fields from `src/validators/common.validation.js`; add feature schemas in `src/validators/`; use `validate.middleware`.
- Flow: migration (if needed) → model → validator → service → controller → route → `index.route.js`.

## Commands

```bash
npm run start:development    # nodemon + BUILD=development
npm run start:client         # nodemon + BUILD=client
npm run db:migrate:development
npm run db:migrate:client
npm run lint
npm run lint:fix
npm run format
```

Pre-commit runs ESLint and Prettier on staged `*.js` via Husky.

## Code style

- CommonJS: `require` / `module.exports`; include `.js` in relative import paths.
- Match existing naming: `ctrl*` controllers, `*Schema` validators, `HTTP_STATUS` / `HTTP_CODE` for responses.
- Use `src/utils/logger.util.js` for logging, not `console.log` in application code (startup env log in `env.js` is fine).
- Keep changes minimal and localized.

## Environment

- Set `BUILD` to `development` or `client` (scripts use `cross-env`).
- Env files: `.env.development`, `.env.client` (not committed). `PORT` defaults to `3000`.
- PostgreSQL and Redis must be running before `server.js` starts.

## Pitfalls

- Do not merge server concerns into `src/app.js` or app concerns into `server.js`.
- Auth middleware file is spelled `auth.midddleware.js` (three d’s)—use the actual filename.
- Static uploads are served from `src/uploads` via `src/app.js`.
- Redis is shared by app config and BullMQ; close via `server.js` shutdown only.

## When adding endpoints

1. Add migration in `migrations/` if the schema changes.
2. Add or update model in `models/`.
3. Add feature Zod schema in `src/validators/` (import shared fields from `common.validation.js`); add DTO in `src/classes/dto/` if needed.
4. Add service in `src/services/`.
5. Add controller in `src/controllers/`.
6. Add route file and mount it in `src/routes/index.route.js`.
