import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { gameStore } from "../../src/game/store/gameStore";

describe("chapter 5 flow", () => {
  beforeEach(() => {
    gameStore.getState().reset();
    gameStore.getState().setChapter("ch5");
  });

  test("requires key clues before case report unlock", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));
    expect(screen.getByRole("button", { name: "结案报告（未解锁）" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "机房门外" }));
    await user.click(screen.getByRole("button", { name: "采集 高远口供记录" }));
    await user.click(screen.getByRole("button", { name: "何老师办公室" }));
    await user.click(screen.getByRole("button", { name: "采集 动机与误导说明" }));
    expect(screen.getByRole("button", { name: "结案报告（未解锁）" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "科技社活动室" }));
    await user.click(screen.getByRole("button", { name: "采集 修复与责任方案" }));
    expect(
      screen.getByRole("button", { name: "开始结案报告" })
    ).not.toBeDisabled();
  });

  test("finishes chapter when selecting all correct conclusions", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));
    await user.click(screen.getByRole("button", { name: "机房门外" }));
    await user.click(screen.getByRole("button", { name: "采集 高远口供记录" }));
    await user.click(screen.getByRole("button", { name: "何老师办公室" }));
    await user.click(screen.getByRole("button", { name: "采集 动机与误导说明" }));
    await user.click(screen.getByRole("button", { name: "科技社活动室" }));
    await user.click(screen.getByRole("button", { name: "采集 修复与责任方案" }));

    await user.click(screen.getByRole("button", { name: "开始结案报告" }));
    await user.click(screen.getByLabelText("高远使用夜鸦账号发布了不当内容"));
    await user.click(screen.getByLabelText("存在刻意误导调查的行为"));
    await user.click(screen.getByLabelText("网络行为需要承担责任与修复后果"));
    await user.click(screen.getByRole("button", { name: "提交判断" }));

    expect(screen.getByText("第五章完结")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "结案已完成" })).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "开始结案报告" })
    ).not.toBeInTheDocument();
  });

  test("shows tiered hints after repeated wrong submissions", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));
    await user.click(screen.getByRole("button", { name: "机房门外" }));
    await user.click(screen.getByRole("button", { name: "采集 高远口供记录" }));
    await user.click(screen.getByRole("button", { name: "何老师办公室" }));
    await user.click(screen.getByRole("button", { name: "采集 动机与误导说明" }));
    await user.click(screen.getByRole("button", { name: "科技社活动室" }));
    await user.click(screen.getByRole("button", { name: "采集 修复与责任方案" }));

    await user.click(screen.getByRole("button", { name: "开始结案报告" }));
    await user.click(screen.getByRole("button", { name: "提交判断" }));
    expect(
      screen.getByText("提示：结案结论要同时包含事实、误导和责任。")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "提交判断" }));
    expect(screen.getByText("提示：先确认账号使用，再确认误导行为。")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "提交判断" }));
    expect(
      screen.getByText("提示：最后补上“修复与责任”才是完整结案。")
    ).toBeInTheDocument();
  });
});
