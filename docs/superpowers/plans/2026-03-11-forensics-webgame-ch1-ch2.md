# 电子取证剧情游戏（前两章）Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建可运行的网页剧情解谜原型，完成前两章（剧情模式/侦查模式切换、地图探索、线索状态机、章节门控与判定题）。

**Architecture:** 使用 React + TypeScript 单页应用。通过统一游戏状态仓库存储章节、地点、线索与门控，UI 分为剧情层和侦查层两套容器。关卡内容采用配置驱动（chapter config），保证后续第 3-5 章可复用同一套系统。

**Tech Stack:** Vite, React, TypeScript, Zustand, React Router, Vitest, Testing Library

---

## 文件结构（先定义边界）

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/router.tsx`
- Create: `src/styles/base.css`
- Create: `src/game/types.ts`
- Create: `src/game/store/gameStore.ts`
- Create: `src/game/store/selectors.ts`
- Create: `src/game/config/chapters/ch1.ts`
- Create: `src/game/config/chapters/ch2.ts`
- Create: `src/game/config/index.ts`
- Create: `src/game/engine/gates.ts`
- Create: `src/game/engine/clues.ts`
- Create: `src/features/story/StoryPanel.tsx`
- Create: `src/features/investigation/MapPanel.tsx`
- Create: `src/features/investigation/LocationView.tsx`
- Create: `src/features/evidence/EvidenceBoard.tsx`
- Create: `src/features/quiz/JudgementQuiz.tsx`
- Create: `src/features/common/ModeToggle.tsx`
- Create: `src/features/common/TaskTracker.tsx`
- Create: `src/features/common/FeedbackToast.tsx`
- Create: `src/assets/maps/ch1-map.svg`
- Create: `src/assets/maps/ch2-map.svg`
- Create: `tests/engine/gates.test.ts`
- Create: `tests/engine/clues.test.ts`
- Create: `tests/store/gameStore.test.ts`
- Create: `tests/chapters/ch1-flow.test.tsx`
- Create: `tests/chapters/ch2-flow.test.tsx`

## Chunk 1: 工程与最小框架

### Task 1: 初始化工程与测试环境

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/styles/base.css`
- Test: `tests/smoke/app-smoke.test.tsx`

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from "@testing-library/react";
import App from "../../src/App";

