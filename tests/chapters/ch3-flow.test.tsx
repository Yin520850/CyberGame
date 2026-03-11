import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import { gameStore } from "../../src/game/store/gameStore";

describe("chapter 3 flow", () => {
  beforeEach(() => {
    gameStore.getState().reset();
    gameStore.getState().setChapter("ch3");
  });

  test("requires three main clues before reasoning unlock", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));
    expect(screen.getByRole("button", { name: "线索溯源（未解锁）" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "科技社活动室" }));
    await user.click(screen.getByRole("button", { name: "采集 凯撒便签(NLIDQJ)" }));
    await user.click(screen.getByRole("button", { name: "走廊公告栏" }));
    await user.click(screen.getByRole("button", { name: "采集 海报角落箭头提示" }));
    expect(screen.getByRole("button", { name: "线索溯源（未解锁）" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "储物柜区" }));
    await user.click(screen.getByRole("button", { name: "采集 储物柜纸袋" }));
    expect(
      screen.getByRole("button", { name: "开始线索溯源" })
    ).not.toBeDisabled();
  });

  test("passes chapter when selecting all correct reasons", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到侦查模式" }));

    await user.click(screen.getByRole("button", { name: "科技社活动室" }));
    await user.click(screen.getByRole("button", { name: "采集 凯撒便签(NLIDQJ)" }));
    await user.click(screen.getByRole("button", { name: "走廊公告栏" }));
    await user.click(screen.getByRole("button", { name: "采集 海报角落箭头提示" }));
    await user.click(screen.getByRole("button", { name: "储物柜区" }));
    await user.click(screen.getByRole("button", { name: "采集 储物柜纸袋" }));

    await user.click(screen.getByRole("button", { name: "开始线索溯源" }));
    await user.click(screen.getByLabelText("便签可由简单位移规则解读"));
    await user.click(screen.getByLabelText("海报提示与便签指向同一地点"));
    await user.click(screen.getByLabelText("储物柜纸袋提供更完整上下文"));
    await user.click(screen.getByRole("button", { name: "提交判断" }));

    expect(screen.getByText("第三章通过")).toBeInTheDocument();
  });
});
