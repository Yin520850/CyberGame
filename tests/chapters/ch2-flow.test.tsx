import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { gameStore } from "../../src/game/store/gameStore";

describe("chapter 2 flow", () => {
  beforeEach(() => {
    gameStore.getState().reset();
    gameStore.getState().setChapter("ch2");
  });

  test("unlocks timeline after collecting any two photos", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));
    expect(screen.getByText("时间线面板未解锁")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "摄影社角落" }));
    await user.click(screen.getByRole("button", { name: "采集 照片一(18:07校门)" }));

    await user.click(screen.getByRole("button", { name: "便利店门前" }));
    await user.click(screen.getByRole("button", { name: "采集 照片二(18:21便利店)" }));

    expect(screen.getByText("时间线面板已解锁")).toBeInTheDocument();
  });

  test("requires four main clues before reasoning and then can pass", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));

    await user.click(screen.getByRole("button", { name: "活动室电脑" }));
    await user.click(screen.getByRole("button", { name: "采集 异常文件名" }));
    expect(screen.getByRole("button", { name: "可行性判断（未解锁）" })).toBeDisabled();

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

    expect(screen.getByText("第二章通过")).toBeInTheDocument();
  });
});
