# kuku

kuku is a local-first language-learning app. Students practise sentences by building
them from word tiles, while an unprotected admin area lets you create and edit courses,
lessons, and questions.

Everything is stored in the browser's IndexedDB. There is no backend and no account
system in this version.

## Stack

- React 19 + TypeScript (strict)
- Vite 8
- Dexie 4 / IndexedDB, with `dexie-react-hooks` live queries
- Bootstrap 5 and self-hosted Varela Round
- Vitest + `fake-indexeddb` for repository tests
- `vite-plugin-pwa` for offline support and installability

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally <http://localhost:5173>).

The bundled **100 Swedish Lessons** demo course is seeded automatically the first time
the app opens. Ten lessons and 176 sentences are available to practise immediately.

### Useful commands

```bash
npm run dev        # start the development server
npm run typecheck  # run TypeScript without emitting files
npm test           # run repository and quiz-engine tests once
npm run test:watch # run tests in watch mode
npm run build      # type-check and produce a production build in dist/
npm run preview    # serve the production build locally
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Published course catalogue |
| `/courses/:courseId` | Lessons in a course |
| `/lessons/:lessonId` | Word-tile quiz |
| `/admin` | Course management |
| `/admin/courses/new` | Create a course |
| `/admin/courses/:courseId/edit` | Edit a course |
| `/admin/courses/:courseId/lessons` | Manage a course's lessons |
| `/admin/lessons/:lessonId/questions` | Manage a lesson's questions |
| `/admin/data` | Export, import, reset, and reload the demo |

Draft courses and lessons can be previewed by appending `?preview=1` to their student
URL. The admin area has no login; treat it as a local authoring tool.

## Data and backups

All data lives in this browser profile. Clearing site data, using another browser, or
switching devices gives you a different database. Export a JSON backup from
**Admin → Data & backup** before making large changes.

The import operation **replaces everything** currently stored in the browser. Backup
files are validated before any data is changed. The same page can reset the database or
add another copy of the demo course.

### Audio

Word audio is served from `public/audio/swe/mp3/` using the normalised word and the
ISO 639-3 language code, for example `hej_swe.mp3`. Missing files are ignored; the quiz
still works without audio. Only Swedish audio is currently included.

### Language codes

Course and instruction languages are stored as ISO 639-3 codes (`swe`, `eng`, `fin`,
and so on). The picker is generated from the ISO 639-1 subset. Regenerate it with:

```bash
npm run gen:languages
```

## Project layout

```
src/db/          Dexie schema, validation, repositories, seed data
src/hooks/       Live-query hooks and write actions
src/components/  Presentational course, lesson, question, and quiz components
src/pages/       Student and admin route components
src/quiz/        Pure quiz logic and audio lookup
src/data/        Generated ISO 639-3 language list
public/          Static assets, flags, audio, PWA icons
```

All writes go through `*Repo.ts` files. Components and hooks do not write to Dexie
directly. Validation and defaults live in the repository layer, which keeps a future
server-backed data source isolated to those files.

## PWA and offline use

`npm run build` generates a service worker and manifest. The app shell is precached,
and audio requests are cached after first use. Install the site from a supported
browser for a standalone experience.

## Deployment

The app is a static SPA and can be deployed to the Vercel free tier.

1. Push the repository to a Git provider.
2. Create a Vercel project and use the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
3. `vercel.json` rewrites unknown paths to `index.html` so deep links such as
   `/admin` work.

Because data is local to each browser, deploying does not share course content with
other users. To share content, export a backup and import it in the target browser.

## Future: server sync

IDs are currently auto-incrementing local keys (`++id`). If server synchronisation is
added later, only the repository layer should need to change: hooks and components
already read through live queries and write through repository functions.

## License

MIT — see [LICENSE](LICENSE).
