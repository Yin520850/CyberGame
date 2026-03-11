import type { ClueState } from "../types";
import { isStoryAtLeast } from "./progression";

export interface ChapterTaskItem {
  id: string;
  text: string;
  done: boolean;
}

export function isDiscovered(state: ClueState | undefined): boolean {
  return !!state && state !== "undiscovered";
}

export function buildTaskItems(
  chapterId: string,
  clueStates: Record<string, ClueState>,
  storyNode: string
): ChapterTaskItem[] {
  if (chapterId === "ch1") {
    return [
      {
        id: "ch1-a",
        text: "收集三条主线索",
        done:
          isDiscovered(clueStates.ch1_forum_shot) &&
          isDiscovered(clueStates.ch1_forum_export) &&
          isDiscovered(clueStates.ch1_chat_log)
      },
      {
        id: "ch1-b",
        text: "完成证据判断",
        done: isStoryAtLeast(storyNode, "ch1_completed")
      }
    ];
  }

  if (chapterId === "ch2") {
    return [
      {
        id: "ch2-a",
        text: "收集三张照片与打印记录",
        done:
          isDiscovered(clueStates.ch2_photo_1) &&
          isDiscovered(clueStates.ch2_photo_2) &&
          isDiscovered(clueStates.ch2_photo_3) &&
          isDiscovered(clueStates.ch2_print_log)
      },
      {
        id: "ch2-b",
        text: "完成可行性判断",
        done: isStoryAtLeast(storyNode, "ch2_completed")
      }
    ];
  }

  if (chapterId === "ch3") {
    return [
      {
        id: "ch3-a",
        text: "收集便签、海报提示与储物柜纸袋",
        done:
          isDiscovered(clueStates.ch3_cipher_note) &&
          isDiscovered(clueStates.ch3_poster_hint) &&
          isDiscovered(clueStates.ch3_locker_file)
      },
      {
        id: "ch3-b",
        text: "完成线索溯源",
        done: isStoryAtLeast(storyNode, "ch3_completed")
      }
    ];
  }

  if (chapterId === "ch4") {
    return [
      {
        id: "ch4-a",
        text: "收集登录记录、聊天完整版、草稿纸与改名痕迹",
        done:
          isDiscovered(clueStates.ch4_login_log) &&
          isDiscovered(clueStates.ch4_chat_full) &&
          isDiscovered(clueStates.ch4_forum_draft) &&
          isDiscovered(clueStates.ch4_filename_trace)
      },
      {
        id: "ch4-b",
        text: "完成交叉验证",
        done: isStoryAtLeast(storyNode, "ch4_completed")
      }
    ];
  }

  return [
    {
      id: "ch5-a",
      text: "收集口供、动机说明与责任方案",
      done:
        isDiscovered(clueStates.ch5_confession) &&
        isDiscovered(clueStates.ch5_motive_note) &&
        isDiscovered(clueStates.ch5_responsibility_plan)
    },
    {
      id: "ch5-b",
      text: "完成结案报告",
      done: isStoryAtLeast(storyNode, "ch5_completed")
    }
  ];
}
