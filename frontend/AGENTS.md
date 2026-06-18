# AGENTS.md

## Project Overview

Sift Live — a Twitch-like live streaming service. Frontend part of a monorepo (adjacent: `backend/` on NestJS, `media-server/` with MediaMTX).

## Tech Stack

| Category        | Technology                                    |
| --------------- | --------------------------------------------- |
| Framework       | React 19 + Compiler                           |
| Bundler         | Vite 8                                        |
| Language        | TypeScript ~6.0                               |
| Routing         | @tanstack/react-router                        |
| GraphQL         | urql                                          |
| HTTP client     | ky                                            |
| WebSockets      | socket.io-client                              |
| UI              | shadcn/ui (Base UI backend) + Tailwind CSS v4 |
| State           | Zustand                                       |
| Architecture    | Feature-Sliced Design (FSD)                   |
| Linter          | oxlint                                        |
| Formatter       | oxfmt                                         |
| Testing         | vitest                                        |
| Package manager | bun                                           |

## Setup Commands

```bash
bun install              # Install dependencies
bun run dev              # Start dev server (port 3000)
bun run build            # Type-check + production build
bun run preview          # Preview production build
```

### Lint & Format

```bash
bun run lint:check       # oxlint check
bun run lint:fix         # oxlint auto-fix
bun run format:check     # oxfmt check
bun run format:fix       # oxfmt auto-format
```

## Important Notes

- **Vite path alias**: `~` resolves to `./src` via `resolve.alias` in `vite.config.ts`. Vite 8 has `resolve.tsconfigPaths` but it reads only the root `tsconfig.json` — our project uses TypeScript project references (`tsconfig.app.json` for paths), so `resolve.tsconfigPaths` can't see the `~/*` mapping. Both `resolve.alias` (Vite) and `paths` (tsconfig.app.json) are maintained in sync.
- **GraphQL endpoint**: Backend NestJS `setGlobalPrefix('api')` does NOT affect GraphQL — endpoint is `http://localhost:5000/graphql`, not `/api/graphql`.

## Project Structure (FSD)

```
src/
├── app/                 # App initialization: providers, router, global styles
│   ├── providers/
│   │   ├── Providers.tsx
│   │   └── TanstackRouter.tsx
│   ├── main.tsx
│   └── index.css
├── pages/               # Route pages (tanstack-router file-based)
│   ├── __root.tsx
│   └── index.tsx
├── entities/            # Business entities (user, stream, etc.)
├── features/            # User interactions (follow, chat, etc.)
├── widgets/             # Complex compositions (StreamPlayer, ChatBox, etc.)
└── shared/              # Reusable utilities, UI kit, API layer, types
```

- Route generation is automatic: `src/app/routeTree.gen.ts`
- `shared/ui/` — shadcn/ui components (Base UI primitives)
- `shared/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `shared/lib/hooks/` — custom hooks
- Icon library: lucide-react

## Code Style

- **oxfmt**:
  - `semi: false`, `singleQuote: true`, `jsxSingleQuote: false`
  - `trailingComma: 'all'`, `printWidth: 100`, `tabWidth: 2`
  - `arrowParens: 'always'`, `bracketSpacing: true`
  - Auto-sort imports (`sortImports: true`)
  - Auto-sort TailwindCSS classes (`sortTailwindcss: true`)
- **oxlint**:
  - Plugins: react, typescript, import, jsx-a11y, oxc, vitest
  - Rules: correctness → error, suspicious → warn, perf → warn
  - Key React rules (jsx-key, no-danger, exhaustive-deps)
  - import/no-cycle, import/no-self-import enabled
  - All TypeScript strict rules
  - `src/app/routeTree.gen.ts` is ignored
- Naming: camelCase for variables/functions, PascalCase for components
- Arrow functions preferred over `function` declarations for all components and callbacks
- Export directly at declaration: `export const Foo = () => {}` instead of `function Foo() {}; export { Foo }`
- `verbatimModuleSyntax: true` — explicit `import type` for types
- `noUnusedLocals`, `noUnusedParameters` enabled

## React Compiler

Enabled via `babel-plugin-react-compiler` in `vite.config.ts`. Eliminates the need for manual `useMemo`/`useCallback`/`memo` in most cases.

## GraphQL (urql)

- urql for GraphQL queries
- ky for REST HTTP requests
- GraphQL Codegen (`@graphql-codegen/client-preset`) for type generation from schema
- urql client is set up in `src/app/providers/`

## State Management

- Zustand for client state (UI state, transient data)
- urql for server state (GraphQL cache)
- ky for direct REST API calls

## WebSockets

- socket.io-client for real-time features (chat, notifications, stream status)

## Testing (vitest)

```bash
bun run test             # Run all tests
bun run vitest           # Watch mode
bun run vitest run       # Single run
```

- Test files co-located with the module: `*.test.ts`, `*.test.tsx`
- Prefer `describe`/`it` blocks

## Pull Request Guidelines

- Title: `[<layer>/<slice>] Brief description`
- Before PR: `bun run lint:check && bun run format:check`
- All tests must pass

## Dark Mode

- Class-based dark mode via `.dark` class on `<html>`
- `ThemeProvider` in `src/app/providers/ThemeProvider.tsx` with `light` | `dark` | `system` modes
- Preference persisted in `localStorage` under `ui-theme` key
- Uses `useTheme()` hook from `ThemeProvider`

## Available Skills

Installed and available for the agent:

- `feature-sliced-design` — FSD v2.1 methodology
- `apollo-client` — Apollo Client 4.x reference (for reference; we use urql)
- `graphql-operations` — GraphQL operations best practices
- `oxlint` — oxlint configuration
- `vite` — Vite build tool
- `frontend-design` — visual design guidance
- `seo` — SEO optimization
- `accessibility` — a11y audit
- `shadcn` — shadcn/ui components, theming, Base UI vs Radix
- `vercel-composition-patterns` — React composition patterns
- `vercel-react-best-practices` — React performance patterns
