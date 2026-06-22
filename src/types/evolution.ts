// ============================================
// 晴晴精灵进化系统类型定义
// ============================================

export type EvolutionStage = 1 | 2 | 3 | 4 | 5;
export type TraitRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type TraitType = 'color' | 'particle' | 'accessory' | 'aura';

export interface EvolutionTrait {
  id: string;
  type: TraitType;
  name: string;
  emoji: string;
  rarity: TraitRarity;
  cssClass: string;
}

export interface EvolutionState {
  level: number;
  xp: number;
  xpToNext: number;
  stage: EvolutionStage;
  traits: EvolutionTrait[];
  fusionCount: number;       // 合体进化次数
  totalRelayXp: number;       // 通过接力获得的 XP
  pendingFusion?: {           // 待处理的合体
    partnerAlias: string;
    grantedAt: string;
  };
}

// ============================================
// 进化阶段定义
// ============================================

export interface StageDefinition {
  stage: EvolutionStage;
  name: string;
  emoji: string;
  xpRequired: number;
  traitSlots: number;         // 该阶段可拥有的突变数
  sizeMultiplier: number;     // 宠物大小倍率
  description: string;
}

export const EVOLUTION_STAGES: StageDefinition[] = [
  { stage: 1, name: '晴晴幼芽', emoji: '🌱', xpRequired: 0, traitSlots: 1, sizeMultiplier: 0.8, description: '一颗小小的种子，等待着成长' },
  { stage: 2, name: '晴晴嫩叶', emoji: '🌿', xpRequired: 50, traitSlots: 2, sizeMultiplier: 1.0, description: '冒出了嫩绿的叶子，开始散发微光' },
  { stage: 3, name: '晴晴花苞', emoji: '🌸', xpRequired: 150, traitSlots: 3, sizeMultiplier: 1.2, description: '绽放出美丽的花苞，活力满满' },
  { stage: 4, name: '晴晴闪耀', emoji: '⭐', xpRequired: 350, traitSlots: 4, sizeMultiplier: 1.4, description: '闪耀着星光，成为最亮眼的存在' },
  { stage: 5, name: '晴晴守护者', emoji: '👑', xpRequired: 700, traitSlots: 6, sizeMultiplier: 1.7, description: '心晴岛的守护精灵，传说中的存在' },
];

// ============================================
// 随机突变池
// ============================================

export interface TraitDefinition {
  id: string;
  type: TraitType;
  name: string;
  emoji: string;
  rarity: TraitRarity;
  cssClass: string;
}

