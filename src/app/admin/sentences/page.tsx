"use client";

import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";
import { trpc } from "~/lib/trpc/client";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

import { AddSentenceForm } from "../../../components/sentences/AddSentenceForm";
import { EditSentenceForm } from "../../../components/sentences/EditSentenceForm";
import { useSentenceAdder } from "../../../hooks/useSentenceAdder";

export default function AdminSentences() {
  const utils = trpc.useContext();

  const { data: allSentences } =
    trpc.sentencesRouter.getAllSentences.useQuery();

  const {
    data: newSentences,
    refetch,
    isInitialLoading: isLoadingSentences,
  } = trpc.sentencesRouter.getNewSentencesForWords.useQuery([], {
    enabled: false,
  });

  const { handleAddSentences } = useSentenceAdder();

  const deleteSentenceMutation =
    trpc.sentencesRouter.deleteSentence.useMutation();

  const handleDeleteSentence = async (sentenceId: string) => {
    // do a confirm check
    const confirm = window.confirm(
      "Are you sure you want to delete this sentence?"
    );

    if (!confirm) {
      return;
    }

    await deleteSentenceMutation.mutateAsync({
      sentenceId,
    });

    // invalidate the query so that it will refetch
    await utils.sentencesRouter.getAllSentences.invalidate();
  };

  return (
    <div>
      <div>
        <h1>add sentence</h1>
        <AddSentenceForm />
      </div>

      <div>
        <h1>GPT create sentences</h1>
        <p>
          prompt = "Please give me 10 very simple sentences using long vowels,
          short vowels, and rhyming. First grade level.";
        </p>
        <Button onClick={() => refetch()} disabled={isLoadingSentences}>
          Generate sentences for words
          <Icons.add className="ml-2 h-5 w-5" />
        </Button>
        {isLoadingSentences && (
          <p>
            loading... <Icons.spinner className="ml-2 h-5 w-5 animate-spin" />
          </p>
        )}
        {!isLoadingSentences && newSentences?.length && (
          <div>
            <div>
              <Button onClick={() => handleAddSentences(newSentences)}>
                Add all sentences
                <Icons.add className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div>
              {newSentences?.map((sentence) => (
                <div
                  key={sentence}
                  className="flex items-center justify-between"
                >
                  <span>{sentence}</span>
                  <button
                    onClick={() => handleAddSentences([sentence])}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Icons.add className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        <h1>all sentences</h1>
        <ul className="space-y-2">
          {allSentences?.map((sentence) => (
            <li key={sentence.id} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span>{sentence.fullSentence}</span>
                <span className="text-sm text-gray-500">
                  {sentence.words.map((word) => word.word).join(", ")}
                </span>
              </div>
              <div>
                <Button
                  onClick={() => handleDeleteSentence(sentence.id)}
                  className="text-red-500 hover:text-red-700"
                  variant={"ghost"}
                >
                  <Icons.trash className="h-5 w-5" />
                </Button>

                <Dialog>
                  <DialogTrigger>
                    <Icons.pencil className="h-5 w-5" />
                  </DialogTrigger>
                  <DialogContent>
                    <EditSentenceForm
                      sentenceId={sentence.id}
                      originalFullSentence={sentence.fullSentence}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </li>
          ))}
          {allSentences?.length === 0 && <p>no sentences</p>}
        </ul>
      </div>
    </div>
  );
}
