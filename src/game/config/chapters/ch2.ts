import type { ChapterDefinition } from "../../types";

export const ch2Config: ChapterDefinition = {
  id: "ch2",
  title: "照片里的路线",
  coreLocations: [
    "photo_corner",
    "school_gate",
    "convenience_store",
    "street_crossing"
  ],
  sideLocations: ["activity_room_pc", "lab_door"],
  clues: [
    {
      id: "ch2_photo_1",
      name: "照片一(18:07校门)",
      locationId: "photo_corner"
    },
    {
      id: "ch2_photo_2",
      name: "照片二(18:21便利店)",
      locationId: "convenience_store"
    },
    {
      id: "ch2_photo_3",
      name: "照片三(18:39路口)",
      locationId: "street_crossing"
    },
    {
      id: "ch2_print_log",
      name: "机房打印记录(19:10)",
      locationId: "lab_door"
    },
    {
      id: "ch2_filename_hint",
      name: "异常文件名",
      locationId: "activity_room_pc",
      hidden: true
    }
  ],
  gates: [
    {
      id: "Gate_A_时间线工具解锁",
      requiredClues: ["ch2_photo_1", "ch2_photo_2"]
    },
    {
      id: "Gate_B_主推理解锁",
      requiredClues: ["ch2_photo_1", "ch2_photo_2", "ch2_photo_3", "ch2_print_log"]
    },
    {
      id: "Gate_C_本章通过",
      requiredClues: ["ch2_photo_1", "ch2_photo_2", "ch2_photo_3", "ch2_print_log"],
      requiredResolvedClues: ["ch2_filename_hint"]
    }
  ]
};
