import "./styles/base.css";
import { useState } from "react";
import ModeToggle from "./features/common/ModeToggle";
import FeedbackToast from "./features/common/FeedbackToast";
import LocationView from "./features/investigation/LocationView";
import MapPanel from "./features/investigation/MapPanel";
import JudgementQuiz, { CH1_CORRECT_REASONS } from "./features/quiz/JudgementQuiz";
import { chapterConfigs } from "./game/config";
import { evaluateGate } from "./game/engine/gates";
import { useGameStore } from "./game/store/gameStore";

type Mode = "story" | "investigation";
const chapter = chapterConfigs.ch1;

const LOCATION_LABELS: Record<string, string> = {
  activity_room: "科技社活动室",
  teacher_office: "何老师办公室",
  group_chat: "校内群聊界面",
  hall_board: "走廊公告栏",
  storage_area: "储物柜区"
};

function App() {
  const [mode, setMode] = useState<Mode>("story");
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    chapter.coreLocations[0]
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const [feedback, setFeedback] = useState("");

  const modeLabel = mode === "story" ? "剧情模式" : "侦查模式";
  const clueStates = useGameStore((state) => state.clueStates);
  const discoverClue = useGameStore((state) => state.discoverClue);
  const useClue = useGameStore((state) => state.useClue);
  const advanceStoryNode = useGameStore((state) => state.advanceStoryNode);

  const gateA = chapter.gates.find((gate) => gate.id === "Gate_A_调查解锁");
  const quizUnlocked = gateA
    ? evaluateGate(gateA, { clueStates })
    : false;

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

  const handleQuizSubmit = (selectedReasons: string[]) => {
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
    setShowQuiz(false);
  };

  return (
    <main className="app-shell">
      <h1>消失的机器人大赛方案</h1>
      <p>当前模式：{modeLabel}</p>
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
            onCollectClue={discoverClue}
          />

          {!showQuiz ? (
            <button
              type="button"
              onClick={() => setShowQuiz(true)}
              disabled={!quizUnlocked}
            >
              {quizUnlocked ? "开始证据判断" : "证据判断（未解锁）"}
            </button>
          ) : (
            <JudgementQuiz onSubmit={handleQuizSubmit} />
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
