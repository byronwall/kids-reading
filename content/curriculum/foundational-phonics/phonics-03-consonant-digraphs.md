---
schema_version: 1
chunk_id: phonics-03
chunk_order: 3
plan_id: foundational-phonics
plan_title: Foundational Phonics
plan_description: A progressive first-reading curriculum.
age_range: "5-8"
difficulty: 2
---

# Consonant Digraphs

## Chunk Goals

- Treat two consonant letters as one sound.
- Read sh, ch, th, and wh in common positions.
- Blend digraph words in short controlled sentences.

## Lessons

### Lesson: lesson-03-01

```yaml
lesson_id: lesson-03-01
lesson_order: 1
title: "Words with SH"
focus: digraph_sh
difficulty: 2
prerequisites:
  - "lesson-02-03"
target_patterns:
  - "sh"
review_lesson_ids:
  - "lesson-01-01"
  - "lesson-01-03"
  - "lesson-01-02"
```

#### Target Words

```text
bash
bush
cash
dash
dish
fish
gush
hush
mash
mesh
push
rash
rush
shed
shell
ship
shop
shut
wash
wish
```

#### Review Words

```text
cat
dog
sun
kid
leg
```

#### Practice Sentences

```text
lesson-03-01-sentence-01 | The ship is in the sun.
lesson-03-01-sentence-02 | I can wash the dish.
lesson-03-01-sentence-03 | The fish can rush.
lesson-03-01-sentence-04 | The shell is in the shop.
lesson-03-01-sentence-05 | The dog can push the mesh.
lesson-03-01-sentence-06 | The rash is on the leg.
lesson-03-01-sentence-07 | The bush is by the shed.
lesson-03-01-sentence-08 | The dish has mash.
lesson-03-01-sentence-09 | I can hush the dog.
lesson-03-01-sentence-10 | The cat can dash.
```

#### Teacher Note

Have the learner notice that s and h work together to represent one sound. Ask for a slow blend followed by a smooth reread. Listen for one continuous sh sound rather than separate s and h sounds.

#### Validation

```yaml
expected_target_word_count: 20
expected_sentence_count: 10
allowed_sight_words:
  - "the"
  - "is"
  - "can"
  - "I"
  - "in"
  - "on"
  - "has"
  - "by"
```

### Lesson: lesson-03-02

```yaml
lesson_id: lesson-03-02
lesson_order: 2
title: "Words with CH"
focus: digraph_ch
difficulty: 2
prerequisites:
  - "lesson-03-01"
target_patterns:
  - "ch"
review_lesson_ids:
  - "lesson-03-01"
  - "lesson-01-03"
```

#### Target Words

```text
batch
bench
chain
chair
chat
check
chest
chick
chin
chip
chop
coach
lunch
march
match
much
patch
peach
pinch
rich
```

#### Review Words

```text
fish
ship
shop
shell
dog
```

#### Practice Sentences

```text
lesson-03-02-sentence-01 | The chick is on the bench.
lesson-03-02-sentence-02 | I can chop the peach.
lesson-03-02-sentence-03 | The coach can chat.
lesson-03-02-sentence-04 | The chain is on the chair.
lesson-03-02-sentence-05 | The dog can march.
lesson-03-02-sentence-06 | I can check the patch.
lesson-03-02-sentence-07 | The match is in the chest.
lesson-03-02-sentence-08 | The chip can match the patch.
lesson-03-02-sentence-09 | The rich coach has lunch.
lesson-03-02-sentence-10 | The fish is on the bench.
```

#### Teacher Note

Have the learner notice that c and h combine into one quick sound at the start or end of a word. Ask for a slow blend followed by a smooth reread. Listen for a single ch sound without inserting a pause between the letters.

#### Validation

```yaml
expected_target_word_count: 20
expected_sentence_count: 10
allowed_sight_words:
  - "the"
  - "is"
  - "can"
  - "I"
  - "in"
  - "on"
  - "has"
```

### Lesson: lesson-03-03

```yaml
lesson_id: lesson-03-03
lesson_order: 3
title: "Words with TH and WH"
focus: digraph_th_wh
difficulty: 2
prerequisites:
  - "lesson-03-02"
target_patterns:
  - "th"
  - "wh"
review_lesson_ids:
  - "lesson-03-02"
  - "lesson-03-01"
  - "lesson-01-01"
```

#### Target Words

```text
bath
cloth
math
moth
path
thank
them
then
thick
thin
think
thumb
whale
what
wheel
when
where
which
whiff
while
whim
whip
whisk
white
```

#### Review Words

```text
chick
bench
fish
ship
cat
```

#### Practice Sentences

```text
lesson-03-03-sentence-01 | The moth is on the cloth.
lesson-03-03-sentence-02 | I can think.
lesson-03-03-sentence-03 | The path is thin.
lesson-03-03-sentence-04 | The bath is for the cat.
lesson-03-03-sentence-05 | I can thank them.
lesson-03-03-sentence-06 | Then I can whisk.
lesson-03-03-sentence-07 | The white wheel is on the path.
lesson-03-03-sentence-08 | The whale is by the ship.
lesson-03-03-sentence-09 | When can I whisk?
lesson-03-03-sentence-10 | Which whip is white?
lesson-03-03-sentence-11 | Where is the wheel?
lesson-03-03-sentence-12 | The cat has a white whisk.
```

#### Teacher Note

Have the learner notice the mouth position for th and the single starting sound represented by wh. Ask for a slow blend followed by a smooth reread. Listen for one digraph sound rather than two separate consonant sounds.

#### Validation

```yaml
expected_target_word_count: 24
expected_sentence_count: 12
allowed_sight_words:
  - "a"
  - "the"
  - "is"
  - "can"
  - "I"
  - "on"
  - "has"
  - "by"
  - "for"
  - "them"
  - "then"
```

## File Summary

```yaml
chunk_id: phonics-03
lesson_count: 3
word_count: 64
sentence_count: 32
```
