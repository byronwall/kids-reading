---
schema_version: 1
chunk_id: phonics-02
chunk_order: 2
plan_id: foundational-phonics
plan_title: Foundational Phonics
plan_description: A progressive first-reading curriculum.
age_range: "5-8"
difficulty: 1
---

# CVC Words with Common Consonants

## Chunk Goals

- Read CVC words while changing the first or final consonant.
- Keep the short vowel stable when consonants change.
- Build automatic recognition of common consonant spellings.

## Lessons

### Lesson: lesson-02-01

```yaml
lesson_id: lesson-02-01
lesson_order: 1
title: "CVC Words with M N P and T"
focus: cvc_m_n_p_t
difficulty: 1
prerequisites:
  - "lesson-01-03"
target_patterns:
  - "m"
  - "n"
  - "p"
  - "t"
  - "CVC"
review_lesson_ids:
  - "lesson-01-01"
  - "lesson-01-02"
  - "lesson-01-03"
```

#### Target Words

```text
man
map
men
met
mop
mug
nap
net
nod
not
nut
pan
pen
pet
pin
pot
tan
tap
ten
top
```

#### Review Words

```text
cat
pig
red
sun
mat
```

#### Practice Sentences

```text
The man can nap.
I can tap the pan.
The pen is in the mug.
The pot is on the mat.
The men met.
The pet can nap.
I see a tan map.
The nut is on the top.
The pig can tap the net.
The cat is not in the pan.
```

#### Teacher Note

Have the learner notice how the same short vowel remains steady as m, n, p, and t change. Ask for a slow blend followed by a smooth reread. Listen for clean consonant sounds without an added vowel after the consonant.

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
```

### Lesson: lesson-02-02

```yaml
lesson_id: lesson-02-02
lesson_order: 2
title: "CVC Words with B D and G"
focus: cvc_b_d_g
difficulty: 1
prerequisites:
  - "lesson-02-01"
target_patterns:
  - "b"
  - "d"
  - "g"
  - "CVC"
review_lesson_ids:
  - "lesson-01-01"
  - "lesson-01-03"
```

#### Target Words

```text
bad
bag
bed
beg
bib
big
bog
bud
dab
dad
did
dig
dog
dug
gas
get
gig
got
gum
tag
```

#### Review Words

```text
man
map
pen
pet
pot
```

#### Practice Sentences

```text
Dad did dig.
The dog dug in the bog.
A big bag is on the bed.
I can tag the bag.
The tag is on the bib.
The gum is in the bag.
Dad got the gas.
The big dog can beg.
I see a bud.
The dog did get the gum.
```

#### Teacher Note

Have the learner notice the voiced consonants b, d, and g at the edges of CVC words. Ask for a slow blend followed by a smooth reread. Listen for a clear stop at the final consonant and no confusion between b and d.

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
```

### Lesson: lesson-02-03

```yaml
lesson_id: lesson-02-03
lesson_order: 3
title: "CVC Words with More Common Consonants"
focus: cvc_common_more
difficulty: 1
prerequisites:
  - "lesson-02-02"
target_patterns:
  - "c"
  - "k"
  - "f"
  - "h"
  - "l"
  - "r"
  - "s"
  - "w"
  - "y"
  - "CVC"
review_lesson_ids:
  - "lesson-01-01"
  - "lesson-01-03"
  - "lesson-01-02"
```

#### Target Words

```text
cab
cap
cod
cot
cub
cut
fan
fat
fin
fit
fix
fog
fox
had
ham
hen
hid
hip
hit
hop
kid
kit
leg
lip
red
rug
run
sun
web
yak
```

#### Review Words

```text
bag
dog
pen
map
lid
sat
```

#### Practice Sentences

```text
The fox can hop.
A kid can fix the fan.
The hen had ham.
The cub is in the cot.
I see a fin on the cod.
The yak can run.
The red lid is on the rug.
The web is in the fog.
The kid hid in the cab.
The fat dog sat.
```

#### Teacher Note

Have the learner notice how common beginning and ending consonants frame a short vowel. Ask for a slow blend followed by a smooth reread. Listen for precise first and final sounds with no consonant omitted.

#### Validation

```yaml
expected_target_word_count: 30
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
```

## File Summary

```yaml
chunk_id: phonics-02
lesson_count: 3
word_count: 70
sentence_count: 30
```
