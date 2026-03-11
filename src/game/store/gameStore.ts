import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { advanceClueState } from "../engine/clues";
import type { ClueState, GameMode } from "../types";

interface GameStoreState {
  mode: GameMode;
  currentChapterId: string;
  storyNode: string;
  clueStates: Record<string, ClueState>;
  locationUnlocked: Record<string, boolean>;
  setMode: (mode: GameMode) => void;
  setChapter: (chapterId: string) => void;
  advanceStoryNode: (storyNode: string) => void;
  unlockLocation: (locationId: string) => void;
  discoverClue: (clueId: string) => void;
  resolveClue: (clueId: string) => void;
  useClue: (clueId: string) => void;
}

const CLUE_LEVEL: Record<ClueState, number> = {
  undiscovered: 0,
  discovered: 1,
  resolved: 2,
  used_in_reasoning: 3
};

function getClueState(
  clueStates: Record<string, ClueState>,
  clueId: string
): ClueState {
  return clueStates[clueId] ?? "undiscovered";
}

function transitionIfNeeded(
  clueStates: Record<string, ClueState>,
  clueId: string,
  target: "discovered" | "resolved" | "used_in_reasoning"
): ClueState {
  const current = getClueState(clueStates, clueId);
  if (CLUE_LEVEL[current] >= CLUE_LEVEL[target]) {
    return current;
  }

  if (target === "discovered") {
    return advanceClueState(current, "discover");
  }
  if (target === "resolved") {
    const discovered =
      current === "undiscovered"
        ? advanceClueState(current, "discover")
        : current;
    return discovered === "discovered"
      ? advanceClueState(discovered, "resolve")
      : discovered;
  }

  let state = current;
  if (state === "undiscovered") {
    state = advanceClueState(state, "discover");
  }
  if (state === "discovered") {
    state = advanceClueState(state, "resolve");
  }
  return state === "resolved" ? advanceClueState(state, "use") : state;
}

const initialState = {
  mode: "story" as GameMode,
  currentChapterId: "ch1",
  storyNode: "ch1_start",
  clueStates: {} as Record<string, ClueState>,
  locationUnlocked: {} as Record<string, boolean>
};

export function createGameStore() {
  return createStore<GameStoreState>()((set) => ({
    ...initialState,
    setMode: (mode) => set({ mode }),
    setChapter: (currentChapterId) => set({ currentChapterId }),
    advanceStoryNode: (storyNode) => set({ storyNode }),
    unlockLocation: (locationId) =>
      set((state) => ({
        locationUnlocked: { ...state.locationUnlocked, [locationId]: true }
      })),
    discoverClue: (clueId) =>
      set((state) => ({
        clueStates: {
          ...state.clueStates,
          [clueId]: transitionIfNeeded(state.clueStates, clueId, "discovered")
        }
      })),
    resolveClue: (clueId) =>
      set((state) => ({
        clueStates: {
          ...state.clueStates,
          [clueId]: transitionIfNeeded(state.clueStates, clueId, "resolved")
        }
      })),
    useClue: (clueId) =>
      set((state) => ({
        clueStates: {
          ...state.clueStates,
          [clueId]: transitionIfNeeded(
            state.clueStates,
            clueId,
            "used_in_reasoning"
          )
        }
      }))
  }));
}

export const gameStore = createGameStore();

export function useBoundGameStore<T>(
  selector: (state: GameStoreState) => T
): T {
  return useStore(gameStore, selector);
}

export const useGameStore = useBoundGameStore;

export type { GameStoreState };
