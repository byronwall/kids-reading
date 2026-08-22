# ChatGPT Pro Brief: Expand the Git-Managed Reading Curriculum

Paste this brief into ChatGPT Pro from the checked-out `kids-reading` repository.

## Objective

Extend the authored reading curriculum by one validated content chunk. Keep the
curriculum useful for a child who has completed the current foundational
phonics sequence. Work from the repository files. Do not invent a new storage
format or write content only in chat.

## Inspect before editing

Read these files before you add content:

- All files under `content/curriculum/foundational-phonics/`.
- `src/content/curriculum/schema.ts`.
- `src/content/curriculum/parser.ts`.
- `src/content/curriculum/validate.ts`.
- `src/content/curriculum/corpus.test.ts`.
- `scripts/curriculum-sync.ts`.
- `arch/prompts/lesson-plan-content-generation.md`.
- `docs/development-handoff.md`.

Inspect the full current corpus for existing words, sentences, IDs, patterns,
and sight words. Check `git status --short` first. Preserve all existing user
changes. Do not reset, clean, checkout, replace, or reformat unrelated files.

## Source of truth

Markdown under `content/curriculum/foundational-phonics/` is the source of
truth. The database is only a projection of that source. Add authored content
to Git first. Never create content only in the database or edit managed rows by
hand. The sync script uses canonical IDs from the Markdown source.

The repository is already dirty. Do not treat the dirty state as a reason to
discard files. Do not change application code, Prisma schema, migrations, or
managed-content behavior for this content task. If the aggregate corpus test
needs new expected totals, update only those totals in
`src/content/curriculum/corpus.test.ts` and report the change.

## Recommended expansion: chunk 11

Add exactly one new chunk:

- File: `content/curriculum/foundational-phonics/phonics-11-inflectional-endings.md`.
- `chunk_id`: `phonics-11`.
- `chunk_order`: `11`.
- `plan_id`: `foundational-phonics`.
- Plan title, description, and age range must match the existing chunks.
- Use difficulty `5` unless inspection shows a better value.
- Title: a clear title such as `Inflectional Endings`.
- Include three lessons, in this order, with IDs `lesson-11-01`,
  `lesson-11-02`, and `lesson-11-03`.

Teach a small, coherent progression:

1. Regular plural and third-person forms with `-s` and `-es`.
2. Present-participle forms with `-ing`.
3. Regular past forms with `-ed`, followed by mixed inflection review.

Use regular, transparent examples. Prefer words whose base words and spelling
patterns are already supported by chunks 1 through 10. Do not turn the chunk
into a grammar lesson. The learner should read the whole word, notice the
ending, and reread the sentence smoothly. Avoid irregular `-ed` pronunciations,
uncontrolled spelling patterns, and vocabulary that needs background knowledge.

Optional later directions are not part of this task. Consider them only after
chunk 11 is validated:

- Soft `c` and `g`, silent-letter patterns, and other common consonant patterns.
- Common prefixes and suffixes such as `un-`, `re-`, `-ful`, and `-less`.
- More connected-text review using the existing sentence-only schema.

Do not add these optional chunks now. Do not add a second plan.

## Exact file format

Every chunk must use this order and these exact headings. The parser accepts
simple YAML only. Use one key per line, `[]` for an empty list, and list items
with two spaces before `-`. Use the existing quoted-list style when quoting a
string. Do not add YAML comments or nested objects.

````markdown
---
schema_version: 1
chunk_id: phonics-11
chunk_order: 11
plan_id: foundational-phonics
plan_title: Foundational Phonics
plan_description: A progressive first-reading curriculum.
age_range: "5-8"
difficulty: 5
---

# Chunk Title

## Chunk Goals

- Goal one.
- Goal two.
- Goal three.

## Lessons

### Lesson: lesson-11-01

```yaml
lesson_id: lesson-11-01
lesson_order: 1
title: Lesson title
focus: inflectional_s_es
difficulty: 5
prerequisites:
  - "lesson-10-03"
target_patterns:
  - "-s"
  - "-es"
review_lesson_ids:
  - "lesson-10-03"
```

#### Target Words

```text
cats
```

#### Review Words

```text
cat
```

#### Practice Sentences

```text
lesson-11-01-sentence-01 | The sentence uses listed words.
```

#### Teacher Note

State what the learner should notice and what the adult should listen for.

#### Validation

```yaml
expected_target_word_count: 20
expected_sentence_count: 10
allowed_sight_words:
  - "a"
  - "the"
```

### Lesson: lesson-11-02

