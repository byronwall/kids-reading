---
schema_version: 1
chunk_id: spelling-patterns-01
chunk_order: 1
plan_id: spelling-patterns
plan_order: 3
plan_title: Spelling Pattern Extensions
plan_description: A focused sequence for spelling patterns beyond basic phonics.
age_range: "6-9"
difficulty: 4
---

# Special Final Spellings

## Chunk Goals

- Recognize final consonant spellings that preserve a short-vowel sound.
- Read and spell words with final ck, tch, dge, ng, and nk.
- Apply final spelling patterns in controlled sentences.

## Lessons

### Lesson: lesson-21-01

```yaml
lesson_id: lesson-21-01
lesson_order: 1
title: "Final CK"
focus: final_ck
difficulty: 4
prerequisites: []
target_patterns:
  - "ck"
review_lesson_ids: []
```

#### Target Words

```text
back
black
block
brick
click
clock
crack
check
deck
duck
kick
lick
lock
neck
pack
pick
quick
rock
sack
snack
sock
stick
trick
truck
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
lesson-21-01-sentence-01 | I can kick the ball.
lesson-21-01-sentence-02 | The duck is on the deck.
lesson-21-01-sentence-03 | The black sock is in the sack.
lesson-21-01-sentence-04 | I can check the lock.
lesson-21-01-sentence-05 | The truck is quick.
lesson-21-01-sentence-06 | The brick is on the block.
lesson-21-01-sentence-07 | I can pick a snack.
lesson-21-01-sentence-08 | The rock is by the stick.
lesson-21-01-sentence-09 | The clock can click.
lesson-21-01-sentence-10 | The duck can lick the snack.
lesson-21-01-sentence-11 | I can pack the sack.
lesson-21-01-sentence-12 | The trick is quick.
```

#### Teacher Note

Have the learner notice final ck after a short vowel. Ask the learner to say the short vowel before adding the final /k/ sound. Contrast the single sound with the two-letter spelling.

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
  - "in"
  - "by"
  - "ball"
```

### Lesson: lesson-21-02

```yaml
lesson_id: lesson-21-02
lesson_order: 2
title: "Final TCH and DGE"
focus: final_tch_dge
difficulty: 4
prerequisites:
  - "lesson-21-01"
target_patterns:
  - "tch"
  - "dge"
review_lesson_ids:
  - "lesson-21-01"
```

#### Target Words

```text
badge
batch
bridge
catch
crutch
ditch
dodge
edge
fetch
fudge
grudge
hatch
hedge
hutch
judge
lodge
match
nudge
patch
pitch
ridge
smudge
ledge
wedge
```

#### Review Words

```text
back
duck
check
sock
truck
```

#### Practice Sentences

```text
lesson-21-02-sentence-01 | I can catch the batch.
lesson-21-02-sentence-02 | The badge is on the bridge.
lesson-21-02-sentence-03 | The judge can match the patch.
lesson-21-02-sentence-04 | The duck is by the hedge.
lesson-21-02-sentence-05 | I can fetch the fudge.
lesson-21-02-sentence-06 | The hutch is on the edge.
lesson-21-02-sentence-07 | The truck can dodge the ditch.
lesson-21-02-sentence-08 | The wedge is by the ridge.
lesson-21-02-sentence-09 | I can nudge the crutch.
lesson-21-02-sentence-10 | The patch is on the badge.
lesson-21-02-sentence-11 | The lodge is by the hedge.
lesson-21-02-sentence-12 | The pitch can match the batch.
```

#### Teacher Note

Have the learner notice tch and dge at the ends of short-vowel words. Ask the learner to hold the short vowel and then blend the final /ch/ or /j/ sound. Point out that the final sound is one sound even when the spelling has three letters.

#### Validation

```yaml
expected_target_word_count: 24
expected_sentence_count: 12
allowed_sight_words:
  - "the"
  - "is"
  - "can"
  - "I"
  - "on"
  - "by"
```

### Lesson: lesson-21-03

```yaml
lesson_id: lesson-21-03
lesson_order: 3
title: "Final NG and NK"
focus: final_ng_nk
difficulty: 4
prerequisites:
  - "lesson-21-02"
target_patterns:
  - "ng"
  - "nk"
review_lesson_ids:
  - "lesson-21-02"
```

#### Target Words

```text
bang
bank
blank
blink
bring
clang
chunk
drink
fang
hang
king
link
long
pink
rang
ring
sing
sink
skunk
song
swing
thank
thing
think
trunk
wing
wink
junk
```

#### Review Words

```text
catch
badge
ditch
hedge
truck
```

#### Practice Sentences

```text
lesson-21-03-sentence-01 | The king can sing a song.
lesson-21-03-sentence-02 | The pink wing is on the trunk.
lesson-21-03-sentence-03 | I can drink from the bank.
lesson-21-03-sentence-04 | The skunk is in the junk.
lesson-21-03-sentence-05 | The blank box is by the sink.
lesson-21-03-sentence-06 | The thing can blink.
lesson-21-03-sentence-07 | The long wing can swing.
lesson-21-03-sentence-08 | I can bring the chunk.
lesson-21-03-sentence-09 | The fang is by the hedge.
lesson-21-03-sentence-10 | The king rang the bell.
lesson-21-03-sentence-11 | I think the skunk can sing.
lesson-21-03-sentence-12 | The truck is by the bank.
```

#### Teacher Note

Have the learner notice ng and nk at the ends of words. Ask the learner to listen for the nasal sound in ng and the /nk/ blend in nk. Contrast the final sounds while the learner reads each word in a sentence.

#### Validation

```yaml
expected_target_word_count: 28
expected_sentence_count: 12
allowed_sight_words:
  - "the"
  - "is"
  - "can"
  - "I"
  - "a"
  - "on"
  - "in"
  - "by"
  - "from"
  - "box"
  - "bell"
```

## File Summary

```yaml
chunk_id: spelling-patterns-01
lesson_count: 3
word_count: 76
sentence_count: 36
```
