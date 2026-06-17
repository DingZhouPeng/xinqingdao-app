export interface Outfit {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: 'hat' | 'accessory' | 'special';
}

export const OUTFITS: Outfit[] = [
  { id: 'hat-cap', name: '棒球帽', emoji: '🧢', price: 50, category: 'hat' },
  { id: 'hat-crown', name: '皇冠', emoji: '👑', price: 100, category: 'hat' },
  { id: 'hat-party', name: '派对帽', emoji: '🎩', price: 80, category: 'hat' },
  { id: 'acc-bow', name: '蝴蝶结', emoji: '🎀', price: 40, category: 'accessory' },
  { id: 'acc-star', name: '星星', emoji: '⭐', price: 60, category: 'accessory' },
  { id: 'acc-flower', name: '小花', emoji: '🌸', price: 50, category: 'accessory' },
  { id: 'special-rainbow', name: '彩虹', emoji: '🌈', price: 150, category: 'special' },
  { id: 'special-wings', name: '小翅膀', emoji: '🦋', price: 200, category: 'special' }
];
