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
  reset: () => void;
}

type PersistedGameState = Pick<
  GameStoreState,
  "mode" | "currentChapterId" | "storyNode" | "clueStates" | "locationUnlocked"
>;

export const GAME_STORE_STORAGE_KEY = "cybergame_store_v1";

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

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isClueStateValue(value: unknown): value is ClueState {
  return (
    value === "undiscovered" ||
    value === "discovered" ||
    value === "resolved" ||
    value === "used_in_reasoning"
  );
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function pickPersistedState(state: GameStoreState): PersistedGameState {
  return {
    mode: state.mode,
    currentChapterId: state.currentChapterId,
    storyNode: state.storyNode,
    clueStates: state.clueStates,
    locationUnlocked: state.locationUnlocked
  };
}

function persistState(state: PersistedGameState): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(GAME_STORE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore persistence failures; gameplay should continue.
  }
}

function readPersistedState(): Partial<typeof initialState> {
  const storage = getStorage();
  if (!storage) {
    return {};
  }

  try {
    const raw = storage.getItem(GAME_STORE_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isObjectRecord(parsed)) {
      return {};
    }

    const persistedState: Partial<typeof initialState> = {};

    if (parsed.mode === "story" || parsed.mode === "investigation") {
      persistedState.mode = parsed.mode;
    }
    if (typeof parsed.currentChapterId === "string") {
      persistedState.currentChapterId = parsed.currentChapterId;
    }
    if (typeof parsed.storyNode === "string") {
      persistedState.storyNode = parsed.storyNode;
    }
    if (isObjectRecord(parsed.clueStates)) {
      const clueStates: Record<string, ClueState> = {};
      Object.entries(parsed.clueStates).forEach(([clueId, clueState]) => {
        if (isClueStateValue(clueState)) {
          clueStates[clueId] = clueState;
        }
      });
      persistedState.clueStates = clueStates;
    }
    if (isObjectRecord(parsed.locationUnlocked)) {
      const locationUnlocked: Record<string, boolean> = {};
      Object.entries(parsed.locationUnlocked).forEach(([locationId, unlocked]) => {
        if (typeof unlocked === "boolean") {
          locationUnlocked[locationId] = unlocked;
        }
      });
      persistedState.locationUnlocked = locationUnlocked;
    }

    return persistedState;
  } catch {
    return {};
  }
}

export function createGameStore() {
  const hydratedState = { ...initialState, ...readPersistedState() };

  return createStore<GameStoreState>()((set, get) => ({
    ...hydratedState,
    setMode: (mode) => {
      set({ mode });
      persistState(pickPersistedState(get()));
    },
    setChapter: (currentChapterId) => {
      set({ currentChapterId });
      persistState(pickPersistedState(get()));
    },
    advanceStoryNode: (storyNode) => {
      set({ storyNode });
      persistState(pickPersistedState(get()));
    },
    unlockLocation: (locationId) =>
      set((state) => {
        const nextState = {
          locationUnlocked: { ...state.locationUnlocked, [locationId]: true }
        };
        persistState(
          pickPersistedState({
            ...state,
            ...nextState
          } as GameStoreState)
        );
        return nextState;
      }),
    discoverClue: (clueId) =>
      set((state) => {
        const nextState = {
          clueStates: {
            ...state.clueStates,
            [clueId]: transitionIfNeeded(state.clueStates, clueId, "discovered")
          }
        };
        persistState(
          pickPersistedState({
            ...state,
            ...nextState
          } as GameStoreState)
        );
        return nextState;
      }),
    resolveClue: (clueId) =>
      set((state) => {
        const nextState = {
          clueStates: {
            ...state.clueStates,
            [clueId]: transitionIfNeeded(state.clueStates, clueId, "resolved")
          }
        };
        persistState(
          pickPersistedState({
            ...state,
            ...nextState
          } as GameStoreState)
        );
        return nextState;
      }),
    useClue: (clueId) =>
      set((state) => {
        const nextState = {
          clueStates: {
            ...state.clueStates,
            [clueId]: transitionIfNeeded(
              state.clueStates,
              clueId,
              "used_in_reasoning"
            )
          }
        };
        persistState(
          pickPersistedState({
            ...state,
            ...nextState
          } as GameStoreState)
        );
        return nextState;
      }),
    reset: () => {
      set({ ...initialState });
      persistState({
        ...initialState
      });
    }
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
