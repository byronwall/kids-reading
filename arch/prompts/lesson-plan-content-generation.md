# Lesson Plan Content Generation Prompt

Copy this prompt into ChatGPT Pro to generate the initial reading curriculum.

## Repository Instructions

Work directly in the checked-out `kids-reading` repository. Do not only return
the content in chat.

- Inspect the repository instructions before editing.
- Preserve existing user changes.
- Create the generated files under `arch/content/lesson-plans/`.
- Use one file per content chunk.
- Keep the existing planning notes under `arch/plans/` unchanged.
- Do not modify application code during content generation.
- Do not commit secrets, `.env` files, databases, build output, or dependency directories.
- Do not push to GitHub.
- If the repository is not available, stop and report the blocker.

```text
You are creating the initial content corpus for a children's phonics reading app.

Generate exactly 10 lesson-plan content files. Each file must be Markdown with YAML front matter and structured Markdown sections. The files must be parseable and validated by a script later.

Do not include explanations outside the files.

## Content scope

Create a progressive early-reading curriculum:

1. Short vowels and CVC words
2. CVC words with common consonants
3. Digraphs: sh, ch, th, wh
4. Consonant blends
5. Magic-e words
6. Long-vowel teams
7. R-controlled vowels
8. Diphthongs and variant vowels
9. Two-syllable words
10. Review and transition to simple connected text

Each chunk should contain 3 to 5 lessons. Each lesson should contain:

- A stable lesson ID
- A title
- A phonics focus
- Prerequisites
- Target graphemes or spelling patterns
- 20 to 40 target words
- 10 to 20 original practice sentences
- 5 to 10 review words from earlier lessons
- A short teacher note
- A difficulty level from 1 to 5

Use original sentences. Do not copy sentences from books, curriculum products, or websites.

## Required output format

Return exactly 10 files. Use this format for every file:

```markdown
---
schema_version: 1
chunk_id: phonics-01
chunk_order: 1
plan_id: foundational-phonics
plan_title: Foundational Phonics
plan_description: A progressive first-reading curriculum.
age_range: 5-8
difficulty: 1
---

# Chunk Title

## Chunk Goals

- Goal one
- Goal two
- Goal three

## Lessons

### Lesson: lesson-01-01

```yaml
lesson_id: lesson-01-01
lesson_order: 1
title: Short A CVC Words
focus: short_a
difficulty: 1
prerequisites: []
target_patterns:
  - "a"
  - "CVC"
review_lesson_ids: []
```

#### Target Words

```text
cat
map
sat
```

Rules for target words:

- One lowercase word per line.
- Use only words appropriate for the lesson focus.
- Do not repeat a word within the same lesson.
- Do not include punctuation.
- Avoid proper names.
- Avoid irregular words unless listed under review words.

#### Review Words

```text
the
is
a
```

#### Practice Sentences

```text
The cat sat.
A cat can nap.
```

Rules for practice sentences:

- One original sentence per line.
- Use simple punctuation.
- Keep sentences appropriate for the difficulty level.
- Prefer words from the current lesson and prior lessons.
- Include only a small number of explicitly listed sight words.
- Do not use dialogue or quotation marks.
- Do not use facts that require background knowledge.

#### Teacher Note

Explain what the learner should notice and what the adult should listen for.

#### Validation

```yaml
expected_target_word_count: 25
expected_sentence_count: 12
allowed_sight_words:
  - a
  - the
  - is
  - can
  - I
```

## Global requirements

- Use stable IDs. Never change an ID after creating it.
- Use lowercase IDs with hyphens.
- Use unique lesson IDs across all 10 files.
- Use unique chunk IDs.
- Keep lesson order continuous within each chunk.
- Keep chunk order from 1 through 10.
- Do not create empty lessons.
- Do not use duplicate words within a lesson.
- Do not use duplicate sentences anywhere.
- Put words that do not match the lesson focus in `review_words` or `allowed_sight_words`.
- Ensure every sentence can be tokenized into words and punctuation.
- Ensure every lesson has at least 10 sentences.
- Ensure every lesson has at least 20 target words.
- Ensure the lesson difficulty increases gradually.
- Include enough repetition for mastery without making every sentence identical.
- Use American English spelling.
- Do not include Markdown tables.
- Do not include HTML.
- Do not include comments inside YAML.
- Do not include content outside the 10 Markdown files.

At the end of each file, include this checksum section:

## File Summary

```yaml
chunk_id: phonics-01
lesson_count: 4
word_count: 100
sentence_count: 48
```

Before returning the files, validate:

1. Every required field exists.
2. Every ID is unique.
3. Every chunk has the correct order.
4. Every lesson has the required sections.
5. Every lesson has enough words and sentences.
6. No sentence is duplicated.
7. No target word is duplicated inside a lesson.
8. The curriculum progresses from simple to complex.

## Write and Commit Workflow

Create and validate the files incrementally. After each valid chunk is written:

1. Check the file against the schema and all validation rules.
2. Inspect the file for duplicate IDs, duplicate words, duplicate sentences, and malformed YAML.
3. Run the repository's content validation command if one exists.
4. Review `git diff --check` for the file.
5. Commit that chunk immediately.

Use commit messages in this format:

```text
content: add phonics lesson chunk 01
```

Use the actual chunk number in each commit message. Create one commit per
chunk, or one commit per small validated batch if the repository workflow makes
that safer. Do not amend commits. Do not reset or discard unrelated changes.

After all chunks are committed:

- Confirm that all 10 files exist under `arch/content/lesson-plans/`.
- Confirm that the working tree contains no generated content that was left uncommitted.
- Report the commit hashes, files created, and validation results.
- Do not push the commits.
```

## Import Notes

The generated files should later map to these application records:

- `plan_id` maps to a `LearningPlan`.
- Each lesson maps to a `Lesson`.
- Target and review words map to `Word` records.
- Practice sentences map to `Sentence` records.
- Lesson-to-word and lesson-to-sentence relationships must be preserved.

The importer should reject malformed YAML, duplicate IDs, duplicate sentences,
missing required sections, and lessons below the minimum content counts.
