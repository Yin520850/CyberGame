import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { gameStore } from "../../src/game/store/gameStore";

describe("chapter 1 flow", () => {
  beforeEach(() => {
    gameStore.getState().reset();
  });

  test("cannot open judgement quiz before collecting required clues", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));
    const quizButton = screen.getByRole("button", { name: "证据判断（未解锁）" });
    expect(quizButton).toBeDisabled();
  });

  test("passes chapter only when selecting all correct reasons", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));

    await user.click(screen.getByRole("button", { name: "科技社活动室" }));
    await user.click(screen.getByRole("button", { name: "采集 论坛截图" }));

    await user.click(screen.getByRole("button", { name: "何老师办公室" }));
    await user.click(screen.getByRole("button", { name: "采集 论坛导出页" }));

    await user.click(screen.getByRole("button", { name: "校内群聊界面" }));
    await user.click(screen.getByRole("button", { name: "采集 群聊记录片段" }));

    await user.click(screen.getByRole("button", { name: "开始证据判断" }));

    await user.click(screen.getByLabelText("时间信息不完整"));
    await user.click(screen.getByLabelText("图片不等于最终方案"));
    await user.click(screen.getByLabelText("聊天记录缺少上下文"));
    await user.click(screen.getByRole("button", { name: "提交判断" }));

    expect(screen.getByText("第一章通过")).toBeInTheDocument();
  });
});
