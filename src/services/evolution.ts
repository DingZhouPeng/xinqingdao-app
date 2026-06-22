// ============================================
// 晴晴精灵进化系统 — 核心逻辑
// ============================================

import type { EvolutionState, EvolutionTrait, EvolutionStage, TraitRarity } from '../types/evolution';
import {
  createDefaultEvolution,
  EVOLUTION_STAGES,
  TRAIT_POOL,
  RARITY_WEIGHTS,
  FUSION_RARITY_BOOST,
} from '../types/evolution';

// ============================================
// XP 管理
// ============================================

export function addXP(state: EvolutionState, amount: number): {
  newState: EvolutionState;
  didLevelUp: boolean;
  newStage?: EvolutionStage;
} {
  let newXp = state.xp + amount;
  let newLevel = state.level;
  let stage = state.stage;

  // Check if we need to level up (level = xp / 50, roughly)
  const targetLevel = Math.floor(newXp / 50) + 1;
  if (targetLevel > state.level) {
    newLevel = targetLevel;
  }

  // Check evolution stage
  const stageDef = EVOLUTION_STAGES.find(s => s.stage === stage)!;
  const nextStage = EVOLUTION_STAGES.find(s => s.stage === stage + 1);
  let newStage = stage;
  if (nextStage && newXp >= nextStage.xpRequired) {
    newStage = nextStage.stage as EvolutionStage;
  }

  const newState: EvolutionState = {
    ...state,
    xp: newXp,
    level: newLevel,
    xpToNext: getXpForNextLevel(newLevel),
    stage: newStage,
  };

  return {
    newState,
    didLevelUp: newLevel > state.level,
    newStage: newStage > stage ? newStage : undefined,
  };
}

function getXpForNextLevel(level: number): number {
  return level * 50;
}

// ============================================
// 进化判定 — 随机突变生成
// ============================================

export function checkEvolution(
  state: EvolutionState,
  previousStage: EvolutionStage
): { newState: EvolutionState; newTraits: EvolutionTrait[]; stageUp: boolean } {
  if (state.stage <= previousStage) {
    return { newState: state, newTraits: [], stageUp: false };
  }

  const stageDef = EVOLUTION_STAGES.find(s => s.stage === state.stage)!;
  const currentTraitCount = state.traits.length;
  const maxSlots = stageDef.traitSlots;
  const slotsToFill = Math.min(2, maxSlots - currentTraitCount); // 最多2个新突变

  const newTraits: EvolutionTrait[] = [];
  const existingIds = new Set(state.traits.map(t => t.id));

  for (let i = 0; i < slotsToFill; i++) {
    const trait = rollRandomTrait(existingIds);
    if (trait) {
      newTraits.push(trait);
      existingIds.add(trait.id);
    }
  }

  return {
    newState: {
      ...state,
      traits: [...state.traits, ...newTraits],
    },
    newTraits,
    stageUp: true,
  };
}

// ============================================
// 随机突变抽取
// ============================================

export function rollRandomTrait(excludeIds?: Set<string>): EvolutionTrait | null {
  // 按稀有度权重抽取
  const rarity = rollRarity();
  const candidates = TRAIT_POOL.filter(t => {
    if (t.rarity !== rarity) return false;
    if (excludeIds?.has(t.id)) return false;
    return true;
  });

  // 如果该稀有度没有可用突变，降级抽取
  let pool = candidates;
  let currentRarity: TraitRarity = rarity;
  while (pool.length === 0 && currentRarity !== 'common') {
    currentRarity = downgradeRarity(currentRarity);
    pool = TRAIT_POOL.filter(t => t.rarity === currentRarity && !excludeIds?.has(t.id));
  }

  if (pool.length === 0) return null;

  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { id: pick.id, type: pick.type, name: pick.name, emoji: pick.emoji, rarity: pick.rarity, cssClass: pick.cssClass };
}

function rollRarity(): TraitRarity {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;

  const rarities: TraitRarity[] = ['legendary', 'rare', 'uncommon', 'common'];
  for (const r of rarities) {
    roll -= RARITY_WEIGHTS[r];
    if (roll <= 0) return r;
  }
  return 'common';
}

function downgradeRarity(rarity: TraitRarity): TraitRarity {
  const order: TraitRarity[] = ['legendary', 'rare', 'uncommon', 'common'];
  const idx = order.indexOf(rarity);
  return idx < order.length - 1 ? order[idx + 1] : 'common';
}

// ============================================
// 合体进化
// ============================================

export function fusionEvolution(
  state: EvolutionState,
  partnerAlias: string
): { newState: EvolutionState; newTrait: EvolutionTrait; partnerAlias: string } {
  // 合体进化保证获得一个比当前稀有度高的突变
  const existingIds = new Set(state.traits.map(t => t.id));
  const highestRarity = getHighestRarity(state.traits);
  const boostedRarity = FUSION_RARITY_BOOST[highestRarity];

  const candidates = TRAIT_POOL.filter(t => {
    if (existingIds.has(t.id)) return false;
    // 在合体中，至少拿到 boost 后的稀有度
    const rarityOrder: TraitRarity[] = ['common', 'uncommon', 'rare', 'legendary'];
    return rarityOrder.indexOf(t.rarity) >= rarityOrder.indexOf(boostedRarity);
  });

  const trait = candidates.length > 0
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : rollRandomTrait(existingIds)!;

  if (!trait) {
    const fallback = rollRandomTrait(existingIds) || TRAIT_POOL[0];
    const newState: EvolutionState = {
      ...state,
      traits: [...state.traits, fallback],
      fusionCount: state.fusionCount + 1,
      pendingFusion: undefined,
    };
    return { newState, newTrait: fallback, partnerAlias };
  }

  const newState: EvolutionState = {
    ...state,
    traits: [...state.traits, trait],
    fusionCount: state.fusionCount + 1,
    pendingFusion: undefined,
  };

  return {
    newState,
    newTrait: trait,
    partnerAlias,
  };
}

// ============================================
// 辅助函数
// ============================================

export function getStageDef(stage: EvolutionStage) {
  return EVOLUTION_STAGES.find(s => s.stage === stage)!;
}

export function getHighestRarity(traits: EvolutionTrait[]): TraitRarity {
  const order: TraitRarity[] = ['common', 'uncommon', 'rare', 'legendary'];
  let highest: TraitRarity = 'common';
  for (const t of traits) {
    if (order.indexOf(t.rarity) > order.indexOf(highest)) {
      highest = t.rarity;
    }
  }
  return highest;
}

export function getTraitCountByRarity(traits: EvolutionTrait[], rarity: TraitRarity): number {
  return traits.filter(t => t.rarity === rarity).length;
}

export function getTotalPossibleTraits(): number {
  return TRAIT_POOL.length;
}

export function getStageProgress(state: EvolutionState): number {
  const current = EVOLUTION_STAGES.find(s => s.stage === state.stage)!;
  const next = EVOLUTION_STAGES.find(s => s.stage === state.stage + 1);
  if (!next) return 1; // Max stage
  return Math.min(1, (state.xp - current.xpRequired) / (next.xpRequired - current.xpRequired));
}
