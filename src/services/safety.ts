import type { SafetyLevel } from '../types';

const highRiskKeywords = [
  '不想活',
  '轻生',
  '自杀',
  '伤害自己',
  '结束生命',
  '跳楼',
  '割腕',
  '活不下去',
  '消失算了'
];

const watchKeywords = ['撑不住', '崩溃', '绝望', '没人管', '受不了了'];

export interface SafetyCheckResult {
  level: SafetyLevel;
  matched: string[];
  message: string;
}

export function checkSafety(texts: string[], intensity?: number): SafetyCheckResult {
  const joined = texts.join(' ').toLowerCase();
  const highMatches = highRiskKeywords.filter((keyword) => joined.includes(keyword));
  if (highMatches.length > 0) {
    return {
      level: 'high',
      matched: highMatches,
      message: '你现在需要真实的人陪伴和帮助。请立刻联系身边可信任的大人、老师或家长。如果情况紧急，请联系当地紧急救助渠道。'
    };
  }

  const watchMatches = watchKeywords.filter((keyword) => joined.includes(keyword));
  if ((intensity ?? 0) >= 9 || watchMatches.length > 0) {
    return {
      level: 'watch',
      matched: watchMatches,
      message: '这份情绪强度比较高。请不要一个人硬扛，可以联系家长、老师或信任的朋友陪你一起面对。'
    };
  }

  return { level: 'none', matched: [], message: '' };
}
