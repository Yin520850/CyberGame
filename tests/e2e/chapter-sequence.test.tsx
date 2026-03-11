import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { gameStore } from "../../src/game/store/gameStore";

async function completeChapter1(user: ReturnType<typeof userEvent.setup>) {
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
}

async function completeChapter2(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "摄影社角落" }));
  await user.click(screen.getByRole("button", { name: "采集 照片一(18:07校门)" }));
  await user.click(screen.getByRole("button", { name: "便利店门前" }));
  await user.click(screen.getByRole("button", { name: "采集 照片二(18:21便利店)" }));
  await user.click(screen.getByRole("button", { name: "路口视角点" }));
  await user.click(screen.getByRole("button", { name: "采集 照片三(18:39路口)" }));
  await user.click(screen.getByRole("button", { name: "机房门外" }));
  await user.click(screen.getByRole("button", { name: "采集 机房打印记录(19:10)" }));
  await user.click(screen.getByRole("button", { name: "开始可行性判断" }));
  await user.click(screen.getByLabelText("18:39 仍在离校区域"));
  await user.click(screen.getByLabelText("19:10 才出现打印记录"));
  await user.click(screen.getByLabelText("匿名发帖与传播需要额外操作时间"));
  await user.click(screen.getByRole("button", { name: "提交判断" }));
}

describe("chapter sequence", () => {
  beforeEach(() => {
    gameStore.getState().reset();
  });

  test("moves from ch1 to ch2 and unlocks ch3 hint", async () => {
    const user = userEvent.setup();
    render(<App />);

    await completeChapter1(user);
    expect(screen.getAllByText("当前章节：第二章").length).toBeGreaterThan(0);

    await completeChapter2(user);
    expect(screen.getByText("第三章入口已解锁")).toBeInTheDocument();
  });
});
