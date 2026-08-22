# Developer handoff

This handoff records the repository state on 2026-08-21. It uses the current
working tree and recent session evidence. No install, build, migration, or dev
server command was run for this handoff.

## Preserve the current work

The working tree is already dirty. `git status --short` shows deleted legacy
lesson files under `arch/content/lesson-plans/`, modified application, schema,
and migration files, and new curriculum, sync, managed-content, and test files.
Preserve these changes. Do not reset, clean, or replace them while debugging.

The authored lesson files now live under
`content/curriculum/foundational-phonics/`. The old files are still shown as
deleted, so review the move before treating it as complete:

- [content/curriculum/foundational-phonics/](../content/curriculum/foundational-phonics/)
- [arch/content/lesson-plans/](../arch/content/lesson-plans/)
- Inspect this state with `git status --short` before each change.

## Current SSR invariant

The protected SSR prefetches in the root layout and stats page are now gated.
The root layout requires a session for `getAllProfiles` and an active profile
for awards and focused words. The stats page requires an active profile for
user stats. No signed-out SSR defect remains in these paths.

- [src/app/layout.tsx:35-43](../src/app/layout.tsx#L35-L43)
- [src/app/stats/page.tsx:7-13](../src/app/stats/page.tsx#L7-L13)
- [src/server/api/trpc.ts:110-131](../src/server/api/trpc.ts#L110-L131)

Future protected prefetches must use the same session and active-profile gates.
Adding a call outside its gate can reintroduce signed-out errors; the SSR
helper currently catches those errors, logs them, and returns an empty result.

- [src/hooks/useQuerySsrServer.ts:66-87](../src/hooks/useQuerySsrServer.ts#L66-L87)

Add signed-out and no-active-profile regression checks when adding new
protected prefetches.

## Confirmed defects

### Profile updates do not check profile ownership

`updateProfile` is protected, but it accepts any `profileId` and updates that
row without checking that the row belongs to `ctx.session.user.id`. Any
authenticated user who can submit another profile ID can reach this update.

- [src/server/api/routers/userRouter.ts:59-97](../src/server/api/routers/userRouter.ts#L59-L97)
- [prisma/schema.prisma:74-95](../prisma/schema.prisma#L74-L95)

Scope the update query to the session owner, then test both an owned and an
unowned profile.

### Account creation logs plaintext passwords

`createUser` writes the input object, including `password`, to the server log.
Remove the password from the log before testing registration or reviewing
production logs.

- [src/server/api/routers/auth.ts:16-40](../src/server/api/routers/auth.ts#L16-L40)

### Active-profile assumptions are not enforced at the auth boundary

The session type says `activeProfile` is a `Profile`, but the JWT callback casts
the token value without checking it. `getActiveProfile` then reads
`activeProfile.id`. The client avoids the query when no ID exists, but direct
callers can still reach this null-sensitive code.

- [src/server/auth.ts:16-55](../src/server/auth.ts#L16-L55)
- [src/server/api/routers/userRouter.ts:6-17](../src/server/api/routers/userRouter.ts#L6-L17)
- [src/hooks/useActiveProfile.ts:20-24](../src/hooks/useActiveProfile.ts#L20-L24)

Make the session field nullable in its type and guard the procedure, or make
the active-profile invariant explicit during sign-in and profile selection.

## Operational hazards

### Keep dependency relinking separate from a live Next server

Recent development evidence shows that dependency relinking can invalidate a
live Next dev server. Do not run install or dependency relinking beside
`pnpm dev`. Stop the server, relink dependencies, then start a fresh dev
server. `postinstall` also runs `prisma generate`, so relinking can change both
the module tree and the generated Prisma client.

- [package.json:5-14](../package.json#L5-L14)
- [package.json:81-85](../package.json#L81-L85)

### Treat generated `.next` failures as secondary

`.next` is ignored and is not tracked. Errors in generated `.next` files after
dependency relinking are secondary evidence. First restore a stable dependency
tree and restart Next. Then inspect the tracked source and package files.

- [.gitignore:15-18](../.gitignore#L15-L18)
- [package.json:6,10](../package.json#L6-L10)

### Standardize the package and database commands

The repository tracks both `package-lock.json` and `pnpm-lock.yaml`, while the
scripts and new curriculum commands use pnpm. The README still instructs
`npx prisma migrate dev`. Choose pnpm as the single workflow and update the
README before the next database change. Do not run a migration against this
dirty tree until the migration history is reviewed.

- [README.md:5-11](../README.md#L5-L11)
- [package.json:5-14](../package.json#L5-L14)
- [package-lock.json](../package-lock.json)
- [pnpm-lock.yaml](../pnpm-lock.yaml)

### Review migration history before applying it

Many historical migration files and `prisma/schema.prisma` are modified. The
migration lock changed from PostgreSQL to SQLite, and the current schema uses
SQLite. This is a high-risk history change, not a routine generated diff.
Review the target database, migration lineage, and data preservation before
running `prisma migrate`, `prisma db push`, or any sync with `--apply`.

- [prisma/migrations/migration_lock.toml](../prisma/migrations/migration_lock.toml)
- [prisma/migrations/20230825200801_initial_migration/migration.sql](../prisma/migrations/20230825200801_initial_migration/migration.sql)
- [prisma/migrations/20230907113134_remove_question_table/migration.sql](../prisma/migrations/20230907113134_remove_question_table/migration.sql)
- [prisma/migrations/20260820170000_add_curriculum_projection/migration.sql](../prisma/migrations/20260820170000_add_curriculum_projection/migration.sql)
- [prisma/schema.prisma:8-11](../prisma/schema.prisma#L8-L11)

## Warnings and debt

### AWS SDK v2 is maintenance debt

The award router imports `aws-sdk` v2. The lockfile records its deprecation
warning and recommends AWS SDK v3. This is unrelated to the repaired SSR
prefetch gates, but it should be planned as a focused S3 migration with upload
and image-read verification.

- [src/server/api/routers/awardRouter.ts:1-14](../src/server/api/routers/awardRouter.ts#L1-L14)
- [package.json:40](../package.json#L40)
- [pnpm-lock.yaml:1802-1806](../pnpm-lock.yaml#L1802-L1806)

### Curriculum source and database projection need one declared workflow

The loader reads Markdown from `content/curriculum/foundational-phonics/`.
`pnpm curriculum:validate` validates the corpus. `pnpm curriculum:sync`
defaults to a dry run; `--apply` writes the projection, and
`--adopt-legacy` enables a separate legacy-adoption path. The migration keeps
legacy rows unchanged, and managed-content guards direct developers back to the
Git source.

Use this sequence for each curriculum change:

1. Edit the Markdown source in Git.
2. Run `pnpm curriculum:validate`.
3. Review `pnpm curriculum:sync --dry-run` output.
4. Apply only after database and migration review with
   `pnpm curriculum:sync --apply`.
5. Verify the managed plan and mutation guards in the app.

- [src/content/curriculum/loader.ts:9-29](../src/content/curriculum/loader.ts#L9-L29)
- [package.json:7-8](../package.json#L7-L8)
- [scripts/curriculum-sync.ts:5-29](../scripts/curriculum-sync.ts#L5-L29)
- [src/content/curriculum/sync.ts:636-654](../src/content/curriculum/sync.ts#L636-L654)
- [prisma/migrations/20260820170000_add_curriculum_projection/migration.sql:1-7](../prisma/migrations/20260820170000_add_curriculum_projection/migration.sql#L1-L7)
- [src/server/content/managedContentGuards.ts:13-35](../src/server/content/managedContentGuards.ts#L13-L35)

## Recommended next steps

1. Preserve this dirty tree and record the intended migration and content
   move. Do not clean generated or source files as a first response.
2. Preserve the SSR session and active-profile gates. Add regression checks for
   signed-out and no-active-profile prefetches.
3. Remove password logging and scope profile updates to the session owner.
4. Decide the SQLite migration baseline and use one package manager and lockfile.
5. Validate the authored corpus, review a dry-run sync report, and document the
   approved source-to-DB apply step.
6. After those fixes, run the smallest relevant tests first, then a clean dev
   server check. Keep dependency relinking, builds, and dev-server sessions
   separate.
7. Plan the AWS SDK v3 migration after current behavior has coverage.

## Checks not run

This handoff did not run installs, dependency relinking, builds, migrations,
`pnpm curriculum:sync`, or dev servers. It did not alter the existing dirty
files. The next developer should report test and browser results separately
from generated `.next` output.
