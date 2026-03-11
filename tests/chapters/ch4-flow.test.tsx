import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { gameStore } from "../../src/game/store/gameStore";

describe("chapter 4 flow", () => {
  beforeEach(() => {
    gameStore.getState().reset();
    gameStore.getState().setChapter("ch4");
  });

  test("requires all main clues before cross verification unlock", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));
    expect(screen.getByRole("button", { name: "交叉验证（未解锁）" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "活动室电脑" }));
    await user.click(screen.getByRole("button", { name: "采集 校园网登录记录" }));
    await user.click(screen.getByRole("button", { name: "校内群聊界面" }));
    await user.click(screen.getByRole("button", { name: "采集 聊天记录完整版" }));
    await user.click(screen.getByRole("button", { name: "储物柜区" }));
    await user.click(screen.getByRole("button", { name: "采集 论坛草稿纸" }));
    expect(screen.getByRole("button", { name: "交叉验证（未解锁）" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "机房门外" }));
    await user.click(screen.getByRole("button", { name: "搜索隐藏线索" }));
    await user.click(screen.getByRole("button", { name: "采集 文件改名痕迹" }));
    expect(
      screen.getByRole("button", { name: "开始交叉验证" })
    ).not.toBeDisabled();
  });

  test("passes chapter when selecting all correct reasons", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));

    await user.click(screen.getByRole("button", { name: "活动室电脑" }));
    await user.click(screen.getByRole("button", { name: "采集 校园网登录记录" }));
    await user.click(screen.getByRole("button", { name: "校内群聊界面" }));
    await user.click(screen.getByRole("button", { name: "采集 聊天记录完整版" }));
    await user.click(screen.getByRole("button", { name: "储物柜区" }));
    await user.click(screen.getByRole("button", { name: "采集 论坛草稿纸" }));
    await user.click(screen.getByRole("button", { name: "机房门外" }));
    await user.click(screen.getByRole("button", { name: "搜索隐藏线索" }));
    await user.click(screen.getByRole("button", { name: "采集 文件改名痕迹" }));

    await user.click(screen.getByRole("button", { name: "开始交叉验证" }));
    await user.click(screen.getByLabelText("登录记录与发帖时间接近"));
    await user.click(screen.getByLabelText("论坛草稿与帖子标题高度相似"));
    await user.click(screen.getByLabelText("文件改名时间与公共电脑操作吻合"));
    await user.click(screen.getByRole("button", { name: "提交判断" }));

    expect(screen.getByText("第四章通过")).toBeInTheDocument();
  });
});