```yaml
lesson_id: lesson-11-02
lesson_order: 2
title: Lesson title
focus: inflectional_ing
difficulty: 5
prerequisites:
  - "lesson-11-01"
target_patterns:
  - "-ing"
review_lesson_ids:
  - "lesson-11-01"
```

...repeat every required lesson section...

## File Summary

```yaml
chunk_id: phonics-11
lesson_count: 3
word_count: exact sum of target words in all three lessons
sentence_count: exact sum of sentences in all three lessons
```
````

The example is a shape guide. Replace every placeholder. Every lesson must
contain all sections. The final file must contain no text after `File Summary`.

## IDs and validation rules

Preserve all existing IDs. Never rename or renumber an existing chunk, lesson,
or sentence. New IDs must be deterministic, lowercase, hyphenated, and unique
across the complete corpus:

- Chunk IDs match the lowercase kebab form and continue with `phonics-11`.
- Lesson IDs match `lesson-\d{2}-\d{2}`.
- Sentence IDs match `lesson-\d{2}-\d{2}-sentence-\d{2}`.
- Sentence numbers start at `01` and increase without gaps within each lesson.
- Lesson order starts at `1` and increases without gaps within the chunk.
- Chunk order must remain continuous from `1` through `11`.
- Prerequisites and review lesson IDs must point to earlier lessons.

Follow the current Zod schema and validator, not general YAML assumptions:

- Target and review words are one per line. Words use lowercase letters or an
  apostrophe; the special sight-word form `I` is allowed. Do not use hyphens,
  digits, slashes, or punctuation in word lists.
- Each lesson has 20 to 40 unique target words and 5 to 10 unique review words.
  A word cannot appear in both lists. Review words must occur in an earlier
  lesson or in that lesson's `allowed_sight_words` list.
- Each lesson has 10 to 20 practice sentences. The validation counts must equal
  the actual list lengths.
- Sentence text starts with a capital letter and ends with `.`, `!`, or `?`.
  Use letters, spaces, apostrophes, commas, and simple end punctuation only.
- Every token in a sentence must be a target word, review word, word from an
  earlier lesson, or an allowed sight word. The validator compares normalized
  sentence tokens against those lists.
- Sentence text must be unique across the entire corpus, ignoring case.
- The file summary `word_count` counts target words only. Its sentence count
  counts all practice sentences. Its lesson count must be `3`.
- Keep teacher notes non-empty. Keep lessons progressive and decodable.

Use the current corpus as the style reference. Existing chunks use short
sentences, original examples, 20 to 30 target words in most lessons, 10 to 16
sentences, 5 to 10 review words, and a short note that tells an adult what to
notice. Do not copy a sentence from a book, website, or curriculum product.
Do not add facts that require background knowledge. Do not use dialogue or
quotation marks.

After writing chunk 11, update the aggregate counts in
`src/content/curriculum/corpus.test.ts` if needed. Compute the totals from the
actual loaded corpus. Do not weaken or remove duplicate and parser tests.

## Safe workflow

1. Inspect all existing content and the parser and validator before editing.
2. Create the Markdown source in Git. Keep the source file as the durable
   artifact.
3. Check IDs, words, sentence text, section order, and summary counts.
4. Run `pnpm curriculum:validate`.
5. Review `git diff --check` for each changed file.
6. Run `pnpm curriculum:sync --dry-run` and save its report. Dry-run must come
   before any apply operation.
7. Apply only after explicit human approval, database review, and migration
   review, using `pnpm curriculum:sync --apply`. Never skip the dry-run.
8. Report every changed file and leave unrelated dirty files unchanged.

Do not commit or push changes unless the user gives explicit approval. The
current branch is `main`, and the working tree already contains unrelated work.

Do not run `pnpm install`, builds, migrations, `pnpm dev`, or database apply in
this task unless the user gives separate approval. Do not run dependency
changes beside a live dev server. If dependencies or a database prevent a
read-only validation or dry run, report the exact command and blocker. Do not
install packages to work around it.

## Response format

Return a short report with these headings:

1. `Implemented`: list the new chunk path, lesson IDs, and any aggregate-test
   count change.
2. `Validation`: give the exact commands run and their result. Include the dry-
   run summary, or state why the dry run could not run.
3. `Safety`: list unrelated files preserved and confirm that no install, build,
   migration, dev server, or apply command ran without approval.
4. `Open decisions`: state whether an apply is waiting for approval. Mention
   any content or validation risk that needs review.

Do not claim database completion when only the Git source is complete.
