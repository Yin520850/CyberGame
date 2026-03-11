import "./styles/base.css";
import { useEffect, useMemo, useState } from "react";
import ModeToggle from "./features/common/ModeToggle";
import FeedbackToast from "./features/common/FeedbackToast";
import TaskTracker, { type TaskItem } from "./features/common/TaskTracker";
import EvidenceBoard from "./features/evidence/EvidenceBoard";
import LocationView from "./features/investigation/LocationView";
import MapPanel from "./features/investigation/MapPanel";
import JudgementQuiz, { CH1_CORRECT_REASONS } from "./features/quiz/JudgementQuiz";
import StoryPanel from "./features/story/StoryPanel";
import { chapterConfigs } from "./game/config";
import { evaluateGate } from "./game/engine/gates";
import { useGameStore } from "./game/store/gameStore";
import type { ClueState } from "./game/types";

type Mode = "story" | "investigation";

const CHAPTER_LABELS: Record<string, string> = {
  ch1: "第一章",
  ch2: "第二章",
  ch3: "第三章",
  ch4: "第四章",
  ch5: "第五章"
};

const LOCATION_LABELS: Record<string, string> = {
  activity_room: "科技社活动室",
  teacher_office: "何老师办公室",
  group_chat: "校内群聊界面",
  hall_board: "走廊公告栏",
  storage_area: "储物柜区",
  photo_corner: "摄影社角落",
  school_gate: "校门口",
  convenience_store: "便利店门前",
  street_crossing: "路口视角点",
  activity_room_pc: "活动室电脑",
  lab_door: "机房门外"
};

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

const CH2_PHOTO_IDS = ["ch2_photo_1", "ch2_photo_2", "ch2_photo_3"];
const STORY_LEVEL: Record<string, number> = {
  ch1_start: 0,
  ch1_completed: 1,
  ch2_completed: 2,
  ch3_completed: 3,
  ch4_completed: 4,
  ch5_completed: 5
};

function isDiscovered(state: ClueState | undefined): boolean {
  return !!state && state !== "undiscovered";
}

function isStoryAtLeast(storyNode: string, minimumNode: string): boolean {
  return (STORY_LEVEL[storyNode] ?? 0) >= (STORY_LEVEL[minimumNode] ?? 0);
}

function canAccessChapter(
  currentChapterId: string,
  storyNode: string,
  targetChapterId: string
): boolean {
  if (currentChapterId === targetChapterId) {
    return true;
  }

  if (targetChapterId === "ch1") {
    return true;
  }
  if (targetChapterId === "ch2") {
    return isStoryAtLeast(storyNode, "ch1_completed");
  }
  if (targetChapterId === "ch3") {
    return isStoryAtLeast(storyNode, "ch2_completed");
  }
  if (targetChapterId === "ch4") {
    return isStoryAtLeast(storyNode, "ch3_completed");
  }
  if (targetChapterId === "ch5") {
    return isStoryAtLeast(storyNode, "ch4_completed");
  }
  return false;
}

