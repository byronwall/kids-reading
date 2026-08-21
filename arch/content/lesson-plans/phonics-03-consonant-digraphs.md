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
The ship is in the sun.
I can wash the dish.
The fish can rush.
The shell is in the shop.
The dog can push the mesh.
The rash is on the leg.
The bush is by the shed.
The dish has mash.
I can hush the dog.
The cat can dash.
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
The chick is on the bench.
I can chop the peach.
The coach can chat.
The chain is on the chair.
The dog can march.
I can check the patch.
The match is in the chest.
The chip can match the patch.
The rich coach has lunch.
The fish is on the bench.
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
The moth is on the cloth.
I can think.
The path is thin.
The bath is for the cat.
I can thank them.
Then I can whisk.
The white wheel is on the path.
The whale is by the ship.
When can I whisk?
Which whip is white?
Where is the wheel?
The cat has a white whisk.
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
