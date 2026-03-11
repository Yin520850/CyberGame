import type { GameStoreState } from "./gameStore";

export const selectMode = (state: GameStoreState) => state.mode;
export const selectStoryNode = (state: GameStoreState) => state.storyNode;
export const selectChapter = (state: GameStoreState) => state.currentChapterId;
export const selectClueState =
  (clueId: string) =>
  (state: GameStoreState): string =>
    state.clueStates[clueId] ?? "undiscovered";
