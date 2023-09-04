# Logic associated with words, questions and profiles

The following all need to happen:

- Words exist in a database (along with sentences -- focus on words for now)
- Words need to be associated with a question
- Words need to be associated with profiles via the `ProfileWordSummary` table
- Users need to somehow indicate that they want to focus on specific words or questions
- After questions are attempted, need to record the result and get the progress into the summary table
- The summary table needs to update to reflect the new spaced repetition timing

Missing pieces that might streamline this process:

- A plan that groups words or questions so they can be easily added - the plan would allow for levels or progressions to be more obvious
- Might create plans automatically if there was a ranking or some way to sort words

## User Flow

1. User selects a question to attempt.
2. System displays the associated words for the selected question.
3. User selects the words they want to focus on.
4. System records the user's word selections and updates the `ProfileWordSummary` table.
5. User attempts the question.
6. System records the result of the attempt and updates the `ProfileWordSummary` table.
7. System calculates the new spaced repetition timing for the selected words and updates the `ProfileWordSummary` table.
8. System displays the progress of the selected words in the summary table.

## Logic Flow

- When a user selects a question, the system retrieves the associated words from the database.
- When a user selects words to focus on, the system records the selections in the `ProfileWordSummary` table.
- When a user attempts a question, the system records the result of the attempt in the `ProfileWordSummary` table.
- When a user attempts a question, the system calculates the new spaced repetition timing for the selected words and updates the `ProfileWordSummary` table.
- When the summary table is displayed, the system retrieves the progress of the selected words from the `ProfileWordSummary` table.
