import { chapterConfigs } from "../../src/game/config";

describe("chapter 4 config", () => {
  test("contains required clues and gates", () => {
    const ch4 = chapterConfigs.ch4;

    expect(ch4).toBeDefined();
    expect(ch4.clues.map((c) => c.id)).toEqual(
      expect.arrayContaining([
        "ch4_login_log",
        "ch4_chat_full",
        "ch4_forum_draft",
        "ch4_filename_trace"
      ])
    );

    expect(ch4.gates.map((g) => g.id)).toEqual(
      expect.arrayContaining([
        "Gate_A_证据板解锁",
        "Gate_B_交叉验证解锁",
        "Gate_C_本章通过"
      ])
    );
  });
});
