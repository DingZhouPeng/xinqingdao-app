import type { EvolutionState } from './evolution';
import { createDefaultEvolution } from './evolution';

export interface PetState {
  hunger: number;      // 0-100，0最饿
  happiness: number;   // 0-100，0最不开心
  energy: number;      // 0-100，0最累
  lastUpdate: string;  // ISO 时间戳
  outfit?: string;     // 当前装扮 ID
  evolution?: EvolutionState; // 精灵进化状态
}

export interface CurrencyState {
  coins: number;       // 心晴币
  earnedToday: number; // 今日获得
  totalEarned: number; // 总获得
}

export interface GameProgress {
  petState: PetState;
  currency: CurrencyState;
  unlockedOutfits: string[];
  achievements: string[];
}

export const DEFAULT_PET_STATE: PetState = {
  hunger: 80,
  happiness: 80,
  energy: 80,
  lastUpdate: new Date().toISOString(),
  evolution: createDefaultEvolution()
};

export const DEFAULT_CURRENCY: CurrencyState = {
  coins: 50, // 初始送 50 币
  earnedToday: 0,
  totalEarned: 0
};

export const DEFAULT_GAME_PROGRESS: GameProgress = {
  petState: DEFAULT_PET_STATE,
  currency: DEFAULT_CURRENCY,
  unlockedOutfits: [],
  achievements: []
};
