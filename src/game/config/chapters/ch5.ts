import type { ChapterDefinition } from "../../types";

export const ch5Config: ChapterDefinition = {
  id: "ch5",
  title: "夜鸦现身",
  coreLocations: ["lab_door", "teacher_office", "activity_room"],
  sideLocations: [],
  clues: [
    {
      id: "ch5_confession",
      name: "高远口供记录",
      locationId: "lab_door"
    },
    {
      id: "ch5_motive_note",
      name: "动机与误导说明",
      locationId: "teacher_office"
    },
    {
      id: "ch5_responsibility_plan",
      name: "修复与责任方案",
      locationId: "activity_room"
    }
  ],
  gates: [
    {
      id: "Gate_A_结案解锁",
      requiredClues: ["ch5_confession", "ch5_motive_note", "ch5_responsibility_plan"]
    },
    {
      id: "Gate_B_本章通过",
      requiredClues: ["ch5_confession", "ch5_motive_note", "ch5_responsibility_plan"],
      requiredUsedClues: ["ch5_confession", "ch5_motive_note", "ch5_responsibility_plan"]
    }
  ]
};
