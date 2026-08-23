---
schema_version: 1
chunk_id: word-building-02
chunk_order: 2
plan_id: word-building
plan_order: 2
plan_title: Word Building & Meaning
plan_description: A compact curriculum for building words with common endings and affixes.
age_range: "6-9"
difficulty: 5
---

# Common Suffixes

## Chunk Goals

- Read base words with the endings -er and -est.
- Read common words with the endings -ful and -less.
- Read common -ly forms and connect each form to a sentence.

## Lessons

### Lesson: lesson-12-01

```yaml
lesson_id: lesson-12-01
lesson_order: 1
title: "Words with ER and EST"
focus: suffix_er_est
difficulty: 5
prerequisites:
  - "lesson-11-03"
target_patterns:
  - "-er"
  - "-est"
review_lesson_ids:
  - "lesson-11-03"
```

#### Target Words

```text
bigger
biggest
smaller
smallest
faster
fastest
slower
slowest
taller
tallest
shorter
shortest
colder
coldest
hotter
hottest
kinder
kindest
softer
softest
```

#### Review Words

```text
dog
cat
kid
pig
man
boy
fox
sun
```

#### Practice Sentences

```text
lesson-12-01-sentence-01 | The dog is bigger.
lesson-12-01-sentence-02 | The cat is smaller.
lesson-12-01-sentence-03 | The kid is faster.
lesson-12-01-sentence-04 | The pig is slower.
lesson-12-01-sentence-05 | The man is taller.
lesson-12-01-sentence-06 | The boy is shorter.
lesson-12-01-sentence-07 | The fox is colder.
lesson-12-01-sentence-08 | The sun is hotter.
lesson-12-01-sentence-09 | The dog is biggest.
lesson-12-01-sentence-10 | The cat is smallest.
lesson-12-01-sentence-11 | The man is tallest.
lesson-12-01-sentence-12 | The dog is softest.
```

#### Teacher Note

Have the learner notice how -er compares two things and -est names the strongest degree. Ask the learner to read the whole word without dropping the base word.

#### Validation

```yaml
expected_target_word_count: 20
expected_sentence_count: 12
allowed_sight_words:
  - "a"
  - "the"
  - "is"
  - "can"
  - "I"
  - "in"
  - "on"
  - "and"
  - "to"
  - "by"
  - "kid"
  - "pig"
  - "man"
  - "fox"
  - "sun"
```

### Lesson: lesson-12-02

```yaml
lesson_id: lesson-12-02
lesson_order: 2
title: "Words with FUL and LESS"
focus: suffix_ful_less
difficulty: 5
prerequisites:
  - "lesson-12-01"
target_patterns:
  - "-ful"
  - "-less"
review_lesson_ids:
  - "lesson-12-01"
  - "lesson-11-02"
```

#### Target Words

```text
helpful
harmful
careful
careless
hopeful
hopeless
useful
useless
joyful
joyless
playful
thankful
fearful
fearless
colorful
colorless
peaceful
endless
restful
restless
```

#### Review Words

```text
dog
cat
kid
girl
boy
camp
park
flag
```

#### Practice Sentences

```text
lesson-12-02-sentence-01 | The helpful kid is at camp.
lesson-12-02-sentence-02 | The careful girl is at the park.
lesson-12-02-sentence-03 | The careless boy is at camp.
lesson-12-02-sentence-04 | The hopeful dog is by the flag.
lesson-12-02-sentence-05 | The useful map is on the box.
lesson-12-02-sentence-06 | The playful cat is in the box.
lesson-12-02-sentence-07 | The thankful kid is by the flag.
lesson-12-02-sentence-08 | The fearful fox is in the bush.
lesson-12-02-sentence-09 | The colorful flag is on the map.
lesson-12-02-sentence-10 | The peaceful camp is by the park.
lesson-12-02-sentence-11 | The restless dog can run.
lesson-12-02-sentence-12 | The fearless kid can help.
```

#### Teacher Note

Have the learner read the base word first, then attach -ful or -less. Ask whether the finished word describes something with the base idea or without it.

#### Validation

```yaml
expected_target_word_count: 20
expected_sentence_count: 12
allowed_sight_words:
  - "a"
  - "the"
  - "is"
  - "can"
  - "I"
  - "in"
  - "on"
  - "and"
  - "to"
  - "by"
  - "at"
  - "girl"
  - "camp"
  - "park"
  - "flag"
  - "box"
  - "bush"
  - "run"
  - "help"
```

### Lesson: lesson-12-03

```yaml
lesson_id: lesson-12-03
lesson_order: 3
title: "Words with LY"
focus: suffix_ly
difficulty: 5
prerequisites:
  - "lesson-12-02"
target_patterns:
  - "-ly"
review_lesson_ids:
  - "lesson-12-02"
  - "lesson-11-01"
```

#### Target Words

```text
badly
boldly
calmly
clearly
closely
slowly
softly
loudly
quickly
kindly
gladly
sadly
safely
lately
mostly
neatly
simply
firmly
brightly
gently
quietly
bravely
warmly
greatly
```

#### Review Words

```text
dog
cat
boy
girl
fox
kid
pig
bird
```

#### Practice Sentences

```text
lesson-12-03-sentence-01 | The dog runs quickly.
lesson-12-03-sentence-02 | The cat walks slowly.
lesson-12-03-sentence-03 | The boy rests quietly.
lesson-12-03-sentence-04 | The girl looks closely.
lesson-12-03-sentence-05 | The kid helps kindly.
lesson-12-03-sentence-06 | The pig sits calmly.
lesson-12-03-sentence-07 | The fox rushes loudly.
lesson-12-03-sentence-08 | The dog rests safely.
lesson-12-03-sentence-09 | The bird sings brightly.
lesson-12-03-sentence-10 | The girl smiles warmly.
```

#### Teacher Note

Have the learner notice that -ly often tells how an action happens. Ask for a smooth reread so the ending stays attached to the base word.

#### Validation

```yaml
expected_target_word_count: 24
expected_sentence_count: 10
allowed_sight_words:
  - "a"
  - "the"
  - "is"
  - "can"
  - "I"
  - "in"
  - "on"
  - "and"
  - "to"
  - "by"
  - "at"
  - "girl"
  - "fox"
  - "pig"
  - "bird"
  - "walks"
  - "sings"
  - "smiles"
```

## File Summary

```yaml
chunk_id: word-building-02
lesson_count: 3
word_count: 64
sentence_count: 34
```
