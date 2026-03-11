import type { ChapterId } from "./progression";

interface QuizConfig {
  title: string;
  prompt: string;
  reasons?: string[];
  correctReasons: Set<string>;
  unlockGateId: string;
  lockedLabel: string;
  unlockedLabel: string;
  incompleteMessage: string;
  successMessage: string;
  completionStoryNode: string;
  nextChapterId?: ChapterId;
  resolveClues: string[];
  useClues: string[];
}

const CH2_REASONING_OPTIONS = [
  "18:39 仍在离校区域",
  "19:10 才出现打印记录",
  "匿名发帖与传播需要额外操作时间",
  "陈小北说话语气紧张",
  "有人在群里说他很可疑",
  "他是队长所以最可疑"
];

const CH2_CORRECT_REASONS = new Set<string>([
  "18:39 仍在离校区域",
  "19:10 才出现打印记录",
  "匿名发帖与传播需要额外操作时间"
]);

const CH3_REASONING_OPTIONS = [
  "便签可由简单位移规则解读",
  "海报提示与便签指向同一地点",
  "储物柜纸袋提供更完整上下文",
  "字母看起来很神秘所以肯定有罪",
  "谁先发现便签谁就最可疑",
  "名字陌生说明一定在隐瞒"
];

const CH3_CORRECT_REASONS = new Set<string>([
  "便签可由简单位移规则解读",
  "海报提示与便签指向同一地点",
  "储物柜纸袋提供更完整上下文"
]);

const CH4_REASONING_OPTIONS = [
  "登录记录与发帖时间接近",
  "论坛草稿与帖子标题高度相似",
  "文件改名时间与公共电脑操作吻合",
  "线索都是真的所以不必验证",
  "谁最沉默谁就最可疑",
  "先入为主比证据更重要"
];

const CH4_CORRECT_REASONS = new Set<string>([
  "登录记录与发帖时间接近",
  "论坛草稿与帖子标题高度相似",
  "文件改名时间与公共电脑操作吻合"
]);

const CH5_REASONING_OPTIONS = [
  "高远使用夜鸦账号发布了不当内容",
  "存在刻意误导调查的行为",
  "网络行为需要承担责任与修复后果",
  "匿名就不需要承担后果",
  "只要道歉就无需复盘",
  "截图传播不算参与"
];

const CH5_CORRECT_REASONS = new Set<string>([
  "高远使用夜鸦账号发布了不当内容",
  "存在刻意误导调查的行为",
  "网络行为需要承担责任与修复后果"
]);

export const CHAPTER_FAILURE_HINTS: Record<string, string[]> = {
  ch4: [
    "提示：先把线索按时间顺序排好。",
    "提示：重点核对登录记录、草稿纸和改名时间。",
    "提示：先找“时间接近”，再找“内容对应”，最后看“操作痕迹”。"
  ],
  ch5: [
    "提示：结案结论要同时包含事实、误导和责任。",
    "提示：先确认账号使用，再确认误导行为。",
    "提示：最后补上“修复与责任”才是完整结案。"
  ]
};

export function getChapterQuizConfig(
  chapterId: string,
  ch1CorrectReasons: Set<string>
): QuizConfig {
  if (chapterId === "ch1") {
    return {
      title: "证据判断",
      prompt: "选择三项不能直接证明陈小北泄密的理由：",
      correctReasons: ch1CorrectReasons,
      unlockGateId: "Gate_A_调查解锁",
      lockedLabel: "证据判断（未解锁）",
      unlockedLabel: "开始证据判断",
      incompleteMessage: "判断不完整，请再检查证据。",
      successMessage: "第一章通过",
      completionStoryNode: "ch1_completed",
      nextChapterId: "ch2",
      resolveClues: [],
      useClues: ["ch1_forum_shot", "ch1_forum_export", "ch1_chat_log"]
    };
  }

  if (chapterId === "ch2") {
    return {
      title: "可行性判断",
      prompt: "选择三项支持“陈小北无法单独完成完整链路”的依据：",
      reasons: CH2_REASONING_OPTIONS,
      correctReasons: CH2_CORRECT_REASONS,
      unlockGateId: "Gate_B_主推理解锁",
      lockedLabel: "可行性判断（未解锁）",
      unlockedLabel: "开始可行性判断",
      incompleteMessage: "推理依据不完整，请结合时间线再判断。",
      successMessage: "第二章通过",
      completionStoryNode: "ch2_completed",
      nextChapterId: "ch3",
      resolveClues: ["ch2_filename_hint"],
      useClues: ["ch2_photo_1", "ch2_photo_2", "ch2_photo_3", "ch2_print_log"]
    };
  }

  if (chapterId === "ch3") {
    return {
      title: "线索溯源",
      prompt: "选择三项支持“神秘线索被刻意用于误导”的依据：",
      reasons: CH3_REASONING_OPTIONS,
      correctReasons: CH3_CORRECT_REASONS,
      unlockGateId: "Gate_B_主推理解锁",
      lockedLabel: "线索溯源（未解锁）",
      unlockedLabel: "开始线索溯源",
      incompleteMessage: "溯源依据不完整，请再核对三条核心线索。",
      successMessage: "第三章通过",
      completionStoryNode: "ch3_completed",
      nextChapterId: "ch4",
      resolveClues: ["ch3_old_draft"],
      useClues: ["ch3_cipher_note", "ch3_poster_hint", "ch3_locker_file"]
    };
  }

  if (chapterId === "ch4") {
    return {
      title: "交叉验证",
      prompt: "选择三项能够互相印证“误导链路成立”的依据：",
      reasons: CH4_REASONING_OPTIONS,
      correctReasons: CH4_CORRECT_REASONS,
      unlockGateId: "Gate_B_交叉验证解锁",
      lockedLabel: "交叉验证（未解锁）",
      unlockedLabel: "开始交叉验证",
      incompleteMessage: "交叉验证不完整，请检查时间与行为链条。",
      successMessage: "第四章通过",
      completionStoryNode: "ch4_completed",
      nextChapterId: "ch5",
      resolveClues: [],
      useClues: ["ch4_login_log", "ch4_chat_full", "ch4_forum_draft", "ch4_filename_trace"]
    };
  }

  return {
    title: "结案报告",
    prompt: "选择三项构成完整结案结论的要点：",
    reasons: CH5_REASONING_OPTIONS,
    correctReasons: CH5_CORRECT_REASONS,
    unlockGateId: "Gate_A_结案解锁",
    lockedLabel: "结案报告（未解锁）",
    unlockedLabel: "开始结案报告",
    incompleteMessage: "结案要点不完整，请补齐责任链条。",
    successMessage: "第五章完结",
    completionStoryNode: "ch5_completed",
    resolveClues: [],
    useClues: ["ch5_confession", "ch5_motive_note", "ch5_responsibility_plan"]
  };
}
