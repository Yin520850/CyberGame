import "./styles/base.css";
import { useEffect, useMemo, useState } from "react";
import ModeToggle from "./features/common/ModeToggle";
import FeedbackToast from "./features/common/FeedbackToast";
import TaskTracker, { type TaskItem } from "./features/common/TaskTracker";
import EvidenceBoard from "./features/evidence/EvidenceBoard";
import LocationView from "./features/investigation/LocationView";
import MapPanel from "./features/investigation/MapPanel";
import JudgementQuiz, { CH1_CORRECT_REASONS } from "./features/quiz/JudgementQuiz";
import FinalReportPanel from "./features/story/FinalReportPanel";
import StoryPanel from "./features/story/StoryPanel";
import GalScene from "./features/story/GalScene";
import CGGallery from "./features/story/CGGallery";
import CloudSyncPanel from "./features/story/CloudSyncPanel";
import { LOCATION_LABELS } from "./game/chapter/locations";
import {
  CHAPTER_LABELS,
  canAccessChapter,
  isStoryAtLeast,
  type ChapterId
} from "./game/chapter/progression";
import { CG_ENTRIES, getSceneFrame } from "./game/chapter/scene";
import { CHAPTER_FAILURE_HINTS, getChapterQuizConfig } from "./game/chapter/quiz";
import { buildTaskItems, isDiscovered } from "./game/chapter/tasks";
import { chapterConfigs } from "./game/config";
import { evaluateGate } from "./game/engine/gates";
import { useGameStore, type PersistedGameState } from "./game/store/gameStore";

const CH2_PHOTO_IDS = ["ch2_photo_1", "ch2_photo_2", "ch2_photo_3"];

const HIDDEN_CLUE_FEEDBACK: Record<string, string> = {
  ch2_filename_hint: "发现异常文件名：已记录（待主推理后解析）",
  ch3_old_draft: "发现旧创意草图：已记录（待线索溯源后解析）",
  ch4_filename_trace: "发现文件改名痕迹：已记录（待交叉验证后归因）"
};

