import { chapterConfigs } from "../../src/game/config";

describe("chapter 2 config", () => {
  test("contains required clues and gates", () => {
    const ch2 = chapterConfigs.ch2;

    expect(ch2).toBeDefined();
    expect(ch2.clues.map((c) => c.id)).toEqual(
      expect.arrayContaining([
        "ch2_photo_1",
        "ch2_photo_2",
        "ch2_photo_3",
        "ch2_print_log",
        "ch2_filename_hint"
      ])
    );

    expect(ch2.gates.map((g) => g.id)).toEqual(
      expect.arrayContaining([
        "Gate_A_时间线工具解锁",
        "Gate_B_主推理解锁",
        "Gate_C_本章通过"
      ])
    );
  });
});
