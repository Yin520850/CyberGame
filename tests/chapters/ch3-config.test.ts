import { chapterConfigs } from "../../src/game/config";

describe("chapter 3 config", () => {
  test("contains required clues and gates", () => {
    const ch3 = chapterConfigs.ch3;

    expect(ch3).toBeDefined();
    expect(ch3.clues.map((c) => c.id)).toEqual(
      expect.arrayContaining([
        "ch3_cipher_note",
        "ch3_poster_hint",
        "ch3_locker_file",
        "ch3_old_draft"
      ])
    );

    expect(ch3.gates.map((g) => g.id)).toEqual(
      expect.arrayContaining([
        "Gate_A_解密台解锁",
        "Gate_B_主推理解锁",
        "Gate_C_本章通过"
      ])
    );
  });
});
