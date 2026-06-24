import type { GameItem, InventoryState, ItemRarity } from '../types/items';
import { DEFAULT_INVENTORY, ITEM_POOL, RARITY_WEIGHTS } from '../types/items';

const INVENTORY_KEY = 'xinqingdao-inventory-v1';

export function loadInventory(): InventoryState {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) return DEFAULT_INVENTORY;
    return { ...DEFAULT_INVENTORY, ...JSON.parse(raw) };
  } catch { return DEFAULT_INVENTORY; }
}

export function saveInventory(state: InventoryState): void {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(state));
}

// 随机掉落道具
export function rollItem(): GameItem {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  const rarities: ItemRarity[] = ['gold', 'purple', 'blue', 'green', 'white'];

  for (const r of rarities) {
    roll -= RARITY_WEIGHTS[r];
    if (roll <= 0) {
      const pool = ITEM_POOL.filter(i => i.rarity === r);
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return ITEM_POOL[0];
}

// 掉落多个道具
export function rollItems(count: number): GameItem[] {
  return Array.from({ length: count }, () => rollItem());
}

// 添加道具到背包
export function addItem(state: InventoryState, item: GameItem): InventoryState {
  return {
    ...state,
    items: [...state.items, item],
    totalDrops: state.totalDrops + 1,
  };
}

// 赠品道具（移除本地道具，返回新状态和移除的道具）
export function giftItem(state: InventoryState, itemId: string): { newState: InventoryState; gifted: GameItem | null } {
  const idx = state.items.findIndex(i => i.id === itemId);
  if (idx === -1) return { newState: state, gifted: null };

  const items = [...state.items];
  const [gifted] = items.splice(idx, 1);

  return {
    newState: {
      ...state,
      items,
      totalGifted: state.totalGifted + 1,
    },
    gifted,
  };
}

// 接收道具
export function receiveItem(state: InventoryState, item: GameItem): InventoryState {
  return {
    ...state,
    items: [...state.items, item],
    totalReceived: state.totalReceived + 1,
  };
}

// 获取稀有度统计
export function getRarityStats(items: GameItem[]): Record<ItemRarity, number> {
  const stats: Record<ItemRarity, number> = { white: 0, green: 0, blue: 0, purple: 0, gold: 0 };
  for (const item of items) stats[item.rarity]++;
  return stats;
}

// 查找道具
export function findItem(inventory: InventoryState, itemId: string): GameItem | undefined {
  return inventory.items.find(i => i.id === itemId);
}
