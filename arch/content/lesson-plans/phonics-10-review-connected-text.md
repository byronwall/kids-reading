---
schema_version: 1
chunk_id: phonics-10
chunk_order: 10
plan_id: foundational-phonics
plan_title: Foundational Phonics
plan_description: A progressive first-reading curriculum.
age_range: "5-8"
difficulty: 5
---

# Review and Connected Text

## Chunk Goals

- Choose the correct vowel or consonant pattern in mixed review.
- Read longer sentences with previously taught word types.
- Move from isolated decoding to a short sequence of connected ideas.

## Lessons

### Lesson: lesson-10-01

```yaml
lesson_id: lesson-10-01
lesson_order: 1
title: "Short Vowel and Magic-E Contrast"
focus: review_short_magic_e
difficulty: 5
prerequisites:
  - "lesson-09-03"
target_patterns:
  - "CVC"
  - "a_e"
  - "i_e"
  - "o_e"
  - "u_e"
review_lesson_ids:
  - "lesson-01-01"
  - "lesson-05-01"
  - "lesson-01-03"
```

#### Target Words

```text
bit
bite
cap
cape
cub
cube
cut
cute
hop
hope
kit
kite
mad
made
not
note
rid
ride
tap
tape
```

#### Review Words

```text
cat
cake
dog
map
sun
```

#### Practice Sentences

```text
The cub is by the cube.
The cute cub can hop.
I can tap the tape.
The cap is by the cape.
The kit has a kite.
The note is on the cape.
I hope the cub can ride.
The mad cat made a cake.
The dog is not mad.
I can cut the tape.
```

#### Teacher Note

Have the learner notice the final e that changes a short-vowel word into a long-vowel word. Ask for a slow blend followed by a smooth reread. Listen for the learner checking the ending before choosing the vowel sound.

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
  - "on"
  - "has"
  - "by"
```

### Lesson: lesson-10-02

```yaml
lesson_id: lesson-10-02
lesson_order: 2
title: "Mixed Digraph and Blend Review"
focus: review_digraphs_blends
difficulty: 5
prerequisites:
  - "lesson-10-01"
target_patterns:
  - "sh"
  - "ch"
  - "th"
  - "wh"
  - "initial blends"
  - "final blends"
review_lesson_ids:
  - "lesson-01-03"
  - "lesson-01-01"
  - "lesson-06-02"
  - "lesson-06-03"
```

#### Target Words

```text
bench
brush
camp
chat
chick
clap
crab
fish
flag
jump
match
shell
ship
shop
stick
thick
thin
thorn
thumb
whale
wheel
white
storm
trap
```

#### Review Words

```text
dog
cat
tree
boat
tap
```

#### Practice Sentences

```text
The chick is by the bench.
The crab is by the shell.
I can brush the white dog.
The fish is by the ship.
The thick stick is in the camp.
I can clap at the match.
The flag is by the shop.
The thin thorn is by the wheel.
I can tap with my thumb.
The white whale is by the boat.
```

#### Teacher Note

Have the learner notice whether adjacent consonants form one digraph sound or retain both blend sounds. Ask for a slow blend followed by a smooth reread. Listen for accurate sound handling before the learner increases reading speed.

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
  - "with"
  - "at"
  - "by"
  - "my"
```

### Lesson: lesson-10-03

```yaml
lesson_id: lesson-10-03
lesson_order: 3
title: "A Simple Connected Reading"
focus: connected_text_transition
difficulty: 5
prerequisites:
  - "lesson-10-02"
target_patterns:
  - "mixed review"
  - "connected text"
review_lesson_ids:
  - "lesson-01-03"
  - "lesson-07-03"
  - "lesson-08-01"
  - "lesson-08-02"
  - "lesson-08-03"
  - "lesson-07-01"
  - "lesson-07-02"
```

#### Target Words

```text
bird
boat
camp
creek
cross
find
frog
help
home
light
look
lunch
map
night
pack
rain
rest
safe
smile
stone
tent
trail
tree
walk
```

#### Review Words

```text
dog
girl
boy
cloud
moon
park
house
horse
```

#### Practice Sentences

```text
We pack a map and lunch.
The girl and the boy walk to camp.
The dog is with them.
The trail is by the creek.
We see a frog on a stone.
A bird is in the tree.
A cloud is over the creek.
The rain is on the trail.
We find a boat by the creek.
We help the dog cross.
Then we rest by the tree.
At night, we light the tent.
The moon is over the camp.
We look at the map.
The boy and girl smile.
We walk home safe.
```

#### Teacher Note

Have the learner notice how familiar phonics patterns support meaning across connected sentences. Ask for a slow blend followed by a smooth reread. Listen for steady phrasing, accurate decoding, and a brief pause at each period.

#### Validation

```yaml
expected_target_word_count: 24
expected_sentence_count: 16
allowed_sight_words:
  - "a"
  - "the"
  - "is"
  - "see"
  - "in"
  - "on"
  - "and"
  - "to"
  - "we"
  - "with"
  - "at"
  - "by"
  - "over"
  - "them"
  - "then"
```

## File Summary

```yaml
chunk_id: phonics-10
lesson_count: 3
word_count: 68
sentence_count: 36
```
