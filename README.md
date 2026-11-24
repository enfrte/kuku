# kuku

kuku is a local-first language-learning app. Students practise sentences by building
them from word tiles, while an unprotected admin area lets you create and edit courses,
lessons, and questions.

Authoring data and progress are stored in the browser's IndexedDB. Deployed course
content is bundled with the app from the repository. There is no backend and no
account system in this version.

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
| `/admin/data` | Publish content, export/import backups, reset, and reload the demo |

Draft courses and lessons can be previewed by appending `?preview=1` to their student
URL. The admin area has no login; treat it as a local authoring tool.

## Data and backups

Authoring data lives in this browser profile. Clearing site data, using another browser,
or switching devices gives you a different database. Export a JSON backup from
**Admin → Publish & backup** before making large changes.

The import operation **replaces everything** currently stored in the browser. Backup
files are validated before any data is changed. The same page can reset the database or
add another copy of the demo course. Backups include courses, lessons, questions,
progress, and metadata, so they can restore the whole browser database.

## Publishing content

The deployed app ships with a content file at
`src/db/seed/deployedContent.json`. It contains only courses, lessons, and questions,
plus a `contentVersion` used to offer updates to existing users.

To publish edits made in the admin area:

1. Open **Admin → Publish & backup**.
2. Download the deploy file.
3. Save it over `src/db/seed/deployedContent.json` in the repository.
4. Commit the file and deploy.

Publishing is deliberately manual: the admin area cannot write to the repository from
a deployed Vercel site. The publish card shows whether the browser has unpublished
changes and which content version this build contains.

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

Students keep their progress in their own browser, but course content is shared
through the repository. When a deployed `contentVersion` is newer than the version a
browser already has, the app offers to update the local courses. Progress is kept for
lessons that still exist, and a full backup can be downloaded before updating.

New browsers import the deployed content automatically. If both local and deployed
content are empty, the bundled Swedish demo course is seeded as a starting point.

## Future: server sync

IDs are currently auto-incrementing local keys (`++id`). If server synchronisation is
added later, only the repository layer should need to change: hooks and components
already read through live queries and write through repository functions.

## License

MIT — see [LICENSE](LICENSE).
