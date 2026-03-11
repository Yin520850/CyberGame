import type { ChapterDefinition } from "../../types";

export const ch3Config: ChapterDefinition = {
  id: "ch3",
  title: "神秘便签与隐藏信息",
  coreLocations: ["activity_room", "hall_board", "storage_area"],
  sideLocations: ["lab_door"],
  clues: [
    {
      id: "ch3_cipher_note",
      name: "凯撒便签(NLIDQJ)",
      locationId: "activity_room"
    },
    {
      id: "ch3_poster_hint",
      name: "海报角落箭头提示",
      locationId: "hall_board"
    },
    {
      id: "ch3_locker_file",
      name: "储物柜纸袋",
      locationId: "storage_area"
    },
    {
      id: "ch3_old_draft",
      name: "旧创意草图署名",
      locationId: "lab_door",
      hidden: true
    }
  ],
  gates: [
    {
      id: "Gate_A_解密台解锁",
      requiredClues: ["ch3_cipher_note", "ch3_poster_hint"]
    },
    {
      id: "Gate_B_主推理解锁",
      requiredClues: ["ch3_cipher_note", "ch3_poster_hint", "ch3_locker_file"]
    },
    {
      id: "Gate_C_本章通过",
      requiredClues: ["ch3_cipher_note", "ch3_poster_hint", "ch3_locker_file"],
      requiredResolvedClues: ["ch3_old_draft"]
    }
  ]
};
