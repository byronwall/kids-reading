"use client";

import { Button } from "~/components/ui/button";
import { useActiveProfile } from "~/hooks/useActiveProfile";
import { cn } from "~/lib/utils";
import { type Profile } from "~/types/models";
import { useProfileMutations } from "~/hooks/useProfileMutations";

const editableCellClass =
  "py-1.5 pl-3 pr-4 align-middle text-sm [&:has([role=checkbox])]:pr-0";

function EditableCell({
  value,
  title,
  onEdit,
}: {
  value: React.ReactNode;
  title: string;
  onEdit: () => void;
}) {
  return (
    <td className={editableCellClass}>
      <button
        type="button"
        onClick={onEdit}
        title={title}
        className="w-full rounded px-1 py-1 text-left underline decoration-stone-300 decoration-dotted underline-offset-4 transition-colors hover:bg-amber-50 hover:text-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
      >
        {value}
      </button>
    </td>
  );
}

export function ProfileRow(props: { profile: Profile }) {
  const { profile } = props;

  const { handleUpdateProfile } = useProfileMutations();

  const { setActiveProfile, activeProfile } = useActiveProfile();

  const isActive = profile.id === activeProfile?.id;

  type HandlerFactory<K extends keyof Profile> = {
    fieldName: K;
    promptMessage: string;
    processFunc?: (value: string) => Profile[K];
  };

  const handlerFactory = <K extends keyof Profile>(
    options: HandlerFactory<K>
  ) => {
    const { fieldName, promptMessage, processFunc } = options;

    return () => {
      const newValue = prompt(promptMessage, String(profile[fieldName]));
      if (newValue) {
        void handleUpdateProfile(profile.id, {
          [fieldName]: processFunc ? processFunc(newValue) : newValue,
        });
      }
    };
  };

  const editName = handlerFactory({
    fieldName: "name",
    promptMessage: "Enter new name",
  });

  const editMinimumWordCount = handlerFactory({
    fieldName: "minimumWordCount",
    promptMessage: "Enter new minimum word count",
    processFunc: (value) => parseInt(value),
  });

  const editMaximumWordCount = handlerFactory({
    fieldName: "maximumWordCount",
    promptMessage: "Enter new maximum word count",
    processFunc: (value) => parseInt(value),
  });

  const editSentenceThreshold = handlerFactory({
    fieldName: "sentenceThresholdForAward",
    promptMessage: "Enter new sentence threshold",
    processFunc: (value) => parseInt(value),
  });

  const editWordThreshold = handlerFactory({
    fieldName: "wordThresholdForAward",
    promptMessage: "Enter new word threshold",
    processFunc: (value) => parseInt(value),
  });

  const editConfettiTarget = handlerFactory({
    fieldName: "confettiWordTarget",
    promptMessage: "Enter new confetti word target",
    processFunc: (value) => parseInt(value),
  });

  return (
    <tr
      key={profile.id}
      className={cn(
        "border-b transition-colors",
        isActive ? "bg-green-50/80" : "hover:bg-stone-50"
      )}
    >
      <EditableCell
        value={
          <span className="font-medium">
            {profile.name}
            {isActive && (
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 no-underline">
                Active
              </span>
            )}
          </span>
        }
        title="Click to rename this learner"
        onEdit={editName}
      />
      <EditableCell
        value={profile.minimumWordCount}
        title="Click to change the minimum word count"
        onEdit={editMinimumWordCount}
      />
      <EditableCell
        value={profile.maximumWordCount}
        title="Click to change the maximum word count"
        onEdit={editMaximumWordCount}
      />
      <EditableCell
        value={profile.sentenceThresholdForAward}
        title="Click to change the sentence award threshold"
        onEdit={editSentenceThreshold}
      />
      <EditableCell
        value={profile.wordThresholdForAward}
        title="Click to change the word award threshold"
        onEdit={editWordThreshold}
      />
      <EditableCell
        value={profile.confettiWordTarget}
        title="Click to change the confetti word target"
        onEdit={editConfettiTarget}
      />
      <td className="py-3 pl-3 pr-4 text-sm">
        {isActive ? (
          <span className="text-xs font-medium text-green-800">In use</span>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={() => {
              void setActiveProfile(profile);
            }}
            className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
          >
            Set Active
          </Button>
        )}
      </td>
    </tr>
  );
}
