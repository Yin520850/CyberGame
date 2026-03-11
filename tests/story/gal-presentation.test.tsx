import { render, screen } from "@testing-library/react";
import App from "../../src/App";
import { gameStore } from "../../src/game/store/gameStore";

describe("gal presentation", () => {
  beforeEach(() => {
    gameStore.getState().reset();
  });

  test("shows scene presentation and locked cg slots in story mode", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "剧情演出" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "CG 回放" })).toBeInTheDocument();
    expect(screen.getByText("第3章CG（未解锁）")).toBeInTheDocument();
    expect(screen.getByText("终章CG（未解锁）")).toBeInTheDocument();
  });

  test("unlocks cg playback entries after reaching chapter milestones", () => {
    gameStore.getState().advanceStoryNode("ch5_completed");
    render(<App />);

    expect(screen.getByRole("button", { name: "回放 第3章CG" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "回放 终章CG" })).toBeInTheDocument();
  });
});
