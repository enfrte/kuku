## Goal

Port this app to typescript, ReactJS, with IndexedDB + Dexie.js to run on vercel free tier. You can drop all the existing languages like, SQLite, frameworks, and service technologies. You can delete all files no longer needed. 

See @README.md to learn more about the existing app. 

### You have a lot of flexibility

You can completely redesign the admin part of the app which allows you to create and modify the course content. 

You can omit the classes around scraping google translate for audio files for the time being. 

Language codes need to be converted to ISO 639-3. 

Try to use the following prompt for structuring the code...

You are a senior TypeScript/React engineer. Build a CRUD web app that stores all data locally in IndexedDB using Dexie.js. Follow the architecture below strictly.

## App requirements
- Entity: [e.g. Todo / Note / Contact] with fields: [list fields and types]
- Features: list, create, edit, delete, [filter/sort/search options]
- Stack: React 19+, TypeScript (strict mode), Vite, Dexie 4, dexie-react-hooks
- Styling: [plain CSS / Bootstrap 5 / Tailwind]
- No backend, no Redux/Zustand/React Query for DB-backed data

## Architecture: repository layer + live-query hooks + presentational components

Folder structure:
src/
  db/db.ts            // Dexie instance, schema, entity types
  db/<entity>Repo.ts  // all CRUD functions for one entity
  hooks/use<Entity>.ts // live reads + exposes repo actions
  components/         // presentational UI only

### Rules
1. **Database (db.ts):** Define typed entity interfaces and a Dexie instance typed with `EntityTable<Entity, 'id'>`. Use `++id` auto-increment primary keys. Index ONLY fields used in queries or sorting.
2. **Boolean gotcha:** Booleans are not valid IndexedDB keys. Do not index a boolean field and query it with `equals(true)`. Either store it as `0 | 1`, or filter in JS with `.filter()`.
3. **Repository:** Every write (add, update, remove, and anything custom like toggle) lives in the repo. Components and hooks never call `db` directly for writes. Use `db.transaction('rw', ...)` for any read-then-write or multi-table operation. Put validation and defaults (id, createdAt, etc.) here.
4. **Hooks:** Use `useLiveQuery` from `dexie-react-hooks` for all reads, with dependency arrays for filter params. Treat `undefined` as the loading state and expose `isLoading`. Return the data plus repo actions. Do NOT use `setState` or manual refetching after writes; live queries handle re-rendering.
5. **Components:** Presentational and typed. Keep form state local (`useState`, or react-hook-form + zod). Call repo actions only on submit. Handle loading and empty states.
6. **Migrations:** Use `db.version(n).stores({...})` and add `.upgrade()` when transforming existing data. Never edit a shipped version in place.
7. **Multiple entities:** One repo and one hook per entity. Put cross-entity logic in the repo inside a shared transaction.
8. **Global state:** Only for UI-only state (modals, theme). Never duplicate DB data in a store.
9. **Testing:** Add Vitest tests for the repo layer using `fake-indexeddb`.

## Deliverables
1. Full file contents for every file, with paths as headings
2. `npm install` command and any config needed
3. A short note explaining where I would plug in server sync later (it should only require changes in the repo layer)

Before writing code, list any assumptions you're making. Keep code idiomatic, minimal, and free of unnecessary abstractions.
