import type { ChapterDefinition } from "../../types";

export const ch4Config: ChapterDefinition = {
  id: "ch4",
  title: "谁在制造误导",
  coreLocations: ["activity_room_pc", "group_chat", "storage_area"],
  sideLocations: ["lab_door"],
  clues: [
    {
      id: "ch4_login_log",
      name: "校园网登录记录",
      locationId: "activity_room_pc"
    },
    {
      id: "ch4_chat_full",
      name: "聊天记录完整版",
      locationId: "group_chat"
    },
    {
      id: "ch4_forum_draft",
      name: "论坛草稿纸",
      locationId: "storage_area"
    },
    {
      id: "ch4_filename_trace",
      name: "文件改名痕迹",
      locationId: "lab_door",
      hidden: true
    }
  ],
  gates: [
    {
      id: "Gate_A_证据板解锁",
      requiredClues: ["ch4_login_log", "ch4_chat_full"]
    },
    {
      id: "Gate_B_交叉验证解锁",
      requiredClues: [
        "ch4_login_log",
        "ch4_chat_full",
        "ch4_forum_draft",
        "ch4_filename_trace"
      ]
    },
    {
      id: "Gate_C_本章通过",
      requiredClues: [
        "ch4_login_log",
        "ch4_chat_full",
        "ch4_forum_draft",
        "ch4_filename_trace"
      ],
      requiredUsedClues: ["ch4_login_log", "ch4_forum_draft", "ch4_filename_trace"]
    }
  ]
};
