import "./styles/base.css";
import { useState } from "react";
import ModeToggle from "./features/common/ModeToggle";

type Mode = "story" | "investigation";

function App() {
  const [mode, setMode] = useState<Mode>("story");

  const modeLabel = mode === "story" ? "剧情模式" : "侦查模式";

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
    </main>
  );
}

export default App;
