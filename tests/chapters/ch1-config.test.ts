import { chapterConfigs } from "../../src/game/config";

describe("chapter 1 config", () => {
  test("contains required clues and gates", () => {
    const ch1 = chapterConfigs.ch1;

    expect(ch1).toBeDefined();
    expect(ch1.clues).toHaveLength(4);
    expect(ch1.clues.map((c) => c.id)).toEqual(
      expect.arrayContaining([
        "ch1_forum_shot",
        "ch1_forum_export",
        "ch1_chat_log",
        "ch1_note_cipher"
      ])
    );

    expect(ch1.gates.map((g) => g.id)).toEqual(
      expect.arrayContaining(["Gate_A_调查解锁", "Gate_B_本章通过"])
    );
  });
});
