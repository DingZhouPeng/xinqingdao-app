# 09 Codex 任务拆分

## Task 1：确认工程可运行

请读取 `AGENTS.md`、`README.md`、`docs/03_UI_DESIGN_SYSTEM.md`。运行 `npm install`，再运行 `npm run typecheck`、`npm run test`、`npm run build`。修复所有错误，不改产品范围。

## Task 2：加强首页 UI

请重点优化 `HomePage`、`IslandScene`、`theme.css`、`app.css`。要求首页像一个温暖的移动 APP：有岛屿、天气、主按钮、今日补给卡、成长反馈。375px 移动端必须美观。

## Task 3：完善主流程

请确保以下流程顺畅：Home → Mood → AI Guide → Action Card → Growth。所有按钮有明确下一步，记录能保存，完成后首页岛屿状态变化。

## Task 4：完善规则引擎测试

请检查 `ruleEngine.ts` 和 `safety.ts`，补充测试：考试紧张、人际生气、没动力、强度 9、风险词。

## Task 5：增强社交但保持安全

请完善 `SocialPage`，只使用预设贴纸、模拟漂流瓶、小队树、班级能量树。不做自由评论、不做私信、不做排行榜。

## Task 6：比赛交付打磨

请生成 `docs/SCREENSHOT_CHECKLIST.md`，列出需要截图的页面、截图用途、说明文档放置位置。确保 README 中有打包和提交说明。
