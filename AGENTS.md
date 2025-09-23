# Repository Guidelines

## Project Structure & Module Organization
- Turborepo workspace tracked in `pnpm-workspace.yaml`; active packages live under `apps/*`.
- `apps/frontend` hosts the Vite + React UI with feature folders like `src/components`, `src/lib`, and `src/types` (imports resolve via the `@/` alias).
- `apps/backend-hono` serves the SSE API; `src/index.ts` wires the server on `http://localhost:4000` and delegates stream logic to `src/stocks.ts`.
- Keep shared UI primitives under `src/components/ui` and colocate feature-specific assets beside their consumers.

## Build, Test, and Development Commands
- `pnpm install` installs workspace dependencies.
- `pnpm dev` runs both apps through Turbo pipelines; narrow scope with `pnpm dev --filter frontend` or `--filter backend-hono`.
- `pnpm build` triggers TypeScript builds and bundle steps for every workspace.
- `pnpm lint`, `pnpm type-check`, and `pnpm format` enforce ESLint, strict TS, and Prettier defaults (2-space indent, double quotes).
- Use `pnpm --filter backend-hono start` after `pnpm build` to serve the compiled API when you need a production-like check.

## Coding Style & Naming Conventions
- TypeScript strict mode is enabled everywhere; prefer explicit types on public APIs and reuse shared `Stock` types from `apps/frontend/src/types`.
- React components, contexts, and Hono route modules follow `PascalCase`; helper functions and hooks use `camelCase`/`useCamelCase`.
- Tailwind utility classes compose view styling; avoid ad-hoc CSS files and keep tokens in `src/index.css`.
- Run `pnpm format` before committing instead of hand-tuning spacing or quotes.

## Testing Guidelines
- Automated tests are not yet wired up; when adding features, include lightweight checks (e.g., adopt Vitest for React components or exercise SSE endpoints with scriptable clients) and document commands in the PR.
- Always verify `pnpm dev` delivers live updates from `/api/stocks/stream`; record manual verification steps until coverage is in place.

## Commit & Pull Request Guidelines
- Follow the conventional commit style already in history (`feat:`, `fix:`, `refactor:`, `chore:`) and scope by package when it improves clarity (`feat(frontend): connect SSE`).
- PRs should link related issues, summarise behaviour changes, list test evidence, and attach UI captures for visual tweaks.
- Keep PRs focused and update README or this guide when workflows or commands change.