function buildTaskItems(
  chapterId: string,
  clueStates: Record<string, ClueState>,
  storyNode: string
): TaskItem[] {
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

function App() {
  const [mode, setMode] = useState<Mode>("story");
  const currentChapterId = useGameStore((state) => state.currentChapterId);
  const setChapter = useGameStore((state) => state.setChapter);
  const chapter =
    chapterConfigs[currentChapterId as keyof typeof chapterConfigs] ??
    chapterConfigs.ch1;

  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [revealedHiddenLocations, setRevealedHiddenLocations] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    setSelectedLocationId(chapter.coreLocations[0]);
    setShowQuiz(false);
    setRevealedHiddenLocations({});
  }, [chapter.id, chapter.coreLocations]);

  const modeLabel = mode === "story" ? "剧情模式" : "侦查模式";
  const clueStates = useGameStore((state) => state.clueStates);
  const storyNode = useGameStore((state) => state.storyNode);
  const discoverClue = useGameStore((state) => state.discoverClue);
  const resolveClue = useGameStore((state) => state.resolveClue);
  const useClue = useGameStore((state) => state.useClue);
  const advanceStoryNode = useGameStore((state) => state.advanceStoryNode);

  const isGateOpen = (gateId: string): boolean => {
    const gate = chapter.gates.find((candidate) => candidate.id === gateId);
    return gate ? evaluateGate(gate, { clueStates }) : false;
  };

  const discoveredPhotoCount = CH2_PHOTO_IDS.filter((id) =>
    isDiscovered(clueStates[id])
  ).length;
  const timelineUnlocked = currentChapterId === "ch2" && discoveredPhotoCount >= 2;

  const locationList = [...chapter.coreLocations, ...chapter.sideLocations].map(
    (locationId) => ({
      id: locationId,
      label: LOCATION_LABELS[locationId] ?? locationId
    })
  );

  const currentLocationLabel =
    LOCATION_LABELS[selectedLocationId] ?? selectedLocationId;

  const currentClues = chapter.clues.filter(
    (clue) => clue.locationId === selectedLocationId
  );
  const hiddenRevealed = !!revealedHiddenLocations[selectedLocationId];

  const timelineEntries = useMemo(
    () =>
      chapter.clues
        .filter((clue) => CH2_PHOTO_IDS.includes(clue.id) && isDiscovered(clueStates[clue.id]))
        .map((clue) => clue.name),
    [chapter.clues, clueStates]
  );
  const taskItems = useMemo(
    () => buildTaskItems(currentChapterId, clueStates, storyNode),
    [currentChapterId, clueStates, storyNode]
  );

  const handleCollectClue = (clueId: string) => {
    discoverClue(clueId);
    if (currentChapterId === "ch2" && clueId === "ch2_filename_hint") {
      setFeedback("发现异常文件名：已记录（待主推理后解析）");
    }
    if (currentChapterId === "ch3" && clueId === "ch3_old_draft") {
      setFeedback("发现旧创意草图：已记录（待线索溯源后解析）");
    }
    if (currentChapterId === "ch4" && clueId === "ch4_filename_trace") {
      setFeedback("发现文件改名痕迹：已记录（待交叉验证后归因）");
    }
  };

  const handleRevealHiddenClues = () => {
    setRevealedHiddenLocations((prev) => ({
      ...prev,
      [selectedLocationId]: true
    }));
  };

  const canGoToChapter2 = canAccessChapter(currentChapterId, storyNode, "ch2");
  const canGoToChapter3 = canAccessChapter(currentChapterId, storyNode, "ch3");
  const canGoToChapter4 = canAccessChapter(currentChapterId, storyNode, "ch4");
  const canGoToChapter5 = canAccessChapter(currentChapterId, storyNode, "ch5");

  const handleCh1QuizSubmit = (selectedReasons: string[]) => {
    if (selectedReasons.length !== CH1_CORRECT_REASONS.size) {
      setFeedback("判断不完整，请再检查证据。");
      return;
    }

    const valid = selectedReasons.every((reason) =>
      CH1_CORRECT_REASONS.has(reason)
    );
    if (!valid) {
      setFeedback("判断不完整，请再检查证据。");
      return;
    }

    useClue("ch1_forum_shot");
    useClue("ch1_forum_export");
    useClue("ch1_chat_log");
    advanceStoryNode("ch1_completed");
    setFeedback("第一章通过");
    setChapter("ch2");
    setShowQuiz(false);
  };

  const handleCh2ReasoningSubmit = (selectedReasons: string[]) => {
    if (selectedReasons.length !== CH2_CORRECT_REASONS.size) {
      setFeedback("推理依据不完整，请结合时间线再判断。");
      return;
    }

    const valid = selectedReasons.every((reason) =>
      CH2_CORRECT_REASONS.has(reason)
    );
    if (!valid || !isGateOpen("Gate_B_主推理解锁")) {
      setFeedback("推理依据不完整，请结合时间线再判断。");
      return;
    }

    resolveClue("ch2_filename_hint");
    useClue("ch2_photo_1");
    useClue("ch2_photo_2");
    useClue("ch2_photo_3");
    useClue("ch2_print_log");
    advanceStoryNode("ch2_completed");
    setFeedback("第二章通过");
    setChapter("ch3");
    setShowQuiz(false);
  };

  const handleCh3ReasoningSubmit = (selectedReasons: string[]) => {
    if (selectedReasons.length !== CH3_CORRECT_REASONS.size) {
      setFeedback("溯源依据不完整，请再核对三条核心线索。");
      return;
    }

    const valid = selectedReasons.every((reason) =>
      CH3_CORRECT_REASONS.has(reason)
    );
    if (!valid || !isGateOpen("Gate_B_主推理解锁")) {
      setFeedback("溯源依据不完整，请再核对三条核心线索。");
      return;
    }

    resolveClue("ch3_old_draft");
    useClue("ch3_cipher_note");
    useClue("ch3_poster_hint");
    useClue("ch3_locker_file");
    advanceStoryNode("ch3_completed");
    setFeedback("第三章通过");
    setChapter("ch4");
    setShowQuiz(false);
  };

  const handleCh4ReasoningSubmit = (selectedReasons: string[]) => {
    if (selectedReasons.length !== CH4_CORRECT_REASONS.size) {
      setFeedback("交叉验证不完整，请检查时间与行为链条。");
      return;
    }

    const valid = selectedReasons.every((reason) =>
      CH4_CORRECT_REASONS.has(reason)
    );
    if (!valid || !isGateOpen("Gate_B_交叉验证解锁")) {
      setFeedback("交叉验证不完整，请检查时间与行为链条。");
      return;
    }

    useClue("ch4_login_log");
    useClue("ch4_chat_full");
    useClue("ch4_forum_draft");
    useClue("ch4_filename_trace");
    advanceStoryNode("ch4_completed");
    setFeedback("第四章通过");
    setChapter("ch5");
    setShowQuiz(false);
  };

  const handleCh5ReasoningSubmit = (selectedReasons: string[]) => {
    if (selectedReasons.length !== CH5_CORRECT_REASONS.size) {
      setFeedback("结案要点不完整，请补齐责任链条。");
      return;
    }

    const valid = selectedReasons.every((reason) =>
      CH5_CORRECT_REASONS.has(reason)
    );
    if (!valid || !isGateOpen("Gate_A_结案解锁")) {
      setFeedback("结案要点不完整，请补齐责任链条。");
      return;
    }

    useClue("ch5_confession");
    useClue("ch5_motive_note");
    useClue("ch5_responsibility_plan");
    advanceStoryNode("ch5_completed");
    setFeedback("第五章完结");
    setShowQuiz(false);
  };

  const quizUnlocked =
    currentChapterId === "ch1"
      ? isGateOpen("Gate_A_调查解锁")
      : currentChapterId === "ch2"
        ? isGateOpen("Gate_B_主推理解锁")
        : currentChapterId === "ch3"
          ? isGateOpen("Gate_B_主推理解锁")
          : currentChapterId === "ch4"
            ? isGateOpen("Gate_B_交叉验证解锁")
            : isGateOpen("Gate_A_结案解锁");
  const quizButtonText =
    currentChapterId === "ch1"
      ? quizUnlocked
        ? "开始证据判断"
        : "证据判断（未解锁）"
      : currentChapterId === "ch2"
        ? quizUnlocked
          ? "开始可行性判断"
          : "可行性判断（未解锁）"
        : currentChapterId === "ch3"
          ? quizUnlocked
            ? "开始线索溯源"
            : "线索溯源（未解锁）"
          : currentChapterId === "ch4"
            ? quizUnlocked
              ? "开始交叉验证"
              : "交叉验证（未解锁）"
            : quizUnlocked
              ? "开始结案报告"
              : "结案报告（未解锁）";
  const quizTitle =
    currentChapterId === "ch1"
      ? "证据判断"
      : currentChapterId === "ch2"
        ? "可行性判断"
        : currentChapterId === "ch3"
          ? "线索溯源"
          : currentChapterId === "ch4"
            ? "交叉验证"
            : "结案报告";
  const quizPrompt =
    currentChapterId === "ch1"
      ? "选择三项不能直接证明陈小北泄密的理由："
      : currentChapterId === "ch2"
        ? "选择三项支持“陈小北无法单独完成完整链路”的依据："
        : currentChapterId === "ch3"
          ? "选择三项支持“神秘线索被刻意用于误导”的依据："
          : currentChapterId === "ch4"
            ? "选择三项能够互相印证“误导链路成立”的依据："
            : "选择三项构成完整结案结论的要点：";
  const quizReasons =
    currentChapterId === "ch1"
      ? undefined
      : currentChapterId === "ch2"
        ? CH2_REASONING_OPTIONS
        : currentChapterId === "ch3"
          ? CH3_REASONING_OPTIONS
          : currentChapterId === "ch4"
            ? CH4_REASONING_OPTIONS
            : CH5_REASONING_OPTIONS;
  const quizSubmitHandler =
    currentChapterId === "ch1"
      ? handleCh1QuizSubmit
      : currentChapterId === "ch2"
        ? handleCh2ReasoningSubmit
        : currentChapterId === "ch3"
          ? handleCh3ReasoningSubmit
          : currentChapterId === "ch4"
            ? handleCh4ReasoningSubmit
            : handleCh5ReasoningSubmit;

  return (
    <main className="app-shell">
      <h1>消失的机器人大赛方案</h1>
      <p>当前章节：{CHAPTER_LABELS[currentChapterId] ?? currentChapterId}</p>
      <p>当前模式：{modeLabel}</p>
      <div className="chapter-switch">
        <button type="button" onClick={() => setChapter("ch1")}>
          前往第一章
        </button>
        <button
          type="button"
          onClick={() => setChapter("ch2")}
          disabled={!canGoToChapter2}
        >
          前往第二章
        </button>
        <button
          type="button"
          onClick={() => setChapter("ch3")}
          disabled={!canGoToChapter3}
        >
          前往第三章
        </button>
        <button
          type="button"
          onClick={() => setChapter("ch4")}
          disabled={!canGoToChapter4}
        >
          前往第四章
        </button>
        <button
          type="button"
          onClick={() => setChapter("ch5")}
          disabled={!canGoToChapter5}
        >
          前往第五章
        </button>
      </div>
      <StoryPanel chapterId={currentChapterId} storyNode={storyNode} />
      <TaskTracker items={taskItems} />
      <ModeToggle
        mode={mode}
        onToggle={() =>
          setMode((prev) => (prev === "story" ? "investigation" : "story"))
        }
      />
      {mode === "investigation" ? (
        <section className="mode-content">
          <MapPanel
            locations={locationList}
            selectedLocationId={selectedLocationId}
            onSelectLocation={setSelectedLocationId}
          />
          <LocationView
            locationLabel={currentLocationLabel}
            clues={currentClues}
            clueStates={clueStates}
            onCollectClue={handleCollectClue}
            hiddenRevealed={hiddenRevealed}
            onRevealHidden={handleRevealHiddenClues}
          />
          {currentChapterId === "ch2" && (
            <EvidenceBoard unlocked={timelineUnlocked} entries={timelineEntries} />
          )}

          {!showQuiz ? (
            <button
              type="button"
              onClick={() => setShowQuiz(true)}
              disabled={!quizUnlocked}
            >
              {quizButtonText}
            </button>
          ) : (
            <JudgementQuiz
              title={quizTitle}
              prompt={quizPrompt}
              reasons={quizReasons}
              onSubmit={quizSubmitHandler}
            />
          )}
          <FeedbackToast message={feedback} />
        </section>
      ) : (
        <section className="mode-content panel">
          <h2>剧情模式</h2>
          <p>林警官：先核实线索完整性，再做结论。</p>
        </section>
      )}
    </main>
  );
}

export default App;
