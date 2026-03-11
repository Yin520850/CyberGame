import { createGameStore } from "../../src/game/store/gameStore";

describe("gameStore", () => {
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
});
