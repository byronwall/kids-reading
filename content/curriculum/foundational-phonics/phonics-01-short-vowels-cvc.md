---
schema_version: 1
chunk_id: phonics-01
chunk_order: 1
plan_id: foundational-phonics
plan_title: Foundational Phonics
plan_description: A progressive first-reading curriculum.
age_range: "5-8"
difficulty: 1
---

# Short Vowels and CVC Words

## Chunk Goals

- Blend three sounds in consonant-vowel-consonant words.
- Hear and identify short vowel sounds in the middle of words.
- Read short sentences with controlled CVC vocabulary.

## Lessons

### Lesson: lesson-01-01

```yaml
lesson_id: lesson-01-01
lesson_order: 1
title: "Short A CVC Words"
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
bag
bat
cat
dad
fan
fat
had
ham
jam
man
map
mat
nap
pan
ran
rat
sad
sat
tap
van
```

#### Review Words

```text
a
the
is
can
I
```

#### Practice Sentences

```text
lesson-01-01-sentence-01 | The cat sat.
lesson-01-01-sentence-02 | A rat ran.
lesson-01-01-sentence-03 | The man had a map.
lesson-01-01-sentence-04 | Dad had a van.
lesson-01-01-sentence-05 | The bat is in the bag.
lesson-01-01-sentence-06 | The ham is in the pan.
lesson-01-01-sentence-07 | I can tap the mat.
lesson-01-01-sentence-08 | The sad cat can nap.
lesson-01-01-sentence-09 | The fan is on.
lesson-01-01-sentence-10 | The fat rat sat on the mat.
```

#### Teacher Note

Have the learner notice the short a sound in the middle of each three-sound word. Ask for a slow blend followed by a smooth reread. Listen for three distinct phonemes followed by a smooth blend.

#### Validation

```yaml
expected_target_word_count: 20
expected_sentence_count: 10
allowed_sight_words:
  - "a"
  - "the"
  - "is"
  - "can"
  - "I"
  - "in"
  - "on"
```

### Lesson: lesson-01-02

```yaml
lesson_id: lesson-01-02
lesson_order: 2
title: "Short I CVC Words"
focus: short_i
difficulty: 1
prerequisites:
  - "lesson-01-01"
target_patterns:
  - "i"
  - "CVC"
review_lesson_ids:
  - "lesson-01-01"
```

#### Target Words

```text
bib
big
bin
bit
did
dig
fin
fit
fix
hid
him
hip
hit
kid
lid
lip
mix
pig
pin
sit
```

#### Review Words

```text
cat
map
dad
van
sat
```

#### Practice Sentences

```text
lesson-01-02-sentence-01 | The pig is big.
lesson-01-02-sentence-02 | A kid can dig.
lesson-01-02-sentence-03 | I can fix the lid.
lesson-01-02-sentence-04 | The fin is in the bin.
lesson-01-02-sentence-05 | The pig hid in the bin.
lesson-01-02-sentence-06 | The kid did sit.
lesson-01-02-sentence-07 | I see a pin and a lid.
lesson-01-02-sentence-08 | The bib is on the kid.
lesson-01-02-sentence-09 | The big pig can sit.
lesson-01-02-sentence-10 | Dad can fix the van.
```

#### Teacher Note

Have the learner notice the short i sound and how it differs from short a. Ask for a slow blend followed by a smooth reread. Listen for a crisp short i without an added sound after the final consonant.

#### Validation

```yaml
expected_target_word_count: 20
expected_sentence_count: 10
allowed_sight_words:
  - "a"
  - "the"
  - "is"
  - "can"
  - "I"
  - "see"
  - "in"
  - "on"
  - "and"
```

### Lesson: lesson-01-03

```yaml
lesson_id: lesson-01-03
lesson_order: 3
title: "Short E O and U CVC Words"
focus: short_e_o_u
difficulty: 1
prerequisites:
  - "lesson-01-02"
target_patterns:
  - "e"
  - "o"
  - "u"
  - "CVC"
review_lesson_ids:
  - "lesson-01-01"
  - "lesson-01-02"
```

#### Target Words

```text
bed
den
hen
leg
net
pen
pet
red
ten
wet
box
dog
dot
fog
fox
hop
hot
log
mop
pot
bug
bun
bus
cub
cup
dug
fun
mud
mug
sun
```

#### Review Words

```text
cat
pig
kid
lid
map
sat
```

#### Practice Sentences

```text
lesson-01-03-sentence-01 | The hen is in the den.
lesson-01-03-sentence-02 | The bed is wet.
lesson-01-03-sentence-03 | The red pen is on the bed.
lesson-01-03-sentence-04 | The dog can hop.
lesson-01-03-sentence-05 | A fox sat on a log.
lesson-01-03-sentence-06 | The pot is hot.
lesson-01-03-sentence-07 | I can mop the mud.
lesson-01-03-sentence-08 | A bug is on the mug.
lesson-01-03-sentence-09 | The cub is in the sun.
lesson-01-03-sentence-10 | The dog dug in the mud.
lesson-01-03-sentence-11 | I see a bun and a cup.
lesson-01-03-sentence-12 | The net is on the box.
```

#### Teacher Note

Have the learner notice the different mouth shapes used for short e, short o, and short u. Ask for a slow blend followed by a smooth reread. Listen for the learner keeping each middle vowel distinct while blending.

#### Validation

```yaml
expected_target_word_count: 30
expected_sentence_count: 12
allowed_sight_words:
  - "a"
  - "the"
  - "is"
  - "can"
  - "I"
  - "see"
  - "in"
  - "on"
  - "and"
```

## File Summary

```yaml
chunk_id: phonics-01
lesson_count: 3
word_count: 70
sentence_count: 32
```
