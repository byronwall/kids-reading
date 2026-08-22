---
schema_version: 1
chunk_id: phonics-04
chunk_order: 4
plan_id: foundational-phonics
plan_title: Foundational Phonics
plan_description: A progressive first-reading curriculum.
age_range: "5-8"
difficulty: 2
---

# Consonant Blends

## Chunk Goals

- Blend adjacent consonants while keeping each sound audible.
- Read common initial l, r, and s blends.
- Read common final consonant blends without dropping a sound.

## Lessons

### Lesson: lesson-04-01

```yaml
lesson_id: lesson-04-01
lesson_order: 1
title: "Initial L Blends"
focus: initial_l_blends
difficulty: 2
prerequisites:
  - "lesson-03-03"
target_patterns:
  - "bl"
  - "cl"
  - "fl"
  - "gl"
  - "pl"
  - "sl"
review_lesson_ids:
  - "lesson-01-01"
  - "lesson-01-03"
  - "lesson-03-01"
  - "lesson-03-02"
  - "lesson-02-03"
```

#### Target Words

```text
black
blank
clap
class
clean
clip
clock
flag
flap
flat
flip
glad
glass
plan
plant
plot
plum
sled
slim
slip
```

#### Review Words

```text
cat
dog
ship
bench
rug
```

#### Practice Sentences

```text
lesson-04-01-sentence-01 | The black cat is on the sled.
lesson-04-01-sentence-02 | I can clap.
lesson-04-01-sentence-03 | The flag is on the plant.
lesson-04-01-sentence-04 | The clock is by the glass.
lesson-04-01-sentence-05 | A plum is in the glass.
lesson-04-01-sentence-06 | The flat plan is on the rug.
lesson-04-01-sentence-07 | The sled can slip.
lesson-04-01-sentence-08 | I can flip the flap.
lesson-04-01-sentence-09 | The slim dog can slip.
lesson-04-01-sentence-10 | The clip is on the flag.
```

#### Teacher Note

Have the learner notice that both consonant sounds remain audible in an l blend. Ask for a slow blend followed by a smooth reread. Listen for the learner preserving the first consonant instead of reading only l.

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
  - "by"
```

### Lesson: lesson-04-02

```yaml
lesson_id: lesson-04-02
lesson_order: 2
title: "Initial R Blends"
focus: initial_r_blends
difficulty: 2
prerequisites:
  - "lesson-04-01"
target_patterns:
  - "br"
  - "cr"
  - "dr"
  - "fr"
  - "gr"
  - "pr"
  - "tr"
review_lesson_ids:
  - "lesson-04-01"
  - "lesson-01-01"
  - "lesson-01-03"
```

#### Target Words

```text
brag
bran
brick
bring
brush
crab
crack
crop
dress
drip
drop
drum
fresh
frog
grab
grin
grip
print
trap
truck
```

#### Review Words

```text
black
glass
plum
cat
dog
```

#### Practice Sentences

```text
lesson-04-02-sentence-01 | The crab can grab the trap.
lesson-04-02-sentence-02 | I can brush the dog.
lesson-04-02-sentence-03 | The drum is in the truck.
lesson-04-02-sentence-04 | The frog can grin.
lesson-04-02-sentence-05 | The crack is in the brick.
lesson-04-02-sentence-06 | The crop is fresh.
lesson-04-02-sentence-07 | The dress is black.
lesson-04-02-sentence-08 | I can print.
lesson-04-02-sentence-09 | The truck can drop the brick.
lesson-04-02-sentence-10 | The cat can bring the brush.
```

#### Teacher Note

Have the learner notice that the r sound follows another consonant without replacing it. Ask for a slow blend followed by a smooth reread. Listen for both sounds in each blend, especially the consonant before r.

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
```

### Lesson: lesson-04-03

```yaml
lesson_id: lesson-04-03
lesson_order: 3
title: "Initial S and Final Blends"
focus: blend_s_final
difficulty: 2
prerequisites:
  - "lesson-04-02"
target_patterns:
  - "sk"
  - "sl"
  - "sm"
  - "sn"
  - "sp"
  - "st"
  - "sw"
  - "nd"
  - "nt"
  - "mp"
  - "sk"
  - "ft"
review_lesson_ids:
  - "lesson-01-03"
  - "lesson-01-01"
  - "lesson-04-02"
  - "lesson-01-02"
```

#### Target Words

```text
skid
skin
skip
slam
smell
snack
snap
spin
spot
stack
step
stick
stop
swim
band
bend
camp
desk
fast
gift
hand
jump
lamp
tent
```

#### Review Words

```text
dog
cat
frog
truck
kid
```

#### Practice Sentences

```text
lesson-04-03-sentence-01 | I can skip.
lesson-04-03-sentence-02 | The dog can smell the snack.
lesson-04-03-sentence-03 | The cat can spot the stick.
lesson-04-03-sentence-04 | I can spin.
lesson-04-03-sentence-05 | The stack is on the desk.
lesson-04-03-sentence-06 | I can snap the stick.
lesson-04-03-sentence-07 | The kid can swim.
lesson-04-03-sentence-08 | The lamp is in the tent.
lesson-04-03-sentence-09 | I can jump in the camp.
lesson-04-03-sentence-10 | The gift is in my hand.
```

#### Teacher Note

Have the learner notice the separate sounds in initial s blends and final consonant blends. Ask for a slow blend followed by a smooth reread. Listen for every consonant being heard without an extra vowel between sounds.

#### Validation

```yaml
expected_target_word_count: 24
expected_sentence_count: 10
allowed_sight_words:
  - "the"
  - "is"
  - "can"
  - "I"
  - "in"
  - "on"
  - "my"
```

## File Summary

```yaml
chunk_id: phonics-04
lesson_count: 3
word_count: 64
sentence_count: 30
```
