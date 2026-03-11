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

const ch4GateB: ChapterGateDefinition = {
  id: "Gate_B_交叉验证解锁",
  requiredClues: [
    "ch4_login_log",
    "ch4_chat_full",
    "ch4_forum_draft",
    "ch4_filename_trace"
  ]
};

const ch5GateA: ChapterGateDefinition = {
  id: "Gate_A_结案解锁",
  requiredClues: ["ch5_confession", "ch5_motive_note", "ch5_responsibility_plan"]
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

  test("fails ch4 verification gate when one clue is still undiscovered", () => {
    const snapshot: GateSnapshot = {
      clueStates: {
        ch4_login_log: "discovered",
        ch4_chat_full: "resolved",
        ch4_forum_draft: "used_in_reasoning",
        ch4_filename_trace: "undiscovered"
      }
    };

    expect(evaluateGate(ch4GateB, snapshot)).toBe(false);
  });

  test("passes ch5 report gate when three key clues are discovered", () => {
    const snapshot: GateSnapshot = {
      clueStates: {
        ch5_confession: "discovered",
        ch5_motive_note: "resolved",
        ch5_responsibility_plan: "used_in_reasoning"
      }
    };

    expect(evaluateGate(ch5GateA, snapshot)).toBe(true);
  });
});
