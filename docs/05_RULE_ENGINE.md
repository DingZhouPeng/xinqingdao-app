# 05 规则型 AI 推荐引擎

## 输入

```ts
MoodInput = {
  mood: MoodType;
  intensity: number; // 1-10
  scene: SceneTag;
  eventText: string;
}

ABCInput = {
  event: string;
  belief: string;
  consequence: string;
}
```

## 处理步骤

```text
1. safety.ts 检测风险词。
2. intensity 转为 low/mid/high/veryHigh。
3. scene + keywords 判断场景。
4. mood + scene 匹配心理策略。
5. taskLibrary 中抽取五育任务。
6. 生成 newThought 与 explainText。
7. 输出 Recommendation。
```

## 输出示例

考试紧张：

```text
心理小解释：你现在的紧张可能和“我必须考好，否则我就不行”的想法有关。
换个角度：一次考试不能代表全部能力，它可以帮我发现需要复习的地方。
先做：一分钟方块呼吸。
五育任务：体-呼吸；智-列出三处复习重点；劳-整理桌面三分钟。
```

## 风险规则

- `intensity >= 9`：加入“建议联系支持人”。
- 命中高风险词：返回 `safetyLevel = high`，不生成普通行动卡。