function App() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [quizFailureCount, setQuizFailureCount] = useState(0);
  const [showChapterTransition, setShowChapterTransition] = useState(true);
  const [revealedHiddenLocations, setRevealedHiddenLocations] = useState<
    Record<string, boolean>
  >({});

  const mode = useGameStore((state) => state.mode);
  const currentChapterId = useGameStore((state) => state.currentChapterId);
  const clueStates = useGameStore((state) => state.clueStates);
  const storyNode = useGameStore((state) => state.storyNode);
  const locationUnlocked = useGameStore((state) => state.locationUnlocked);
  const setMode = useGameStore((state) => state.setMode);
  const setChapter = useGameStore((state) => state.setChapter);
  const discoverClue = useGameStore((state) => state.discoverClue);
  const resolveClue = useGameStore((state) => state.resolveClue);
  const useClue = useGameStore((state) => state.useClue);
  const hydrateProgress = useGameStore((state) => state.hydrateProgress);
  const advanceStoryNode = useGameStore((state) => state.advanceStoryNode);
  const resetGame = useGameStore((state) => state.reset);

  const chapter =
    chapterConfigs[currentChapterId as keyof typeof chapterConfigs] ??
    chapterConfigs.ch1;
  const chapterQuiz = useMemo(
    () => getChapterQuizConfig(currentChapterId, CH1_CORRECT_REASONS),
    [currentChapterId]
  );

  useEffect(() => {
    setSelectedLocationId(chapter.coreLocations[0]);
    setShowQuiz(false);
    setQuizFailureCount(0);
    setRevealedHiddenLocations({});
  }, [chapter.id, chapter.coreLocations]);

  useEffect(() => {
    setShowChapterTransition(true);
    const timer = window.setTimeout(() => setShowChapterTransition(false), 1200);
    return () => window.clearTimeout(timer);
  }, [currentChapterId]);

  const modeLabel = mode === "story" ? "剧情模式" : "侦查模式";
  const chapterLabel =
    CHAPTER_LABELS[currentChapterId as ChapterId] ?? currentChapterId;
  const sceneFrame = useMemo(
    () => getSceneFrame(currentChapterId, storyNode),
    [currentChapterId, storyNode]
  );
  const unlockedCgIds = useMemo(
    () =>
      CG_ENTRIES.filter((entry) => isStoryAtLeast(storyNode, entry.unlockNode)).map(
        (entry) => entry.id
      ),
    [storyNode]
  );
  const progressSnapshot = useMemo<PersistedGameState>(
    () => ({
      mode,
      currentChapterId,
      storyNode,
      clueStates,
      locationUnlocked
    }),
    [mode, currentChapterId, storyNode, clueStates, locationUnlocked]
  );

  const isGateOpen = (gateId: string): boolean => {
    const gate = chapter.gates.find((candidate) => candidate.id === gateId);
    return gate ? evaluateGate(gate, { clueStates }) : false;
  };

  const discoveredPhotoCount = CH2_PHOTO_IDS.filter((id) =>
    isDiscovered(clueStates[id])
  ).length;
  const timelineUnlocked = currentChapterId === "ch2" && discoveredPhotoCount >= 2;
  const timelineEntries = useMemo(
    () =>
      chapter.clues
        .filter(
          (clue) => CH2_PHOTO_IDS.includes(clue.id) && isDiscovered(clueStates[clue.id])
        )
        .map((clue) => clue.name),
    [chapter.clues, clueStates]
  );

  const locationList = [...chapter.coreLocations, ...chapter.sideLocations].map(
    (locationId) => ({
      id: locationId,
      label: LOCATION_LABELS[locationId] ?? locationId
    })
  );
  const currentLocationLabel = LOCATION_LABELS[selectedLocationId] ?? selectedLocationId;
  const currentClues = chapter.clues.filter(
    (clue) => clue.locationId === selectedLocationId
  );
  const hiddenRevealed = !!revealedHiddenLocations[selectedLocationId];

  const taskItems = useMemo<TaskItem[]>(
    () => buildTaskItems(currentChapterId, clueStates, storyNode),
    [currentChapterId, clueStates, storyNode]
  );

  const canGoToChapter2 = canAccessChapter(currentChapterId, storyNode, "ch2");
  const canGoToChapter3 = canAccessChapter(currentChapterId, storyNode, "ch3");
  const canGoToChapter4 = canAccessChapter(currentChapterId, storyNode, "ch4");
  const canGoToChapter5 = canAccessChapter(currentChapterId, storyNode, "ch5");

  const showFinalReport = storyNode === "ch5_completed";
  const chapterCompleted =
    currentChapterId === "ch5" && isStoryAtLeast(storyNode, "ch5_completed");
  const quizUnlocked = isGateOpen(chapterQuiz.unlockGateId);
  const canOpenQuiz = quizUnlocked && !chapterCompleted;
  const quizButtonText = chapterCompleted
    ? "结案已完成"
    : quizUnlocked
      ? chapterQuiz.unlockedLabel
      : chapterQuiz.lockedLabel;

  const setTieredFailureFeedback = (fallbackMessage: string) => {
    const nextFailureCount = quizFailureCount + 1;
    setQuizFailureCount(nextFailureCount);

    const hints = CHAPTER_FAILURE_HINTS[currentChapterId];
    if (!hints || hints.length === 0) {
      setFeedback(fallbackMessage);
      return;
    }

    const hintIndex = Math.min(nextFailureCount - 1, hints.length - 1);
    setFeedback(hints[hintIndex]);
  };

  const handleCollectClue = (clueId: string) => {
    discoverClue(clueId);
    const message = HIDDEN_CLUE_FEEDBACK[clueId];
    if (message) {
      setFeedback(message);
    }
  };

  const handleRevealHiddenClues = () => {
    setRevealedHiddenLocations((prev) => ({
      ...prev,
      [selectedLocationId]: true
    }));
  };

  const handleQuizSubmit = (selectedReasons: string[]) => {
    if (selectedReasons.length !== chapterQuiz.correctReasons.size) {
      setTieredFailureFeedback(chapterQuiz.incompleteMessage);
      return;
    }

    const valid = selectedReasons.every((reason) =>
      chapterQuiz.correctReasons.has(reason)
    );
    if (!valid || !quizUnlocked || chapterCompleted) {
      setTieredFailureFeedback(chapterQuiz.incompleteMessage);
      return;
    }

    setQuizFailureCount(0);
    chapterQuiz.resolveClues.forEach((clueId) => resolveClue(clueId));
    chapterQuiz.useClues.forEach((clueId) => useClue(clueId));
    advanceStoryNode(chapterQuiz.completionStoryNode);
    setFeedback(chapterQuiz.successMessage);

    if (chapterQuiz.nextChapterId) {
      setChapter(chapterQuiz.nextChapterId);
    }

    setShowQuiz(false);
  };

  const handleRestartGame = () => {
    resetGame();
    setMode("story");
    setFeedback("");
  };

  const handleHydrateCloudProgress = (snapshot: PersistedGameState) => {
    hydrateProgress(snapshot);
    setShowQuiz(false);
    setQuizFailureCount(0);
    setFeedback("已载入云端进度");
  };

  return (
    <main className="app-shell">
      <h1>消失的机器人大赛方案</h1>
      <p>当前章节：{chapterLabel}</p>
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
      <GalScene
        chapterLabel={chapterLabel}
        chapterTitle={sceneFrame.stageTitle}
        frame={sceneFrame}
        showTransition={showChapterTransition}
      />
      <CGGallery entries={CG_ENTRIES} unlockedIds={unlockedCgIds} />
      <StoryPanel chapterId={currentChapterId} storyNode={storyNode} />
      <FinalReportPanel visible={showFinalReport} onRestart={handleRestartGame} />
      <TaskTracker items={taskItems} />
      <ModeToggle
        mode={mode}
        onToggle={() => setMode(mode === "story" ? "investigation" : "story")}
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
            <button type="button" onClick={() => setShowQuiz(true)} disabled={!canOpenQuiz}>
              {quizButtonText}
            </button>
          ) : (
            <JudgementQuiz
              title={chapterQuiz.title}
              prompt={chapterQuiz.prompt}
              reasons={chapterQuiz.reasons}
              onSubmit={handleQuizSubmit}
            />
          )}
          <FeedbackToast message={feedback} />
        </section>
      ) : (
        <section className="mode-content">
          <section className="panel">
            <h2>剧情模式</h2>
            <p>林警官：先核实线索完整性，再做结论。</p>
          </section>
          <CloudSyncPanel
            snapshot={progressSnapshot}
            onHydrate={handleHydrateCloudProgress}
          />
        </section>
      )}
    </main>
  );
}

export default App;
