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

async function completeChapter3(user: ReturnType<typeof userEvent.setup>) {
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
}

async function completeChapter4(user: ReturnType<typeof userEvent.setup>) {
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
}

async function completeChapter5(user: ReturnType<typeof userEvent.setup>) {
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
}

describe("chapter sequence", () => {
  beforeEach(() => {
    gameStore.getState().reset();
  });

  test("moves from ch1 to ch5 and shows finale hint", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("button", { name: "前往第二章" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "前往第三章" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "前往第四章" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "前往第五章" })).toBeDisabled();

    await completeChapter1(user);
    expect(screen.getByRole("button", { name: "前往第二章" })).not.toBeDisabled();
    expect(screen.getAllByText("当前章节：第二章").length).toBeGreaterThan(0);

    await completeChapter2(user);
    expect(screen.getByRole("button", { name: "前往第三章" })).not.toBeDisabled();
    expect(screen.getAllByText("当前章节：第三章").length).toBeGreaterThan(0);

    await completeChapter3(user);
    expect(screen.getByRole("button", { name: "前往第四章" })).not.toBeDisabled();
    expect(screen.getAllByText("当前章节：第四章").length).toBeGreaterThan(0);

    await completeChapter4(user);
    expect(screen.getByRole("button", { name: "前往第五章" })).not.toBeDisabled();
    expect(screen.getAllByText("当前章节：第五章").length).toBeGreaterThan(0);

    await completeChapter5(user);
    expect(screen.getByText("全章完结")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "结案摘要" })).toBeInTheDocument();
    expect(screen.getByText("账号使用与发布：已确认高远使用夜鸦账号。")).toBeInTheDocument();
    expect(screen.getByText("误导行为：存在裁剪传播与线索改名行为。")).toBeInTheDocument();
    expect(screen.getByText("责任与修复：需公开说明、道歉并执行修复方案。")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "重新开始调查" }));
    expect(screen.getAllByText("当前章节：第一章").length).toBeGreaterThan(0);
    expect(screen.getByText("剧情节点：ch1_start")).toBeInTheDocument();
  });
});
