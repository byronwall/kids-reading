import { create } from "zustand";

type SentenceCreatorStore = {
  isModalOpen: boolean;
  targetWords: string[];

  toggleModal: () => void;
  setModalOpen: (isOpen: boolean) => void;

  openWithTargetWords: (targetWords: string[]) => void;
};

export const useSentenceCreatorStore = create<SentenceCreatorStore>((set) => ({
  isModalOpen: false,
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  setModalOpen: (isOpen: boolean) => set(() => ({ isModalOpen: isOpen })),

  targetWords: [],
  openWithTargetWords: (targetWords: string[]) =>
    set(() => ({ isModalOpen: true, targetWords })),
}));
