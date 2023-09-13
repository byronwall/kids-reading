import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/chat";

import { env } from "~/env.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function generateSentenceWithWords(words: string[]) {
  const content =
    words.length > 0
      ? `Please give me 10 very simple sentences using these words: ${words.join(
          ", "
        )}.  First grade level.`
      : "Please give me 10 very simple sentences using long vowels, short vowels, and rhyming.  First grade level.";

  // probably need to get generic sentences and then filter by words:
  // give good enough about the focus and maybe have it target words too?
  // https://chat.openai.com/share/da6d2771-37db-4873-bfc5-9d7c02993835
  // Create 10 practice sentences for a kid to read out loud.  Aim for 1st grade reading level.  Aim for words that have similar phonics in the same sentence.

  /*
  Certainly, here are 10 practice sentences aimed at a 1st-grade reading level, focusing on similar phonics within each sentence:

1. The cat sat on a mat.
2. Big pigs dig in the mud.
3. The dog ran to the log.
4. Six kids hid in the shed.
5. The hen is in the pen.
6. A frog hops on a log.
7. Red beds are for Ted.
8. The fish swish in the dish.
9. A fox can hop on a box.
10. The duck is stuck in muck.

These sentences are designed to emphasize phonetic similarity, making it easier for a young reader to recognize and sound out words.
*/

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are an assistant that generates sentences for young kids to practice based on their needs. Return each sentence on a new line.  Do not add any extra punctuation around the sentence.  Avoid using proper names.  Instead use generic objects, articles, and pronouns.",
    },
    {
      role: "user",
      content: content,
    },
  ];
  console.log("start prompt to OpenAI", { messages });

  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo",
    presence_penalty: 0.4,
    temperature: 1,
  });

  const response = chatCompletion.choices[0]?.message.content;

  console.log("end prompt to OpenAI", {
    chatCompletion,
    response,
  });

  // add some checks to verify the output format
  // then split into sentences

  /*

  {
  chatCompletion: {
    id: 'chatcmpl-7vG3N34HJQ393oy7uMpKlgmg9D3io',
    object: 'chat.completion',
    created: 1693880761,
    model: 'gpt-3.5-turbo-0613',
    choices: [ [Object] ],
    usage: { prompt_tokens: 212, completion_tokens: 124, total_tokens: 336 }
  },
  response: '1. The big blue bird can fly high in the sky.\n' +
    '2. Look at the little yellow duck swimming in the pond.\n' +
    '3. May I have a red balloon to play with?\n' +
    '4. The cat likes to run and jump around the house.\n' +
    '5. Can you help me find my lost toy?\n' +
    '6. I see three colorful flowers in the garden.\n' +
    "7. Let's go to the park and play on the swings.\n" +
    '8. Thank you for letting me join in the fun!\n' +
    "9. The dog likes to wag its tail when it's happy.\n" +
    '10. We can walk together and explore the forest.'
}

  */

  // split that response based on new lines -- then remove the numbers

  const sentences = response
    ?.split("\n")
    .map((sentence) => {
      const sentenceWithoutNumber = sentence.replace(/^\d+\.\s/, "");
      return sentenceWithoutNumber;
    })
    .filter((c) => c.length > 0);

  return sentences ?? [];
}
