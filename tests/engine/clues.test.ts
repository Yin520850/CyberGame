import { advanceClueState } from "../../src/game/engine/clues";
import type { ClueState } from "../../src/game/types";

describe("advanceClueState", () => {
  test("allows legal forward transitions", () => {
    let current: ClueState = "undiscovered";
    current = advanceClueState(current, "discover");
    expect(current).toBe("discovered");

    current = advanceClueState(current, "resolve");
    expect(current).toBe("resolved");

    current = advanceClueState(current, "use");
    expect(current).toBe("used_in_reasoning");
  });

  test("blocks illegal jump", () => {
    expect(() => advanceClueState("undiscovered", "resolve")).toThrow(
      "Illegal clue transition"
    );
  });
});
