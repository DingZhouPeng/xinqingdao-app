import type { AppStateSnapshot, EmotionRecord, UserProfile } from '../types';

const STORAGE_KEY = 'xinqingdao-state-v1';

export const defaultSnapshot: AppStateSnapshot = {
  profile: null,
  records: [],
  sunlight: 12,
  waterDrops: 8,
  lamps: 1
};

export function loadSnapshot(): AppStateSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSnapshot;
    const parsed = JSON.parse(raw) as AppStateSnapshot;
    return { ...defaultSnapshot, ...parsed };
  } catch {
    return defaultSnapshot;
  }
}

export function saveSnapshot(snapshot: AppStateSnapshot): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function createProfile(nickname: string, focus: string, supporters: string[]): UserProfile {
  return {
    nickname: nickname.trim() || '小岛同学',
    focus,
    supporters: supporters.filter(Boolean),
    createdAt: new Date().toISOString()
  };
}

export function createRecordId(): string {
  return `record-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function appendRecord(snapshot: AppStateSnapshot, record: EmotionRecord): AppStateSnapshot {
  return {
    ...snapshot,
    records: [record, ...snapshot.records].slice(0, 50),
    sunlight: snapshot.sunlight + 3,
    waterDrops: snapshot.waterDrops + 2,
    lamps: snapshot.lamps + (record.recommendation.safetyLevel === 'watch' ? 1 : 0)
  };
}