export const TRAIT_POOL: TraitDefinition[] = [
  // 🎨 颜色突变
  { id: 'color-sakura', type: 'color', name: '樱花粉', emoji: '🌸', rarity: 'common', cssClass: 'evo-color-sakura' },
  { id: 'color-ocean', type: 'color', name: '海洋蓝', emoji: '🌊', rarity: 'common', cssClass: 'evo-color-ocean' },
  { id: 'color-sunset', type: 'color', name: '日落橙', emoji: '🌅', rarity: 'common', cssClass: 'evo-color-sunset' },
  { id: 'color-mint', type: 'color', name: '薄荷绿', emoji: '🍃', rarity: 'common', cssClass: 'evo-color-mint' },
  { id: 'color-lavender', type: 'color', name: '薰衣草紫', emoji: '💜', rarity: 'uncommon', cssClass: 'evo-color-lavender' },
  { id: 'color-gold', type: 'color', name: '闪耀金', emoji: '✨', rarity: 'rare', cssClass: 'evo-color-gold' },
  { id: 'color-rainbow', type: 'color', name: '彩虹渐变', emoji: '🌈', rarity: 'legendary', cssClass: 'evo-color-rainbow' },
  { id: 'color-nebula', type: 'color', name: '星云暗夜', emoji: '🌌', rarity: 'legendary', cssClass: 'evo-color-nebula' },

  // ✨ 粒子突变
  { id: 'particle-stars', type: 'particle', name: '星星环绕', emoji: '⭐', rarity: 'common', cssClass: 'evo-particle-stars' },
  { id: 'particle-hearts', type: 'particle', name: '爱心飘浮', emoji: '💕', rarity: 'uncommon', cssClass: 'evo-particle-hearts' },
  { id: 'particle-sparkles', type: 'particle', name: '闪光粒子', emoji: '✨', rarity: 'uncommon', cssClass: 'evo-particle-sparkles' },
  { id: 'particle-snow', type: 'particle', name: '雪花飞舞', emoji: '❄️', rarity: 'rare', cssClass: 'evo-particle-snow' },
  { id: 'particle-fire', type: 'particle', name: '火焰光环', emoji: '🔥', rarity: 'rare', cssClass: 'evo-particle-fire' },
  { id: 'particle-lightning', type: 'particle', name: '闪电环绕', emoji: '⚡', rarity: 'legendary', cssClass: 'evo-particle-lightning' },

  // 🎀 配饰突变
  { id: 'acc-bow', type: 'accessory', name: '蝴蝶结', emoji: '🎀', rarity: 'common', cssClass: 'evo-acc-bow' },
  { id: 'acc-scarf', type: 'accessory', name: '小围巾', emoji: '🧣', rarity: 'common', cssClass: 'evo-acc-scarf' },
  { id: 'acc-glasses', type: 'accessory', name: '圆眼镜', emoji: '👓', rarity: 'uncommon', cssClass: 'evo-acc-glasses' },
  { id: 'acc-wings', type: 'accessory', name: '小翅膀', emoji: '🦋', rarity: 'rare', cssClass: 'evo-acc-wings' },
  { id: 'acc-crown', type: 'accessory', name: '皇冠', emoji: '👑', rarity: 'legendary', cssClass: 'evo-acc-crown' },
  { id: 'acc-halo', type: 'accessory', name: '天使光环', emoji: '😇', rarity: 'legendary', cssClass: 'evo-acc-halo' },

  // 🌈 光环突变
  { id: 'aura-soft', type: 'aura', name: '柔和白光', emoji: '💫', rarity: 'common', cssClass: 'evo-aura-soft' },
  { id: 'aura-glow', type: 'aura', name: '温暖微光', emoji: '🌟', rarity: 'common', cssClass: 'evo-aura-glow' },
  { id: 'aura-pulse', type: 'aura', name: '脉动光环', emoji: '💗', rarity: 'uncommon', cssClass: 'evo-aura-pulse' },
  { id: 'aura-golden', type: 'aura', name: '金色圣光', emoji: '👼', rarity: 'rare', cssClass: 'evo-aura-golden' },
  { id: 'aura-rainbow', type: 'aura', name: '彩虹旋转', emoji: '🌈', rarity: 'legendary', cssClass: 'evo-aura-rainbow' },
  { id: 'aura-cosmic', type: 'aura', name: '宇宙星环', emoji: '🪐', rarity: 'legendary', cssClass: 'evo-aura-cosmic' },
];

// ============================================
// 默认进化状态
// ============================================

export function createDefaultEvolution(): EvolutionState {
  return {
    level: 1,
    xp: 0,
    xpToNext: 50,
    stage: 1,
    traits: [],
    fusionCount: 0,
    totalRelayXp: 0,
  };
}

// ============================================
// XP 奖励表
// ============================================

export const XP_REWARDS = {
  recordMood: 5,
  createRelayMessage: 20,
  relayCodeUsed: 30,        // 有人用了你的分享码
  receiveRelayResponse: 25,  // 收到接力回应
  chainPersonAdded: 10,      // 接力链每增加1人
  unlockAchievement: 15,
  firstEvolution: 40,        // 首次进化到新阶段
  feedPet: 3,
  playPet: 3,
  dailyTaskComplete: 8,
  fusionEvolution: 50,       // 合体进化
};

// ============================================
// 稀有度权重（用于随机抽取）
// ============================================

export const RARITY_WEIGHTS: Record<TraitRarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 12,
  legendary: 3,
};

// ============================================
// 稀有度提升表（合体进化用）
// ============================================

export const FUSION_RARITY_BOOST: Record<TraitRarity, TraitRarity> = {
  common: 'uncommon',
  uncommon: 'rare',
  rare: 'legendary',
  legendary: 'legendary',   // 已经传说级保持不变
};
