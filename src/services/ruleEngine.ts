import type { ABCInput, MoodInput, Recommendation, WuyuTask } from '../types';
import { taskLibrary } from '../data/taskLibrary';
import { checkSafety } from './safety';

function hasKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function pickTasks(input: MoodInput): WuyuTask[] {
  const selected: WuyuTask[] = [];
  const byMood = taskLibrary.filter((task) => task.mood === input.mood);
  const byScene = taskLibrary.filter((task) => task.scene === input.scene);
  selected.push(...byMood, ...byScene);

  if (input.intensity >= 7 && !selected.some((task) => task.id === 'body-breath-60')) {
    selected.unshift(taskLibrary.find((task) => task.id === 'body-breath-60')!);
  }

  if (input.scene === 'study') {
    selected.push(taskLibrary.find((task) => task.id === 'labor-desk-3')!);
  }

  if (input.mood === 'sad' || input.scene === 'family') {
    selected.push(taskLibrary.find((task) => task.id === 'moral-help-script')!);
  }

  selected.push(taskLibrary.find((task) => task.id === 'art-weather-draw')!);

  const unique = new Map(selected.filter(Boolean).map((task) => [task.id, task]));
  const tasks = Array.from(unique.values());
  const preferredOrder = ['体', '智', '德', '美', '劳'];
  tasks.sort((a, b) => preferredOrder.indexOf(a.category) - preferredOrder.indexOf(b.category));
  return tasks.slice(0, 4);
}

function buildNewThought(input: MoodInput, abc?: ABCInput): string {
  const text = `${input.eventText} ${abc?.belief ?? ''}`;
  if (input.scene === 'study' || hasKeyword(text, ['考试', '成绩', '作业', '复习'])) {
    return '一次考试或作业不能代表全部能力。它更像一张提示卡，告诉我下一步可以先复习哪一小块。';
  }
  if (input.scene === 'friends' || hasKeyword(text, ['朋友', '同学', '吵架', '误会'])) {
    return '对方的反应不一定等于不在乎我。等情绪慢一点后，我可以先表达感受，再听听对方的想法。';
  }
  if (input.scene === 'family' || hasKeyword(text, ['爸爸', '妈妈', '父母', '家里'])) {
    return '家人之间的不同意见不代表不被爱。我可以找一个比较平静的时间，说清楚自己的感受和需要。';
  }
  if (input.scene === 'self' || hasKeyword(text, ['我不行', '很差', '失败'])) {
    return '我现在遇到的是一个困难，不是对我的全部评价。把评价换成下一步行动，我会更有力量。';
  }
  return '这份情绪是在提醒我需要照顾自己。先做一个小行动，不用一下子解决所有事情。';
}

function buildExplainText(input: MoodInput): string {
  if (input.intensity >= 8) {
    return '你现在的情绪强度比较高，先让身体稳定下来，再处理事情，会更容易做出不后悔的选择。';
  }
  if (input.mood === 'nervous') return '紧张常常来自对结果的担心。把大目标拆成眼前能做的小步骤，会更容易开始。';
  if (input.mood === 'angry') return '生气时大脑容易想立刻反击。暂停一下，可以保护自己，也保护关系。';
  if (input.mood === 'sad') return '难过不是失败，它说明你很在意。把感受说出来，是照顾自己的第一步。';
  if (input.mood === 'tired') return '疲惫时不一定需要更用力，有时需要先补充能量，再重新开始。';
  return '谢谢你愿意记录。看见情绪，就是调整情绪的开始。';
}

function buildFirstAid(input: MoodInput): string {
  if (input.mood === 'angry') return '先做 90 秒暂停：把手机放下，喝一口水，等情绪降一格再回应。';
  if (input.mood === 'nervous' || input.intensity >= 7) return '先做一分钟方块呼吸：吸气 4 秒，停顿 4 秒，呼气 4 秒，停顿 4 秒。';
  if (input.mood === 'tired' || input.mood === 'stressed') return '先做三分钟启动：只整理桌面一角，或者只写第一行作业。';
  return '先把此刻的心情天气记录下来，不评价自己。';
}

export function generateRecommendation(input: MoodInput, abc?: ABCInput): Recommendation {
  const safety = checkSafety([input.eventText, abc?.event ?? '', abc?.belief ?? '', abc?.consequence ?? ''], input.intensity);

  if (safety.level === 'high') {
    return {
      title: '求助灯塔提醒',
      safetyLevel: 'high',
      explainText: safety.message,
      newThought: '现在最重要的不是一个人撑住，而是让真实的人知道你需要陪伴和帮助。',
      firstAid: '请立刻联系身边可信任的大人、老师或家长；情况紧急时联系当地紧急救助渠道。',
      tasks: [taskLibrary.find((task) => task.id === 'moral-help-script')!],
      skillCardIds: ['ask-help'],
      tags: ['安全提醒', '真实支持']
    };
  }

  const tasks = pickTasks(input);
  const title = input.scene === 'study' ? '考试稳定卡' : input.scene === 'friends' ? '不伤人表达卡' : input.mood === 'tired' ? '三分钟启动卡' : '心晴补给卡';
  const skillCardIds = ['emotion-name', 'abc'];
  if (tasks.some((task) => task.id === 'body-breath-60')) skillCardIds.push('breath');
  if (tasks.some((task) => task.id === 'moral-i-message')) skillCardIds.push('i-message');
  if (tasks.some((task) => task.id === 'labor-desk-3')) skillCardIds.push('start-3min');
  if (safety.level === 'watch') skillCardIds.push('ask-help');

  return {
    title,
    safetyLevel: safety.level,
    explainText: safety.level === 'watch' ? `${safety.message} ${buildExplainText(input)}` : buildExplainText(input),
    newThought: buildNewThought(input, abc),
    firstAid: buildFirstAid(input),
    tasks,
    skillCardIds: Array.from(new Set(skillCardIds)),
    tags: [input.scene, input.mood, input.intensity >= 7 ? '高强度' : '日常调节']
  };
}
