// ============================================
// 梦幻西游风格道具系统
// 稀有度: 白(凡品) → 绿(良品) → 蓝(精品) → 紫(仙品) → 金(神品)
// ============================================

export type ItemRarity = 'white' | 'green' | 'blue' | 'purple' | 'gold';
export type ItemCategory = 'potion' | 'skill' | 'treasure' | 'material' | 'artifact';

export interface GameItem {
  id: string;
  name: string;
  emoji: string;
  rarity: ItemRarity;
  category: ItemCategory;
  description: string;
  effect: string;
}

export interface InventoryState {
  items: GameItem[];
  totalDrops: number;
  totalGifted: number;
  totalReceived: number;
}

export const RARITY_WEIGHTS: Record<ItemRarity, number> = {
  white: 60, green: 25, blue: 12, purple: 2.5, gold: 0.5
};

export const RARITY_LABELS: Record<ItemRarity, string> = {
  white: '凡品', green: '良品', blue: '精品', purple: '仙品', gold: '神品'
};

export const ITEM_POOL: GameItem[] = [
  // 白·凡品 (60%)
  { id: 'heal-pill', name: '回春丹', emoji: '💊', rarity: 'white', category: 'potion', description: '补充一点体力', effect: '恢复精灵5点体力' },
  { id: 'study-note', name: '练习册', emoji: '📖', rarity: 'white', category: 'skill', description: '普通的学习笔记', effect: '获得10点经验' },
  { id: 'herb-basic', name: '甘草', emoji: '🌿', rarity: 'white', category: 'material', description: '常见的草药', effect: '合成材料' },
  { id: 'coin-small', name: '碎银子', emoji: '🪙', rarity: 'white', category: 'treasure', description: '一点零花钱', effect: '获得20金币' },
  { id: 'bread', name: '馒头', emoji: '🍞', rarity: 'white', category: 'potion', description: '补充饱食度', effect: '恢复精灵10点饱食度' },

  // 绿·良品 (25%)
  { id: 'skill-scroll', name: '初级技能书', emoji: '📜', rarity: 'green', category: 'skill', description: '记载着基础心法', effect: '获得30点经验' },
  { id: 'talisman', name: '护身符', emoji: '🧿', rarity: 'green', category: 'treasure', description: '保佑平安的小物件', effect: '精灵获得护盾' },
  { id: 'energy-pill', name: '聚气丹', emoji: '💚', rarity: 'green', category: 'potion', description: '比回春丹更强的丹药', effect: '恢复精灵15点体力' },
  { id: 'jade-pen', name: '玉笔', emoji: '🖊️', rarity: 'green', category: 'material', description: '温润的玉制笔', effect: '合成材料' },

  // 蓝·精品 (12%)
  { id: 'spirit-stone', name: '灵石', emoji: '💎', rarity: 'blue', category: 'treasure', description: '蕴含灵气的宝石', effect: '获得80金币+精灵经验' },
  { id: 'skill-scroll-adv', name: '中级技能书', emoji: '📘', rarity: 'blue', category: 'skill', description: '进阶修炼心法', effect: '获得60点经验' },
  { id: 'fairy-dew', name: '仙露', emoji: '💧', rarity: 'blue', category: 'potion', description: '传说中的甘露', effect: '恢复精灵全部体力' },
  { id: 'cloud-silk', name: '云锦', emoji: '☁️', rarity: 'blue', category: 'material', description: '天上的云朵织成的锦', effect: '合成材料·稀有' },

  // 紫·仙品 (2.5%)
  { id: 'spirit-pearl', name: '灵珠', emoji: '🔮', rarity: 'purple', category: 'treasure', description: '千年灵气的结晶', effect: '获得200金币+稀有突变概率提升' },
  { id: 'phoenix-feather', name: '凤羽', emoji: '🪶', rarity: 'purple', category: 'material', description: '凤凰的羽毛，有奇异的温度', effect: '合成传说级装备' },
  { id: 'pet-egg-rare', name: '稀有灵宠蛋', emoji: '🥚', rarity: 'purple', category: 'treasure', description: '可能孵化出稀有精灵', effect: '直接获得一个稀有突变' },

  // 金·神品 (0.5%)
  { id: 'dragon-pearl', name: '龙珠', emoji: '🐉', rarity: 'gold', category: 'artifact', description: '传说中的龙之宝珠', effect: '获得500金币+传说突变概率大幅提升' },
  { id: 'immortal-scroll', name: '天书残卷', emoji: '📜', rarity: 'gold', category: 'skill', description: '记载着失传的天界心法', effect: '精灵直接升一级' },
  { id: 'god-tear', name: '神之泪', emoji: '✨', rarity: 'gold', category: 'potion', description: '女神的眼泪化作的宝石', effect: '精灵全属性+50，获得传说突变' },
];

export const DEFAULT_INVENTORY: InventoryState = {
  items: [],
  totalDrops: 0,
  totalGifted: 0,
  totalReceived: 0,
};
