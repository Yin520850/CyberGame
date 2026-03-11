import { chapterConfigs } from "../../src/game/config";

describe("chapter 5 config", () => {
  test("contains required clues and gates", () => {
    const ch5 = chapterConfigs.ch5;

    expect(ch5).toBeDefined();
    expect(ch5.clues.map((c) => c.id)).toEqual(
      expect.arrayContaining([
        "ch5_confession",
        "ch5_motive_note",
        "ch5_responsibility_plan"
      ])
    );

    expect(ch5.gates.map((g) => g.id)).toEqual(
      expect.arrayContaining(["Gate_A_结案解锁", "Gate_B_本章通过"])
    );
  });
});
