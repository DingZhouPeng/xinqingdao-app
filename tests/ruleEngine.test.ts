import { describe, expect, it } from 'vitest';
import { generateRecommendation } from '../src/services/ruleEngine';
import type { MoodInput } from '../src/types';

function input(partial: Partial<MoodInput>): MoodInput {
  return {
    mood: 'nervous',
    intensity: 6,
    scene: 'study',
    eventText: '明天考试，我担心考不好。',
    ...partial
  };
}

describe('generateRecommendation', () => {
  it('为考试紧张推荐呼吸、学习拆解和整理任务', () => {
    const rec = generateRecommendation(input({ mood: 'nervous', intensity: 8, scene: 'study' }));
    const titles = rec.tasks.map((task) => task.title).join(' ');
    expect(rec.title).toContain('考试');
    expect(titles).toContain('呼吸');
    expect(titles).toContain('复习');
    expect(titles).toContain('整理');
  });

  it('为人际生气推荐暂停和表达句式', () => {
    const rec = generateRecommendation(input({ mood: 'angry', intensity: 8, scene: 'friends', eventText: '我和同学吵架了。' }));
    const text = `${rec.firstAid} ${rec.tasks.map((task) => task.title).join(' ')}`;
    expect(text).toContain('暂停');
    expect(text).toContain('表达');
  });

  it('高强度情绪加入安全关注', () => {
    const rec = generateRecommendation(input({ intensity: 9 }));
    expect(rec.safetyLevel).toBe('watch');
    expect(rec.explainText).toContain('联系');
  });

  it('风险词触发高风险安全提醒', () => {
    const rec = generateRecommendation(input({ eventText: '我不想活了。' }));
    expect(rec.safetyLevel).toBe('high');
    expect(rec.title).toContain('求助');
  });
});
