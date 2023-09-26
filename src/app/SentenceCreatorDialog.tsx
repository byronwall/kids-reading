"use client";

import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { useSentenceCreatorStore } from "./_stores/sentenceCreatorStore";
import { SentenceCreatorForm } from "./SentenceCreatorForm";

export function SentenceCreatorDialog() {
  const isModalOpen = useSentenceCreatorStore((state) => state.isModalOpen);

  const toggleModal = useSentenceCreatorStore((state) => state.toggleModal);
  const setModalOpen = useSentenceCreatorStore((state) => state.setModalOpen);

  const targetWords = useSentenceCreatorStore((state) => state.targetWords);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleModal();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Sentence Creator Helper</DialogTitle>
            <DialogDescription>
              <SentenceCreatorForm initialWordTargets={targetWords} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
