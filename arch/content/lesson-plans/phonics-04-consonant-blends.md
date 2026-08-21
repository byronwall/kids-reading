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
The black cat is on the sled.
I can clap.
The flag is on the plant.
The clock is by the glass.
A plum is in the glass.
The flat plan is on the rug.
The sled can slip.
I can flip the flap.
The slim dog can slip.
The clip is on the flag.
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
The crab can grab the trap.
I can brush the dog.
The drum is in the truck.
The frog can grin.
The crack is in the brick.
The crop is fresh.
The dress is black.
I can print.
The truck can drop the brick.
The cat can bring the brush.
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
I can skip.
The dog can smell the snack.
The cat can spot the stick.
I can spin.
The stack is on the desk.
I can snap the stick.
The kid can swim.
The lamp is in the tent.
I can jump in the camp.
The gift is in my hand.
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
