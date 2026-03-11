import { evaluateGate, type GateSnapshot } from "../../src/game/engine/gates";
import type { ChapterGateDefinition } from "../../src/game/types";

const ch1GateA: ChapterGateDefinition = {
  id: "Gate_A_调查解锁",
  requiredClues: ["ch1_forum_shot", "ch1_forum_export", "ch1_chat_log"]
};

const ch1GateB: ChapterGateDefinition = {
  id: "Gate_B_本章通过",
  requiredClues: [],
  requiredUsedClues: ["ch1_forum_shot", "ch1_forum_export", "ch1_chat_log"]
};

const ch2GateC: ChapterGateDefinition = {
  id: "Gate_C_本章通过",
  requiredClues: ["ch2_photo_1", "ch2_photo_2", "ch2_photo_3", "ch2_print_log"],
  requiredResolvedClues: ["ch2_filename_hint"]
};

describe("evaluateGate", () => {
  test("passes when all required clues are discovered", () => {
    const snapshot: GateSnapshot = {
      clueStates: {
        ch1_forum_shot: "discovered",
        ch1_forum_export: "resolved",
        ch1_chat_log: "used_in_reasoning"
      }
    };

    expect(evaluateGate(ch1GateA, snapshot)).toBe(true);
  });

  test("fails when required used clues are missing", () => {
    const snapshot: GateSnapshot = {
      clueStates: {
        ch1_forum_shot: "used_in_reasoning",
        ch1_forum_export: "used_in_reasoning",
        ch1_chat_log: "resolved"
      }
    };

    expect(evaluateGate(ch1GateB, snapshot)).toBe(false);
  });

  test("passes mixed requirement gate for chapter 2", () => {
    const snapshot: GateSnapshot = {
      clueStates: {
        ch2_photo_1: "used_in_reasoning",
        ch2_photo_2: "resolved",
        ch2_photo_3: "discovered",
        ch2_print_log: "resolved",
        ch2_filename_hint: "resolved"
      }
    };

    expect(evaluateGate(ch2GateC, snapshot)).toBe(true);
  });
});
