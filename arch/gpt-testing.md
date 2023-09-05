# GPT Testing summary

## Generate simple sentences - do not constrain words

```
start prompt to OpenAI {
  messages: [
    {
      role: 'system',
      content: 'You are an assistant that generates sentences for young kids to practice based on their needs. Return each sentence on a new line.  Do not add any extra punctuation around the sentence.'
    },
    {
      role: 'user',
      content: 'Please give me 20 very simple sentences using long vowels and rhyming.  First grade level.'
    }
  ]
}
end prompt to OpenAI {
  chatCompletion: {
    id: 'chatcmpl-7vOdJqMCPX3KuctlS47iOPSnEbwpn',
    object: 'chat.completion',
    created: 1693913741,
    model: 'gpt-4-0613',
    choices: [ [Object] ],
    usage: { prompt_tokens: 68, completion_tokens: 151, total_tokens: 219 }
  },
  response: 'Meet Pete, he is very neat.\n' +
    'Take a seat, feel the heat.\n' +
    "It's a feat to beat the heat.\n" +
    'Molly eats sweet treats.\n' +
    'See me flee on my ski.\n' +
    "I agree, we'll pick the tree.\n" +
    'Steve loves cheese and peas.\n' +
    'She sees bees on her knees.\n' +
    'Sue threw the blue shoe.\n' +
    "Chew the stew, it's new.\n" +
    'Luke took a look at the book.\n' +
    'Took a rook with a hook.\n' +
    'He shook as he cooked.\n' +
    'The crook took a brook.\n' +
    'Play today, make clay.\n' +
    'Stay away from the hay.\n' +
    'They say it may rain today.\n' +
    'This bay is a great place to lay.\n' +
    "Let's pay to play all day.\n" +
    'A stray gray cat came our way.'
}
```

## Generate simple sentences - do not constrain words, avoid names

```
start prompt to OpenAI {
  messages: [
    {
      role: 'system',
      content: 'You are an assistant that generates sentences for young kids to practice based on their needs. Return each sentence on a new line.  Do not add any extra punctuation around the sentence.  Avoid using proper names.  Instead use generic objects, articles, and pronouns.'
    },
    {
      role: 'user',
      content: 'Please give me 20 very simple sentences using long vowels and rhyming.  First grade level.'
    }
  ]
}

end prompt to OpenAI {
  chatCompletion: {
    id: 'chatcmpl-7vOjBKjVnlRrneDVrqJg9nPsn8j2P',
    object: 'chat.completion',
    created: 1693914105,
    model: 'gpt-4-0613',
    choices: [ [Object] ],
    usage: { prompt_tokens: 86, completion_tokens: 229, total_tokens: 315 }
  },
  response: '1. A bee can see with great glee.\n' +
    '2. The kite takes flight in the bright light.\n' +
    "3. Mom is so neat, she doesn't like meat.\n" +
    "4. Do not cheat, it's not neat.\n" +
    '5. A mouse ran in the house, quiet as a little louse.\n' +
    '6. The rain on the pane is a bit of a pain.\n' +
    '7. Tom the cat sat on the mat.\n' +
    '8. She can feel the heat from her feet.\n' +
    '9. I meet Pete at the street.\n' +
    '10. We play all day in the hay.\n' +
    '11. They may stay and play all day.\n' +
    '12. He can read the bead on the lead.\n' +
    '13. I like to take a peak at the creek.\n' +
    '14. The flea has a plea for the bee.\n' +
    '15. The rose grows by the hose.\n' +
    '16. See that sheep asleep by the deep creek?\n' +
    '17. The green tree is free for a bee.\n' +
    '18. The goat is on the boat and it can float.\n' +
    "19. Jane fell in the well, let's ring the bell.\n" +
    '20. I like pie, high in the sky.\n'
}

```

## Generate simple sentences - do not constrain words, avoid names - GPT 3.5

```

start prompt to OpenAI {
  messages: [
    {
      role: 'system',
      content: 'You are an assistant that generates sentences for young kids to practice based on their needs. Return each sentence on a new line.  Do not add any extra punctuation around the sentence.  Avoid using proper names.  Instead use generic objects, articles, and pronouns.'
    },
    {
      role: 'user',
      content: 'Please give me 20 very simple sentences using long vowels and rhyming.  First grade level.'
    }
  ]
}
end prompt to OpenAI {
  chatCompletion: {
    id: 'chatcmpl-7vOmxPYl5DundIezwM4B9fHo3yB7B',
    object: 'chat.completion',
    created: 1693914339,
    model: 'gpt-3.5-turbo-0613',
    choices: [ [Object] ],
    usage: { prompt_tokens: 86, completion_tokens: 229, total_tokens: 315 }
  },
  response: '1. The sun is big and bright.\n' +
    '2. I like to ride my bike at night.\n' +
    '3. The kite flew high in the sky.\n' +
    '4. I ate an apple and felt so spry.\n' +
    '5. The goat likes to float in a boat.\n' +
    '6. The rose has a lovely scent and floats.\n' +
    '7. Birds chirp and sing in the spring.\n' +
    '8. The frog jumped with a joyful ring.\n' +
    '9. The mouse found a house to live.\n' +
    '10. The owl hooted as it took a dive.\n' +
    '11. The cow met a friend and said "hi".\n' +
    '12. The snail moved slowly as it passed by.\n' +
    '13. The train blew its horn and went "choo".\n' +
    '14. The bee buzzes as it collects dew.\n' +
    '15. The toad hopped on a lily pad and sat.\n' +
    '16. The moon shines bright just like a hat.\n' +
    '17. The rain fell softly and made a puddle.\n' +
    '18. The boat sailed smoothly without a muddle.\n' +
    '19. The bird flew across the sky and soared.\n' +
    '20. I saw a rainbow, and my heart roared.'
}
```
