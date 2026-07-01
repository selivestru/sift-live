# AGENTS.md

## Tech Stack

| Category        | Technology                                         |
| --------------- | -------------------------------------------------- |
| Framework       | NestJS 11 (code-first GraphQL)                     |
| Database        | PostgreSQL + Prisma 7                              |
| GraphQL         | `@nestjs/graphql` + Apollo (code-first)            |
| REST            | MediaMTX webhooks only (stream module)             |
| WebSockets      | Socket.IO (`@nestjs/platform-socket-io`)           |
| Auth            | JWT access + httpOnly refresh cookie               |
| Background jobs | BullMQ (`stream-processing` queue)                 |
| Media storage   | MinIO (S3-compatible), FFmpeg transcoder           |
| Validation      | `class-validator` + `class-transformer`            |
| Env validation  | Zod — see `src/config/env.config.ts`               |
| Lint            | ESLint 9 flat config                               |
| Format          | Prettier + `@trivago/prettier-plugin-sort-imports` |
| Testing         | Jest (co-located `*.spec.ts`)                      |
| Package manager | bun                                                |

## Setup

```bash
bun install
bunx prisma generate              # Generate Prisma client -> src/generated/prisma/
# Requires PostgreSQL + Redis + MinIO running (see media-server/)
```

Default port: **5000** (`PORT` in `.env`).

## Commands

```bash
bun run dev              # nest start --watch (hot reload)
bun run build            # nest build -> dist/
bun run start            # build + node dist/main (production)
bun run test             # jest (co-located *.spec.ts)
bun run test:cov         # jest --coverage
bun run test:watch       # jest --watch
bun run lint:check       # eslint
bun run lint:fix         # eslint --fix
bun run format:check     # prettier --check "src/**/*.ts"
bun run format:fix       # prettier --write "src/**/*.ts"
bun prisma/seed.ts       # Seed categories (not a migration — no migrations exist yet)
```

## Key Quirks

- **No typecheck command** — no `tsc --noEmit` script. NestJS build (`nest build`) is the closest proxy, but you can run `npx tsc --noEmit` manually if needed.
- **Path alias** `~/*` maps to `src/*` (defined in `tsconfig.json` paths + `tsconfig-paths`). Always use `~/*` over relative imports.
- **Global `@AuthGuard`** — all routes require auth by default. Use `@Public()` to bypass, `@UseGuards(OptionalAuthGuard)` for optional auth.
- **API prefix**: `setGlobalPrefix('api')` — but **GraphQL** is NOT prefixed, remains at `/graphql` (Playground enabled).
- **Prisma client** is generated to `src/generated/prisma/` (gitignored, CJS modules). Run `bunx prisma generate` after schema changes.
- **No Prisma migrations** have been created yet — only a seed script in `prisma/seed.ts`. This is a pre-release codebase.
- **No test files exist** yet. Jest is configured for `*.spec.ts` co-located with source (`rootDir: src`).
- **No e2e test directory** — `--config ./test/jest-e2e.json` is referenced but `test/` doesn't exist.
- **Socket.IO** shares the NestJS HTTP server (no separate port) via custom `SocketIoAdapter`. JWT auth via `WsAuthMiddleware`.
- **`prettier/prettier` is set to 0** in ESLint — format is NOT lint-enforced, run separately.
- **Import order** (enforced by Prettier plugin): NestJS → `~/` path aliases → `src/` → relative `./` → `../`. Sorted and separated by blank lines.

## Architecture

```
src/
├── main.ts                 # Bootstrap
├── app.module.ts           # Root module (APP_GUARD, global pipes)
├── app.resolver.ts         # Root public query
├── schema.gql              # Auto-generated, committed
├── config/env.config.ts    # Zod env schema
├── common/                 # Shared decorators, guards, interfaces
│   ├── decorators/         # @Trim, @ToLower, @Public(), ClientInfo, Cookies
│   └── interfaces/
├── generated/prisma/       # Prisma client (generated, gitignored)
├── prisma/
│   ├── prisma.module.ts    # @Global() — extends PrismaClient
│   └── prisma.service.ts
└── modules/
    ├── auth/               # AuthGuard, JwtAuthGuard, RefreshTokenGuard, resolver, service
    ├── channel/            # Channels, moderators, VIPs, bans, follows
    ├── redis/              # @Global() — ioredis wrapper
    ├── socket/             # @Global() — SocketIoAdapter, WsAuthMiddleware, gateway, service
    ├── stream/             # MediaMTX webhook controller, BullMQ consumer, DTOs
    ├── transcoder/         # FFmpeg HLS + poster extraction, MinIO upload
    └── user/               # @Global() — resolver, service, DTOs, entities
```

## GraphQL Conventions

- Code-first: `@ObjectType()` / `@Field()` for entities, `@InputType()` for inputs, `@Args()` for resolver params.
- DTOs use `class-validator` decorators + custom `@Trim`/`@ToLower` transforms.
- Resolvers inject services via constructor DI.
- `autoSchemaFile: 'src/schema.gql'` — committed, regenerated on server start.

## Testing

```bash
bun run test                # jest (watch: false)
bun run test:cov            # jest --coverage (output: ../coverage/)
```

- Co-located `*.spec.ts` files alongside source.
- No tests exist yet — write them when adding new code.
