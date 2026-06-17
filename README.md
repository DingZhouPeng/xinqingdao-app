# 心晴岛 APP：校园情绪补给与五育成长伙伴

这是一个 Codex-ready 的 APP 构建包，目标是高效做出心理大赛可演示作品。

## 产品定位

心晴岛不是心理诊断 APP，而是一个校园情绪补给工具。学生可以用心情天气记录情绪，用晴晴助手整理想法，用五育行动卡完成一个小行动，用岛屿养成和温暖小队获得持续支持。

## 推荐实现路线

本仓库采用：

```text
React + TypeScript + Vite + 原生 CSS 设计系统 + LocalStorage + Vitest + Playwright + Capacitor
```

先做 H5/PWA，跑通后用 Capacitor 打包为 Android APP。这样既能作为网站展示，也能作为 APP 演示。

## 快速开始

```bash
npm install
npm run dev
```

检查质量：

```bash
npm run typecheck
npm run test
npm run build
```

端到端测试：

```bash
npx playwright install
npm run e2e
```

打包 Android APP 的后续路径：

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## 目录

```text
AGENTS.md                  Codex 总指令
PLANS.md                   构建计划与里程碑
docs/                      产品、UI、心理安全、测试和提交说明
prompts/                   可直接丢给 Codex 的任务提示词
src/                       APP 源码
tests/                     单元测试与端到端测试
public/                    PWA manifest 与图标
```

## 关键演示流程

```text
首页心晴岛
→ 记录心情天气
→ 晴晴助手 ABC 引导
→ 生成五育行动卡
→ 完成后再评分
→ 成长记录保存
→ 温暖小队收到贴纸
→ 求助灯塔展示安全边界
```

## 比赛提交建议

最终附件包建议包含：

```text
01_APP源码/
02_APP安装包或H5链接说明/
03_页面截图/
04_流程图与草图/
05_创作日志.pdf
06_测试反馈表.pdf
07_讲解视频素材/
08_素材来源说明.pdf
```
