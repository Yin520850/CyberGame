import bgCh1 from "../../assets/gal/bg-ch1.svg";
import bgCh2 from "../../assets/gal/bg-ch2.svg";
import bgCh3 from "../../assets/gal/bg-ch3.svg";
import bgCh4 from "../../assets/gal/bg-ch4.svg";
import bgCh5 from "../../assets/gal/bg-ch5.svg";
import cgCh3 from "../../assets/gal/cg-ch3.svg";
import cgFinal from "../../assets/gal/cg-final.svg";
import charChenWorried from "../../assets/gal/char-chen-worried.svg";
import charGaoAnxious from "../../assets/gal/char-gao-anxious.svg";
import charLinNeutral from "../../assets/gal/char-lin-neutral.svg";
import charLinSerious from "../../assets/gal/char-lin-serious.svg";

export interface SceneCharacter {
  name: string;
  sprite: string;
  expression: string;
  side: "left" | "right";
}

export interface SceneFrame {
  stageTitle: string;
  chapterSubtitle: string;
  dialogueSpeaker: string;
  dialogueLine: string;
  background: string;
  leftCharacter?: SceneCharacter;
  rightCharacter?: SceneCharacter;
}

export interface CGEntry {
  id: "cg_ch3" | "cg_final";
  title: string;
  unlockNode: string;
  previewImage: string;
}

const SCENE_BACKGROUND: Record<string, string> = {
  ch1: bgCh1,
  ch2: bgCh2,
  ch3: bgCh3,
  ch4: bgCh4,
  ch5: bgCh5
};

const SCENE_TITLE: Record<string, string> = {
  ch1: "匿名帖疑云",
  ch2: "时间链还原",
  ch3: "误导线索反转",
  ch4: "证据交叉验证",
  ch5: "结案与修复"
};

export function getSceneFrame(chapterId: string, storyNode: string): SceneFrame {
  if (chapterId === "ch5") {
    return {
      stageTitle: SCENE_TITLE[chapterId],
      chapterSubtitle: "Final Act",
      dialogueSpeaker: "林警官",
      dialogueLine:
        storyNode === "ch5_completed"
          ? "案件到此收束，接下来是公开说明与修复执行。"
          : "最后一步，确认事实、误导行为与责任方案。",
      background: SCENE_BACKGROUND[chapterId],
      leftCharacter: {
        name: "林警官",
        sprite: storyNode === "ch5_completed" ? charLinNeutral : charLinSerious,
        expression: storyNode === "ch5_completed" ? "平静" : "严肃",
        side: "left"
      },
      rightCharacter: {
        name: "高远",
        sprite: charGaoAnxious,
        expression: "紧张",
        side: "right"
      }
    };
  }

  if (chapterId === "ch4") {
    return {
      stageTitle: SCENE_TITLE[chapterId],
      chapterSubtitle: "Cross Check",
      dialogueSpeaker: "林警官",
      dialogueLine: "把时间、文本和操作轨迹放在同一张证据链上。",
      background: SCENE_BACKGROUND[chapterId],
      leftCharacter: {
        name: "林警官",
        sprite: charLinSerious,
        expression: "审问",
        side: "left"
      },
      rightCharacter: {
        name: "陈小北",
        sprite: charChenWorried,
        expression: "焦虑",
        side: "right"
      }
    };
  }

  if (chapterId === "ch3") {
    return {
      stageTitle: SCENE_TITLE[chapterId],
      chapterSubtitle: "Cipher Break",
      dialogueSpeaker: "陈小北",
      dialogueLine: "便签和海报都在指向同一个误导点，我们被带节奏了。",
      background: SCENE_BACKGROUND[chapterId],
      leftCharacter: {
        name: "林警官",
        sprite: charLinNeutral,
        expression: "观察",
        side: "left"
      },
      rightCharacter: {
        name: "陈小北",
        sprite: charChenWorried,
        expression: "疑惑",
        side: "right"
      }
    };
  }

  if (chapterId === "ch2") {
    return {
      stageTitle: SCENE_TITLE[chapterId],
      chapterSubtitle: "Timeline",
      dialogueSpeaker: "林警官",
      dialogueLine: "时间线会说真话，先把每一个时间点钉住。",
      background: SCENE_BACKGROUND[chapterId],
      leftCharacter: {
        name: "林警官",
        sprite: charLinNeutral,
        expression: "冷静",
        side: "left"
      }
    };
  }

  return {
    stageTitle: SCENE_TITLE.ch1,
    chapterSubtitle: "Opening",
    dialogueSpeaker: "林警官",
    dialogueLine: "别急着下结论，我们先把证据完整度做出来。",
    background: SCENE_BACKGROUND.ch1,
    leftCharacter: {
      name: "林警官",
      sprite: charLinNeutral,
      expression: "中立",
      side: "left"
    },
    rightCharacter: {
      name: "陈小北",
      sprite: charChenWorried,
      expression: "不安",
      side: "right"
    }
  };
}

export const CG_ENTRIES: CGEntry[] = [
  {
    id: "cg_ch3",
    title: "第3章CG",
    unlockNode: "ch3_completed",
    previewImage: cgCh3
  },
  {
    id: "cg_final",
    title: "终章CG",
    unlockNode: "ch5_completed",
    previewImage: cgFinal
  }
];
