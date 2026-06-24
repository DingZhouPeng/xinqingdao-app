import { useState } from 'react';
import type { GameItem } from '../types/items';
import { RARITY_LABELS } from '../types/items';

interface ItemCardProps {
  item: GameItem;
  onGift?: (item: GameItem) => void;
  onUse?: (item: GameItem) => void;
  compact?: boolean;
}

export default function ItemCard({ item, onGift, onUse, compact }: ItemCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div
      className={`item-card rarity-${item.rarity}`}
      onClick={() => setShowDetail(!showDetail)}
      style={compact ? { padding: 10 } : undefined}
    >
      {/* 稀有度光效角标 */}
      <div style={{
        position: 'absolute', top: -1, right: -1,
        width: compact ? 20 : 24, height: compact ? 20 : 24,
        background: item.rarity === 'gold' ? 'linear-gradient(135deg, #d4a040, #f0d060)' :
                    item.rarity === 'purple' ? 'linear-gradient(135deg, #9060c0, #b080d0)' :
                    item.rarity === 'blue' ? 'linear-gradient(135deg, #5090c0, #70b0e0)' :
                    item.rarity === 'green' ? 'linear-gradient(135deg, #4a9060, #6ab080)' :
                    'linear-gradient(135deg, #b0a090, #d0c0b0)',
        borderRadius: '0 14px 0 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: compact ? 8 : 10, fontWeight: 900, color: '#fff' }}>
          {item.rarity === 'gold' ? '神' : item.rarity === 'purple' ? '仙' :
           item.rarity === 'blue' ? '精' : item.rarity === 'green' ? '良' : '凡'}
        </span>
      </div>

      {/* 图标 */}
      <span className="item-icon" style={{ fontSize: compact ? 28 : 40 }}>
        {item.emoji}
      </span>

      {/* 名称 */}
      <span className="item-name" style={{ fontSize: compact ? 12 : 14 }}>
        {item.name}
      </span>

      {/* 稀有度标签 */}
      <div style={{ textAlign: 'center' }}>
        <span className="item-rarity-label">{RARITY_LABELS[item.rarity]}</span>
      </div>

      {/* 详情 */}
      {showDetail && (
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#7a5a40', margin: 0, lineHeight: 1.5 }}>
            {item.description}
          </p>
          <p style={{ fontSize: 10, color: '#b89880', margin: '4px 0 0' }}>
            {item.effect}
          </p>
        </div>
      )}

      {/* 操作按钮 */}
      {(onGift || onUse) && showDetail && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {onUse && (
            <button className="primary-button" style={{ flex: 1, minHeight: 32, fontSize: 12 }}
              onClick={e => { e.stopPropagation(); onUse(item); }}>
              使用
            </button>
          )}
          {onGift && (
            <button className="ghost-button" style={{ flex: 1, minHeight: 32, fontSize: 12 }}
              onClick={e => { e.stopPropagation(); onGift(item); }}>
              🎁 赠送
            </button>
          )}
        </div>
      )}
    </div>
  );
}
