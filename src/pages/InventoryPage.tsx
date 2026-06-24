import { useState } from 'react';
import type { InventoryState, GameItem, ItemRarity } from '../types/items';
import { giftItem, getRarityStats } from '../services/items';
import { RARITY_LABELS } from '../types/items';
import ItemCard from '../components/ItemCard';

interface InventoryPageProps {
  inventory: InventoryState;
  onInventoryChange: (state: InventoryState) => void;
  onBack: () => void;
  onGiftItem: (item: GameItem) => void;
}

export default function InventoryPage({ inventory, onInventoryChange, onBack, onGiftItem }: InventoryPageProps) {
  const [filter, setFilter] = useState<'all' | string>('all');
  const stats = getRarityStats(inventory.items);

  const filtered = filter === 'all'
    ? inventory.items
    : inventory.items.filter(i => i.rarity === filter);

  const rarityOrder: ItemRarity[] = ['gold', 'purple', 'blue', 'green', 'white'];

  return (
    <div style={{ padding: 0, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(180,140,110,.08)'
      }}>
        <button className="ghost-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={onBack}>
          ← 返回
        </button>
        <h2 style={{ margin: 0, flex: 1, fontFamily: 'Noto Serif SC,serif', fontSize: 20, fontWeight: 500, color: '#4a3020' }}>
          法宝背包
        </h2>
        <span className="guofeng-seal">🏮</span>
      </div>

      {/* 稀有度统计 */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 18px' }}>
        {rarityOrder.map(r => (
          <button key={r}
            onClick={() => setFilter(filter === r ? 'all' : r)}
            className={`item-card rarity-${r}`}
            style={{
              flex: 1, padding: '10px 6px', textAlign: 'center',
              opacity: filter !== 'all' && filter !== r ? .4 : 1,
              cursor: 'pointer', border: 'none', background: 'var(--glass)'
            }}>
            <span style={{ fontSize: 18, display: 'block' }}>
              {r === 'gold' ? '👑' : r === 'purple' ? '💜' : r === 'blue' ? '💎' : r === 'green' ? '💚' : '🤍'}
            </span>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#4a3020' }}>{stats[r]}</span>
            <span className="item-rarity-label" style={{ fontSize: 9 }}>{RARITY_LABELS[r]}</span>
          </button>
        ))}
      </div>

      {/* 道具网格 */}
      <div style={{ padding: '0 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {filtered.map(item => (
            <ItemCard key={item.id + Math.random().toString(16).slice(2,6)} item={item} compact
              onGift={(i) => onGiftItem(i)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">🎒</span>
            <span className="empty-state-title">背包空空</span>
            <span className="empty-state-desc">记录心情、发起接力或参与副本获得道具</span>
          </div>
        )}
      </div>

      {/* 统计 */}
      <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'center', gap: 24 }}>
        <span style={{ fontSize: 12, color: '#b89880' }}>总计: {inventory.items.length} 件</span>
        <span style={{ fontSize: 12, color: '#b89880' }}>赠送: {inventory.totalGifted} 次</span>
        <span style={{ fontSize: 12, color: '#b89880' }}>收到: {inventory.totalReceived} 次</span>
      </div>
    </div>
  );
}
