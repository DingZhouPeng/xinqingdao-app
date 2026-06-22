import type { GameProgress, PetState, CurrencyState } from '../types/game';
import { DEFAULT_GAME_PROGRESS } from '../types/game';
import { addXP, checkEvolution } from './evolution';
import type { EvolutionState, EvolutionTrait, EvolutionStage } from '../types/evolution';

const GAME_STORAGE_KEY = 'xinqingdao-game-progress-v1';

export function loadGameProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (!raw) return DEFAULT_GAME_PROGRESS;
    const parsed = JSON.parse(raw) as GameProgress;

    // 更新宠物状态（随时间衰减）
    const updatedPet = updatePetStateOverTime(parsed.petState);

    return {
      ...parsed,
      petState: updatedPet
    };
  } catch {
    return DEFAULT_GAME_PROGRESS;
  }
}

export function saveGameProgress(progress: GameProgress): void {
  localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(progress));
}

// 随时间更新宠物状态
function updatePetStateOverTime(state: PetState): PetState {
  const now = new Date();
  const lastUpdate = new Date(state.lastUpdate);
  const hoursPassed = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

  if (hoursPassed < 0.1) return state; // 不到 6 分钟不更新

  // 每小时衰减
  const hungerDecay = Math.min(hoursPassed * 5, 30); // 最多扣30
  const energyDecay = Math.min(hoursPassed * 3, 20); // 最多扣20
  const happinessDecay = Math.min(hoursPassed * 2, 15); // 最多扣15

  return {
    ...state,
    hunger: Math.max(0, state.hunger - hungerDecay),
    energy: Math.max(0, state.energy - energyDecay),
    happiness: Math.max(0, state.happiness - happinessDecay),
    lastUpdate: now.toISOString()
  };
}

// 喂食
export function feedPet(progress: GameProgress): GameProgress {
  const cost = 10;
  if (progress.currency.coins < cost) return progress;

  return {
    ...progress,
    petState: {
      ...progress.petState,
      hunger: Math.min(100, progress.petState.hunger + 30),
      happiness: Math.min(100, progress.petState.happiness + 5),
      lastUpdate: new Date().toISOString()
    },
    currency: {
      ...progress.currency,
      coins: progress.currency.coins - cost
    }
  };
}

// 玩耍
export function playWithPet(progress: GameProgress): GameProgress {
  const cost = 5;
  if (progress.currency.coins < cost) return progress;

  return {
    ...progress,
    petState: {
      ...progress.petState,
      happiness: Math.min(100, progress.petState.happiness + 20),
      energy: Math.max(0, progress.petState.energy - 10),
      lastUpdate: new Date().toISOString()
    },
    currency: {
      ...progress.currency,
      coins: progress.currency.coins - cost
    }
  };
}

// 休息
export function restPet(progress: GameProgress): GameProgress {
  return {
    ...progress,
    petState: {
      ...progress.petState,
      energy: Math.min(100, progress.petState.energy + 40),
      lastUpdate: new Date().toISOString()
    }
  };
}

// 奖励货币
export function earnCoins(progress: GameProgress, amount: number, reason: string): GameProgress {
  return {
    ...progress,
    currency: {
      coins: progress.currency.coins + amount,
      earnedToday: progress.currency.earnedToday + amount,
      totalEarned: progress.currency.totalEarned + amount
    }
  };
}

// 获取宠物状态描述
export function getPetMood(state: PetState): 'happy' | 'neutral' | 'sad' | 'tired' | 'hungry' {
  if (state.hunger < 30) return 'hungry';
  if (state.energy < 30) return 'tired';
  if (state.happiness < 40) return 'sad';
  if (state.happiness > 70 && state.energy > 60) return 'happy';
  return 'neutral';
}

// 购买装扮
export function purchaseOutfit(progress: GameProgress, outfitId: string, price: number): GameProgress {
  if (progress.currency.coins < price) return progress;
  if (progress.unlockedOutfits.includes(outfitId)) return progress;

  return {
    ...progress,
    currency: {
      ...progress.currency,
      coins: progress.currency.coins - price
    },
    unlockedOutfits: [...progress.unlockedOutfits, outfitId]
  };
}

// 装备装扮
export function equipOutfit(progress: GameProgress, outfitId: string | undefined): GameProgress {
  return {
    ...progress,
    petState: {
      ...progress.petState,
      outfit: outfitId
    }
  };
}

// 精灵进化 - 添加 XP
export function addPetXp(
  progress: GameProgress,
  amount: number
): { newProgress: GameProgress; didEvolve: boolean; newTraits: EvolutionTrait[]; newStage?: EvolutionStage } {
  const evolution = progress.petState.evolution;
  if (!evolution) return { newProgress: progress, didEvolve: false, newTraits: [] };

  const prevStage = evolution.stage;
  const { newState, newStage: evolvedStage } = addXP(evolution, amount);

  // Check if traits were unlocked
  const { newState: finalState, newTraits, stageUp } = checkEvolution(newState, prevStage);

  return {
    newProgress: {
      ...progress,
      petState: {
        ...progress.petState,
        evolution: finalState,
      },
    },
    didEvolve: stageUp,
    newTraits,
    newStage: evolvedStage,
  };
}

