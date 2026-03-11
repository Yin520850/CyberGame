import { render, screen } from "@testing-library/react";
import App from "../../src/App";
import { gameStore } from "../../src/game/store/gameStore";

beforeEach(() => {
  window.localStorage.clear();
  gameStore.getState().reset();
});

test("renders game shell title", () => {
  render(<App />);
  expect(screen.getByText("消失的机器人大赛方案")).toBeInTheDocument();
});
