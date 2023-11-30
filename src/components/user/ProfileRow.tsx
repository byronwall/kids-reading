"use client";

import { Button } from "~/components/ui/button";
import { useActiveProfile } from "~/hooks/useActiveProfile";
import { cn } from "~/lib/utils";
import { type Profile } from "~/types/models";
import { useProfileMutations } from "~/hooks/useProfileMutations";

export function ProfileRow(props: { profile: Profile }) {
  const { profile } = props;

  const { handleUpdateProfile } = useProfileMutations();

  const { setActiveProfile, activeProfile } = useActiveProfile();

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

  const xxx = handlerFactory({
    fieldName: "name",
    promptMessage: "Enter new name",
  });

  const yyy = handlerFactory({
    fieldName: "minimumWordCount",
    promptMessage: "Enter new minimum word count",
    processFunc: (value) => parseInt(value),
  });

  const zzz = handlerFactory({
    fieldName: "maximumWordCount",
    promptMessage: "Enter new maximum word count",
    processFunc: (value) => parseInt(value),
  });

  const aaa = handlerFactory({
    fieldName: "sentenceThresholdForAward",
    promptMessage: "Enter new sentence threshold",
    processFunc: (value) => parseInt(value),
  });

  const bbb = handlerFactory({
    fieldName: "wordThresholdForAward",
    promptMessage: "Enter new word threshold",
    processFunc: (value) => parseInt(value),
  });

  return (
    <tr key={profile.id}>
      <td
        className={cn("cursor-pointer py-3 pl-3 pr-4 text-sm underline", {
          "bg-slate-400": profile.id === activeProfile?.id,
        })}
        onClick={xxx}
      >
        {profile.name}
      </td>
      <td
        className="cursor-pointer py-3 pl-3 pr-4 text-sm underline"
        onClick={yyy}
      >
        {profile.minimumWordCount}
      </td>
      <td
        className="cursor-pointer py-3 pl-3 pr-4 text-sm underline"
        onClick={zzz}
      >
        {profile.maximumWordCount}
      </td>

      <td
        className="cursor-pointer py-3 pl-3 pr-4 text-sm underline"
        onClick={aaa}
      >
        {profile.sentenceThresholdForAward}
      </td>

      <td
        className="cursor-pointer py-3 pl-3 pr-4 text-sm underline"
        onClick={bbb}
      >
        {profile.wordThresholdForAward}
      </td>

      <td className="py-3 pl-3 pr-4 text-sm">
        <Button
          type="button"
          onClick={() => {
            void setActiveProfile(profile);
          }}
          className="ml-2"
        >
          Set Active
        </Button>
      </td>
    </tr>
  );
}
