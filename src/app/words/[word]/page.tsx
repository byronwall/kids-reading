"use client";

import { useParams } from "next/navigation";

export default function WordPage() {
  const params = useParams();

  const word = params?.word ?? "";

  const phonicsInfo = [
    { label: "Syllables", value: "2" },
    { label: "Phonemes", value: "3" },
    { label: "Examples", value: "Physics, Tonic, Sonic" },
  ];

  const wordInfo = {
    title: "Word: Cat",
    pronunciation: "Phonetic Pronunciation: /kæt/",
    definition:
      "A small domesticated carnivorous mammal with soft fur, a short snout, and retractable claws.",
    examples: [
      "The cat sat on the mat.",
      "I fed my cat some tuna.",
      "The cat chased the mouse.",
    ],
    relatedPhonics: [
      "The 'c' in 'cat' makes the /k/ sound.",
      "The 'a' in 'cat' makes the /æ/ sound.",
      "The 't' in 'cat' makes the /t/ sound.",
    ],
  };

  const renderIcon = () => (
    <svg
      className="mr-2 inline-block h-4 w-4"
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <div>
      <h1>Word Page</h1>
      <p>word: {word}</p>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Phonics
              </h2>
              <p className="max-w-[600px] text-zinc-500 dark:text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Pronounced as /fɒnɪks/
              </p>
              <ul className="grid gap-2 py-4">
                {phonicsInfo.map((info) => (
                  <li key={info.label}>
                    {renderIcon()}
                    {info.label}: {info.value}
                  </li>
                ))}
              </ul>
              <p className="max-w-[600px] text-zinc-500 dark:text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Phonics is a method of teaching reading and spelling that
                stresses symbol-sound relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-4xl font-semibold">{wordInfo.title}</h1>
          <p className="mb-4 text-lg font-semibold text-gray-500">
            {wordInfo.pronunciation}
          </p>
          <hr className="mb-6" />
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-semibold">Definition:</h2>
            <p className="text-lg text-gray-700">{wordInfo.definition}</p>
          </div>
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-semibold">Examples:</h2>
            <ul className="ml-5 list-disc text-lg text-gray-700">
              {wordInfo.examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-semibold">
              Related Phonics Rules:
            </h2>
            <ul className="ml-5 list-disc text-lg text-gray-700">
              {wordInfo.relatedPhonics.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
