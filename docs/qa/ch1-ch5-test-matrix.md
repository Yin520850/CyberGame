# CH1-CH5 验收矩阵

## 自动化验证

| ID | 验收项 | 覆盖测试 |
|---|---|---|
| QA-01 | 默认渲染标题 | `tests/smoke/app-smoke.test.tsx` |
| QA-02 | 模式切换可用 | `tests/smoke/mode-toggle.test.tsx` |
| QA-03 | 线索状态流转合法 | `tests/engine/clues.test.ts` |
| QA-04 | 章节门控判定正确 | `tests/engine/gates.test.ts` |
| QA-05 | Store 行为正确（模式/线索/地点/剧情） | `tests/store/gameStore.test.ts` |
| QA-06 | CH1 配置完整（线索与 Gate） | `tests/chapters/ch1-config.test.ts` |
| QA-07 | CH1 采集不足不能进入判断 | `tests/chapters/ch1-flow.test.tsx` |
| QA-08 | CH1 仅在 3/3 正确时通关 | `tests/chapters/ch1-flow.test.tsx` |
| QA-09 | CH2 任意两张照片解锁时间线 | `tests/chapters/ch2-flow.test.tsx` |
| QA-10 | CH2 需四条主线索后可行性判断 | `tests/chapters/ch2-flow.test.tsx` |
| QA-11 | CH3 主线索收集后解锁线索溯源 | `tests/chapters/ch3-flow.test.tsx` |
| QA-12 | CH4 主线索收集后解锁交叉验证 | `tests/chapters/ch4-flow.test.tsx` |
| QA-13 | CH5 主线索收集后解锁结案报告 | `tests/chapters/ch5-flow.test.tsx` |
| QA-14 | CH4/CH5 连续失败触发分级提示 | `tests/chapters/ch4-flow.test.tsx`、`tests/chapters/ch5-flow.test.tsx` |
| QA-15 | CH1 -> CH5 全链路通关与结案摘要 | `tests/e2e/chapter-sequence.test.tsx` |
| QA-16 | 终章“重新开始调查”重置到 CH1 | `tests/e2e/chapter-sequence.test.tsx` |
| QA-17 | 章节入口门控对未达剧情节点保持关闭 | `tests/chapters/progression.test.ts` |
| QA-18 | Store 进度支持本地持久化读写与重置 | `tests/store/gameStore.test.ts` |
| QA-19 | 终章完成后不可再次进入结案问答 | `tests/chapters/ch5-flow.test.tsx` |
| QA-20 | Gal 场景演出与 CG 锁定/解锁展示正确 | `tests/story/gal-presentation.test.tsx` |
| QA-21 | 小后端云存档接口支持登录与读写回环 | `tests/server/cloud-api.test.ts` |
| QA-22 | 账号注册/登录、受保护进度与排行榜可用 | `tests/server/auth-api.test.ts` |

## 运行命令

```bash
npm run test
npm run build
```

## 最新执行结果（2026-03-11）

- `npm run test`: 20 files / 39 tests 全部通过
- `npm run build`: 通过