test("renders game shell title", () => {
  render(<App />);
  expect(screen.getByText("消失的机器人大赛方案")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/smoke/app-smoke.test.tsx`
Expected: FAIL with module/file not found.

- [ ] **Step 3: Write minimal implementation**
实现最小 `App` 标题与入口渲染，保证 smoke test 通过。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/smoke/app-smoke.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "chore: bootstrap web game project with test setup"
```

### Task 2: 路由与双模式骨架

**Files:**
- Create: `src/router.tsx`
- Modify: `src/App.tsx`
- Create: `src/features/common/ModeToggle.tsx`
- Test: `tests/smoke/mode-toggle.test.tsx`

- [ ] **Step 1: Write the failing test**
测试默认进入剧情模式，点击按钮可切换到侦查模式并更新 UI 标识。

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/smoke/mode-toggle.test.tsx -t "toggle mode"`
Expected: FAIL (mode state not implemented).

- [ ] **Step 3: Write minimal implementation**
添加 `ModeToggle` 与 `mode` 本地状态（后续迁移到 store）。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/smoke/mode-toggle.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/App.tsx src/router.tsx src/features/common/ModeToggle.tsx tests/smoke/mode-toggle.test.tsx
git commit -m "feat: add story and investigation mode shell"
```

## Chunk 2: 核心状态机与门控引擎

### Task 3: 线索状态机（未发现/已发现/已解析/已用于推理）

**Files:**
- Create: `src/game/types.ts`
- Create: `src/game/engine/clues.ts`
- Test: `tests/engine/clues.test.ts`

- [ ] **Step 1: Write the failing test**
覆盖状态合法流转与非法跳转阻断（例如直接从未发现到已解析应失败）。

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/engine/clues.test.ts`
Expected: FAIL (transition function missing).

- [ ] **Step 3: Write minimal implementation**
实现 `advanceClueState(current, action)`，仅允许受控流转。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/engine/clues.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/game/types.ts src/game/engine/clues.ts tests/engine/clues.test.ts
git commit -m "feat: implement clue state transition engine"
```

### Task 4: 章节门控引擎（Gate A/B/C）

**Files:**
- Create: `src/game/engine/gates.ts`
- Test: `tests/engine/gates.test.ts`

- [ ] **Step 1: Write the failing test**
覆盖 CH1 Gate_A/Gate_B 与 CH2 Gate_A/B/C 判定。

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/engine/gates.test.ts`
Expected: FAIL (gate rules not implemented).

- [ ] **Step 3: Write minimal implementation**
实现 `evaluateGate(gateId, snapshot)` 与可配置规则解析。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/engine/gates.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/game/engine/gates.ts tests/engine/gates.test.ts
git commit -m "feat: add chapter gate evaluation engine"
```

### Task 5: 全局游戏状态仓库

**Files:**
- Create: `src/game/store/gameStore.ts`
- Create: `src/game/store/selectors.ts`
- Test: `tests/store/gameStore.test.ts`

- [ ] **Step 1: Write the failing test**
测试：地点解锁、线索发现、门控触发、模式切换、章节推进。

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/store/gameStore.test.ts`
Expected: FAIL (store actions missing).

- [ ] **Step 3: Write minimal implementation**
实现 `setMode`、`discoverClue`、`resolveClue`、`unlockLocation`、`advanceStoryNode`。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/store/gameStore.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/game/store tests/store/gameStore.test.ts
git commit -m "feat: add global game store with chapter state"
```

## Chunk 3: 第一章内容接入

### Task 6: CH1 配置化关卡数据

**Files:**
- Create: `src/game/config/chapters/ch1.ts`
- Modify: `src/game/config/index.ts`
- Test: `tests/chapters/ch1-config.test.ts`

- [ ] **Step 1: Write the failing test**
断言 CH1 包含 3 条主线索、1 条伏笔线索、2 个门控定义。

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/chapters/ch1-config.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**
将 CH1 文档内容落为结构化配置（地点、线索、题目、反馈）。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/chapters/ch1-config.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/game/config/chapters/ch1.ts src/game/config/index.ts tests/chapters/ch1-config.test.ts
git commit -m "feat: add chapter 1 playable config"
```

### Task 7: CH1 交互流（侦查+判断题）

**Files:**
- Create: `src/features/investigation/MapPanel.tsx`
- Create: `src/features/investigation/LocationView.tsx`
- Create: `src/features/quiz/JudgementQuiz.tsx`
- Create: `src/features/common/FeedbackToast.tsx`
- Test: `tests/chapters/ch1-flow.test.tsx`

- [ ] **Step 1: Write the failing test**
集成测试覆盖：线索收集不足时无法进入判断题；答对 3/3 才通关。

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/chapters/ch1-flow.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**
实现 CH1 地图点位点击、线索弹窗、判断题与失败反馈。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/chapters/ch1-flow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/features src/assets/maps/ch1-map.svg tests/chapters/ch1-flow.test.tsx
git commit -m "feat: implement chapter 1 investigation and judgement flow"
```

## Chunk 4: 第二章内容接入

### Task 8: CH2 配置化关卡数据

**Files:**
- Create: `src/game/config/chapters/ch2.ts`
- Modify: `src/game/config/index.ts`
- Test: `tests/chapters/ch2-config.test.ts`

- [ ] **Step 1: Write the failing test**
断言 CH2 包含 4 条主线索 + 1 条隐藏线索与 Gate_A/B/C。

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/chapters/ch2-config.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**
把 CH2 时间线、可行性判定、隐藏线索延后解析规则写入配置。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/chapters/ch2-config.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/game/config/chapters/ch2.ts src/game/config/index.ts tests/chapters/ch2-config.test.ts
git commit -m "feat: add chapter 2 playable config"
```

### Task 9: CH2 时间线与可行性判定

**Files:**
- Create: `src/features/evidence/EvidenceBoard.tsx`
- Modify: `src/features/quiz/JudgementQuiz.tsx`
- Test: `tests/chapters/ch2-flow.test.tsx`

- [ ] **Step 1: Write the failing test**
验证：任意两张照片解锁时间线；四条主线索齐全才可进入最终判定；隐藏线索提前发现但不能提前通关。

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/chapters/ch2-flow.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**
实现时间线面板、依据勾选逻辑、隐藏线索延后解析。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/chapters/ch2-flow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/features/evidence/EvidenceBoard.tsx src/features/quiz/JudgementQuiz.tsx src/assets/maps/ch2-map.svg tests/chapters/ch2-flow.test.tsx
git commit -m "feat: implement chapter 2 timeline reasoning flow"
```

## Chunk 5: 端到端联调与交付

### Task 10: 章节串联与任务追踪器

**Files:**
- Create: `src/features/story/StoryPanel.tsx`
- Create: `src/features/common/TaskTracker.tsx`
- Modify: `src/App.tsx`
- Test: `tests/e2e/chapter-sequence.test.tsx`

- [ ] **Step 1: Write the failing test**
验证 CH1 通关后进入 CH2；CH2 通关后展示 CH3 入口伏笔。

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/e2e/chapter-sequence.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**
实现章节串联、任务列表刷新、一次性触发保护。

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/e2e/chapter-sequence.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/App.tsx src/features/story/StoryPanel.tsx src/features/common/TaskTracker.tsx tests/e2e/chapter-sequence.test.tsx
git commit -m "feat: connect chapter 1 and chapter 2 complete flow"
```

### Task 11: 验证与文档

**Files:**
- Create: `README.md`
- Create: `docs/qa/ch1-ch2-test-matrix.md`

- [ ] **Step 1: Write the failing validation checklist**
列出必须通过的 11 条验收点（对应设计文档 Gate 与线索状态要求）。

- [ ] **Step 2: Run full test suite**
Run: `npm run test`
Expected: all PASS.

- [ ] **Step 3: Run build**
Run: `npm run build`
Expected: build success, no type errors.

- [ ] **Step 4: Manual verification**
Run: `npm run dev`
Expected: 可手动完成 CH1/CH2，且隐藏线索行为符合设计。

- [ ] **Step 5: Commit**
```bash
git add README.md docs/qa/ch1-ch2-test-matrix.md
git commit -m "docs: add runbook and chapter 1-2 QA matrix"
```

