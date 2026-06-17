import { describe, expect, it } from 'vitest';
import { checkSafety } from '../src/services/safety';

describe('checkSafety', () => {
  it('普通表达为 none', () => {
    expect(checkSafety(['我有点紧张'], 6).level).toBe('none');
  });

  it('强度 9 为 watch', () => {
    expect(checkSafety(['我很慌'], 9).level).toBe('watch');
  });

  it('高风险词为 high', () => {
    expect(checkSafety(['我想伤害自己'], 7).level).toBe('high');
  });
});
