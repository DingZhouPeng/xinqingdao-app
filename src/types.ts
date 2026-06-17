export type MoodType = 'happy' | 'calm' | 'nervous' | 'angry' | 'sad' | 'tired' | 'confused' | 'stressed';
export type SceneTag = 'study' | 'friends' | 'family' | 'self' | 'body' | 'unknown';
export type WuyuCategory = '德' | '智' | '体' | '美' | '劳';
export type SafetyLevel = 'none' | 'watch' | 'high';
export type ActiveView = 'home' | 'mood' | 'relief' | 'ai' | 'action' | 'social' | 'growth' | 'lighthouse' | 'onboarding' | 'shop' | 'daily-tasks' | 'pet-care' | 'achievements';

export type { GameProgress, PetState, CurrencyState } from './types/game';

export interface UserProfile {
  nickname: string;
  focus: string;
  supporters: string[];
  createdAt: string;
}

export interface MoodInput {
  mood: MoodType;
  intensity: number;
  scene: SceneTag;
  eventText: string;
}

export interface ABCInput {
  event: string;
  belief: string;
  consequence: string;
}

export interface WuyuTask {
  id: string;
  category: WuyuCategory;
  title: string;
  detail: string;
  scene?: SceneTag;
  mood?: MoodType;
  principle: string;
}

export interface Recommendation {
  title: string;
  safetyLevel: SafetyLevel;
  explainText: string;
  newThought: string;
  firstAid: string;
  tasks: WuyuTask[];
  skillCardIds: string[];
  tags: string[];
}

export interface EmotionRecord {
  id: string;
  date: string;
  input: MoodInput;
  abc: ABCInput;
  recommendation: Recommendation;
  intensityAfter: number;
  reflection: string;
}

export interface AppStateSnapshot {
  profile: UserProfile | null;
  records: EmotionRecord[];
  sunlight: number;
  waterDrops: number;
  lamps: number;
}
