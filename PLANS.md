# PLANS.md — 心晴岛 APP 构建计划

## Milestone 1：MVP 骨架

目标：让 APP 能启动、导航能切换、首页视觉成立。

任务：

- 建立 Vite + React + TypeScript 工程。
- 完成移动端 AppShell 和底部导航。
- 完成 Home、Mood、Relief、Social、Growth、Lighthouse 六个入口。
- 完成设计系统变量和基础卡片/按钮/标签样式。

验收：`npm run build` 成功，首页在 375px 下美观。

## Milestone 2：核心心理流程

目标：走通“记录 → ABC → 行动卡 → 再评分 → 保存”。

任务：

- 实现 MoodPage 的情绪、强度、场景、事件表单。
- 实现 AiGuidePage 的 ABC 引导。
- 实现 ruleEngine 推荐五育任务。
- 实现 ActionPage 完成后再评分并保存本地记录。
- GrowthPage 显示记录和统计。

验收：测试覆盖考试紧张、人际生气、没动力三种路径。

## Milestone 3：趣味性与交互性

目标：让作品“有人想用”。

任务：

- 岛屿天气根据记录变化。
- 呼吸圆圈动画。
- 行动卡翻牌视觉。
- 完成后获得阳光值、水滴、小灯。
- 技能卡解锁。

验收：首页能显示岛屿变化和成长反馈。

## Milestone 4：社交与安全

目标：弱社交、强支持、风险有出口。

任务：

- 温暖漂流瓶使用预设模板与贴纸。
- 小队树、班级能量树使用模拟数据。
- Lighthouse 支持人和求助话术。
- safety.ts 风险词检测。

验收：风险词输入时不生成普通建议，直接展示求助提示。

## Milestone 5：比赛交付

目标：能录屏、能讲解、能提交。

任务：

- 生成页面截图。
- 写创作日志。
- 整理测试报告。
- 完成说明文档所需的流程图、功能表、心理学原理对应表。
- 打包源码和可运行版本。

验收：按 `docs/07_COMPETITION_DELIVERABLES.md` 检查通过。
