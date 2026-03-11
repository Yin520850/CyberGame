import {
  createGameStore,
  GAME_STORE_STORAGE_KEY
} from "../../src/game/store/gameStore";

describe("gameStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("supports mode switching and chapter progression", () => {
    const store = createGameStore();

    expect(store.getState().mode).toBe("story");
    store.getState().setMode("investigation");
    expect(store.getState().mode).toBe("investigation");

    store.getState().advanceStoryNode("ch1_intro");
    expect(store.getState().storyNode).toBe("ch1_intro");
  });

  test("supports clue transitions and location unlock", () => {
    const store = createGameStore();

    store.getState().discoverClue("ch1_forum_shot");
    expect(store.getState().clueStates["ch1_forum_shot"]).toBe("discovered");

    store.getState().resolveClue("ch1_forum_shot");
    expect(store.getState().clueStates["ch1_forum_shot"]).toBe("resolved");

    store.getState().useClue("ch1_forum_shot");
    expect(store.getState().clueStates["ch1_forum_shot"]).toBe(
      "used_in_reasoning"
    );

    store.getState().unlockLocation("office");
    expect(store.getState().locationUnlocked.office).toBe(true);
  });

  test("loads persisted snapshot when creating store", () => {
    window.localStorage.setItem(
      GAME_STORE_STORAGE_KEY,
      JSON.stringify({
        mode: "investigation",
        currentChapterId: "ch4",
        storyNode: "ch3_completed",
        clueStates: { ch4_login_log: "resolved" },
        locationUnlocked: { lab_door: true }
      })
    );

    const store = createGameStore();

    expect(store.getState().mode).toBe("investigation");
    expect(store.getState().currentChapterId).toBe("ch4");
    expect(store.getState().storyNode).toBe("ch3_completed");
    expect(store.getState().clueStates.ch4_login_log).toBe("resolved");
    expect(store.getState().locationUnlocked.lab_door).toBe(true);
  });

  test("writes latest snapshot to localStorage and resets persisted state", () => {
    const store = createGameStore();

    store.getState().setMode("investigation");
    store.getState().setChapter("ch2");
    store.getState().advanceStoryNode("ch1_completed");
    store.getState().discoverClue("ch2_photo_1");

    const persistedAfterUpdate = window.localStorage.getItem(
      GAME_STORE_STORAGE_KEY
    );
    expect(persistedAfterUpdate).not.toBeNull();
    expect(JSON.parse(persistedAfterUpdate ?? "{}")).toEqual(
      expect.objectContaining({
        mode: "investigation",
        currentChapterId: "ch2",
        storyNode: "ch1_completed",
        clueStates: { ch2_photo_1: "discovered" }
      })
    );

    store.getState().reset();

    const persistedAfterReset = window.localStorage.getItem(
      GAME_STORE_STORAGE_KEY
    );
    expect(JSON.parse(persistedAfterReset ?? "{}")).toEqual(
      expect.objectContaining({
        mode: "story",
        currentChapterId: "ch1",
        storyNode: "ch1_start",
        clueStates: {}
      })
    );
  });
});
