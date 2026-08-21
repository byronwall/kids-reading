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
The cat sat.
A rat ran.
The man had a map.
Dad had a van.
The bat is in the bag.
The ham is in the pan.
I can tap the mat.
The sad cat can nap.
The fan is on.
The fat rat sat on the mat.
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
The pig is big.
A kid can dig.
I can fix the lid.
The fin is in the bin.
The pig hid in the bin.
The kid did sit.
I see a pin and a lid.
The bib is on the kid.
The big pig can sit.
Dad can fix the van.
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
The hen is in the den.
The bed is wet.
The red pen is on the bed.
The dog can hop.
A fox sat on a log.
The pot is hot.
I can mop the mud.
A bug is on the mug.
The cub is in the sun.
The dog dug in the mud.
I see a bun and a cup.
The net is on the box.
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
