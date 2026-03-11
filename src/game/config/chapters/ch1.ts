import type { ChapterDefinition } from "../../types";

export const ch1Config: ChapterDefinition = {
  id: "ch1",
  title: "失控的匿名帖",
  coreLocations: ["activity_room", "teacher_office", "group_chat"],
  sideLocations: ["hall_board", "storage_area"],
  clues: [
    {
      id: "ch1_forum_shot",
      name: "论坛截图",
      locationId: "activity_room"
    },
    {
      id: "ch1_forum_export",
      name: "论坛导出页",
      locationId: "teacher_office"
    },
    {
      id: "ch1_chat_log",
      name: "群聊记录片段",
      locationId: "group_chat"
    },
    {
      id: "ch1_note_cipher",
      name: "周启明便签",
      locationId: "storage_area",
      hidden: true
    }
  ],
  gates: [
    {
      id: "Gate_A_调查解锁",
      requiredClues: ["ch1_forum_shot", "ch1_forum_export", "ch1_chat_log"]
    },
    {
      id: "Gate_B_本章通过",
      requiredClues: [],
      requiredUsedClues: ["ch1_forum_shot", "ch1_forum_export", "ch1_chat_log"]
    }
  ]
};
