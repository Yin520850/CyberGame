import {
  canAccessChapter,
  isStoryAtLeast
} from "../../src/game/chapter/progression";

describe("chapter progression", () => {
  test("blocks future chapters when story node is not reached", () => {
    expect(canAccessChapter("ch1", "ch1_start", "ch2")).toBe(false);
    expect(canAccessChapter("ch1", "ch1_start", "ch3")).toBe(false);
    expect(canAccessChapter("ch1", "ch1_start", "ch5")).toBe(false);
  });

  test("allows chapter access when completion gate is reached", () => {
    expect(canAccessChapter("ch2", "ch1_completed", "ch2")).toBe(true);
    expect(canAccessChapter("ch3", "ch2_completed", "ch4")).toBe(false);
    expect(canAccessChapter("ch4", "ch3_completed", "ch4")).toBe(true);
    expect(canAccessChapter("ch4", "ch4_completed", "ch5")).toBe(true);
  });

  test("supports level comparison fallback for unknown story node", () => {
    expect(isStoryAtLeast("unknown_node", "ch1_completed")).toBe(false);
  });
});
