import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";

test("toggle mode", async () => {
  const user = userEvent.setup();
  render(<App />);

  expect(screen.getByText("当前模式：剧情模式")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));
  expect(screen.getByText("当前模式：侦查模式")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "切换到剧情模式" }));
  expect(screen.getByText("当前模式：剧情模式")).toBeInTheDocument();
});
