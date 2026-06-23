import { useState } from 'react';
import type { EvolutionState } from '../types/evolution';
import { getStageDef, getHighestRarity, getTotalPossibleTraits } from '../services/evolution';

interface SpriteSnapshotCardProps {
  evolution: EvolutionState;
  relayCode?: string;
  onClose: () => void;
  onShared: () => void;
}

const RARITY_GRADIENTS: Record<string, string> = {
  common: 'linear-gradient(135deg, #faf5f0, #f5ede4)',
  uncommon: 'linear-gradient(135deg, #f8fdf5, #e8f5e0)',
  rare: 'linear-gradient(135deg, #f5f8fd, #e0ecf5)',
  legendary: 'linear-gradient(135deg, #fdf8f0, #faf0e0)',
};

const RARITY_FRAME_COLORS: Record<string, string> = {
  common: 'rgba(180,140,110,0.3)',
  uncommon: 'rgba(83,215,175,0.4)',
  rare: 'rgba(142,207,255,0.4)',
  legendary: 'rgba(255,215,0,0.6)',
};

export default function SpriteSnapshotCard({ evolution, relayCode, onClose, onShared }: SpriteSnapshotCardProps) {
  const [copied, setCopied] = useState(false);
  const stageDef = getStageDef(evolution.stage);
  const highestRarity = getHighestRarity(evolution.traits);
  const totalTraits = getTotalPossibleTraits();

  const shareUrl = relayCode
    ? `${window.location.origin}${window.location.pathname}#relay=${relayCode}`
    : `${window.location.origin}${window.location.pathname}`;

  const shareText = `来看看我的晴晴精灵！\n${stageDef.emoji} 第${evolution.stage}阶段 · ${stageDef.name}\n✨ 已收集 ${evolution.traits.length}/${totalTraits} 个突变\n🏆 最高稀有度: ${highestRarity === 'legendary' ? '传说' : highestRarity === 'rare' ? '稀有' : highestRarity === 'uncommon' ? '罕见' : '常见'}\n\n来心晴岛和我一起养精灵吧 💌\n${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShared();
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShared();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: '心晴岛 · 我的晴晴精灵', text: shareText, url: shareUrl });
        onShared();
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="sprite-snapshot-overlay" onClick={onClose}>
      <div className="sprite-snapshot-card" onClick={e => e.stopPropagation()}
        style={{ background: RARITY_GRADIENTS[highestRarity] }}>
        {/* 稀有度边框 */}
        <div className="snapshot-frame" style={{ borderColor: RARITY_FRAME_COLORS[highestRarity] }}>
          {/* 顶部信息 */}
          <div className="snapshot-header">
            <span className="snapshot-stage-badge" style={{
              background: evolution.stage >= 5 ? 'linear-gradient(135deg, #ffd700, #ff8c00)' :
                          evolution.stage >= 3 ? 'linear-gradient(135deg, #e8b890, #d89870)' :
                          'linear-gradient(135deg, #d4c4b0, #c4b4a0)',
              color: evolution.stage >= 3 ? '#fff' : '#4a3020'
            }}>
              {stageDef.emoji} 第{evolution.stage}阶段 · {stageDef.name}
            </span>
          </div>

          {/* 精灵展示区 */}
          <div className="snapshot-pet-area">
            {/* 装饰精灵展示 */}
            <div className="snapshot-pet-display">
              <span className="snapshot-pet-emoji">{stageDef.emoji}</span>
              <div className="snapshot-pet-sparkles">
                {evolution.traits.filter(t => t.type === 'particle').slice(0, 3).map(t => (
                  <span key={t.id} className="snapshot-sparkle">{t.emoji}</span>
                ))}
              </div>
              <div className="snapshot-pet-glow" style={{
                background: `radial-gradient(circle, ${highestRarity === 'legendary' ? 'rgba(255,215,0,0.4)' : highestRarity === 'rare' ? 'rgba(142,207,255,0.3)' : 'rgba(216,152,112,0.2)'}, transparent 70%)`
              }} />
            </div>
          </div>

          {/* 统计信息 */}
          <div className="snapshot-stats">
            <div className="snapshot-stat">
              <span className="snapshot-stat-value">{evolution.traits.length}/{totalTraits}</span>
              <span className="snapshot-stat-label">突变收集</span>
            </div>
            <div className="snapshot-stat">
              <span className="snapshot-stat-value">Lv.{evolution.level}</span>
              <span className="snapshot-stat-label">精灵等级</span>
            </div>
            <div className="snapshot-stat">
              <span className="snapshot-stat-value">{evolution.fusionCount}</span>
              <span className="snapshot-stat-label">合体次数</span>
            </div>
          </div>

          {/* 突变标签 */}
          <div className="snapshot-traits">
            {evolution.traits.slice(0, 8).map(t => (
              <span key={t.id} className={`snapshot-trait snapshot-trait--${t.rarity}`}>
                {t.emoji} {t.name}
              </span>
            ))}
            {evolution.traits.length > 8 && (
              <span className="snapshot-trait snapshot-trait--more">
                +{evolution.traits.length - 8} 更多
              </span>
            )}
          </div>

          {/* 分享码 / 底部 */}
          {relayCode && (
            <div className="snapshot-code-section">
              <span className="snapshot-code-label">接力码</span>
              <span className="snapshot-code-value">{relayCode}</span>
            </div>
          )}

          {/* Footer */}
          <div className="snapshot-footer">
            <span className="snapshot-footer-text">🌊 来心晴岛，一起照顾你的情绪小岛</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="snapshot-actions">
          <button className="primary-button" onClick={handleShare} style={{ flex: 1 }}>
            📤 分享精灵
          </button>
          <button className="ghost-button" onClick={handleCopy} style={{ flex: 1 }}>
            {copied ? '✓ 已复制' : '📋 复制文案'}
          </button>
        </div>

        <button className="snapshot-close" onClick={onClose}>✕</button>
      </div>

      <style>{`
        .sprite-snapshot-overlay {
          position: fixed; inset: 0; z-index: 10001;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          animation: ss-fade-in .3s ease-out;
        }
        .sprite-snapshot-card {
          width: calc(100% - 32px); max-width: 360px;
          border-radius: 28px; padding: 20px;
          position: relative;
          animation: ss-slide-up .4s cubic-bezier(.34,1.56,.64,1);
        }
        .snapshot-frame {
          border: 2px solid; border-radius: 20px;
          padding: 16px; margin-bottom: 14px;
        }
        .snapshot-header { text-align: center; margin-bottom: 8px; }
        .snapshot-stage-badge {
          display: inline-block; padding: 6px 16px; border-radius: 999px;
          font-size: 13px; font-weight: 800; letter-spacing: .02em;
        }
        .snapshot-pet-area {
          height: 160px; display: flex; align-items: center; justify-content: center;
          margin: 8px 0; position: relative;
        }
        .snapshot-pet-display {
          position: relative; display: flex; align-items: center; justify-content: center;
        }
        .snapshot-pet-emoji {
          font-size: 80px; position: relative; z-index: 1;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));
          animation: sp-float 3s ease-in-out infinite;
        }
        .snapshot-pet-sparkles {
          position: absolute; inset: -20px; pointer-events: none;
        }
        .snapshot-sparkle {
          position: absolute; font-size: 16px;
          animation: sp-sparkle 2s ease-in-out infinite;
        }
        .snapshot-sparkle:nth-child(1) { top: 10%; left: 15%; animation-delay: 0s; }
        .snapshot-sparkle:nth-child(2) { top: 20%; right: 15%; animation-delay: 0.5s; }
        .snapshot-sparkle:nth-child(3) { bottom: 10%; left: 50%; animation-delay: 1s; }
        .snapshot-pet-glow {
          position: absolute; width: 140px; height: 140px; border-radius: 50%;
          animation: sp-glow 2s ease-in-out infinite;
        }
        @keyframes sp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes sp-sparkle { 0%,100%{opacity:0;transform:scale(.5)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes sp-glow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
        .snapshot-stats {
          display: flex; justify-content: center; gap: 24px;
          margin: 12px 0;
        }
        .snapshot-stat { text-align: center; }
        .snapshot-stat-value {
          font-size: 20px; font-weight: 900; color: #4a3020; display: block;
        }
        .snapshot-stat-label {
          font-size: 10px; color: #b89880; font-weight: 600; letter-spacing: .04em;
        }
        .snapshot-traits {
          display: flex; flex-wrap: wrap; gap: 4px; justify-content: center;
          margin: 8px 0;
        }
        .snapshot-trait {
          display: inline-block; padding: 3px 8px; border-radius: 8px;
          font-size: 10px; font-weight: 700;
        }
        .snapshot-trait--common { background: rgba(180,140,110,.12); color: #7a5a40; }
        .snapshot-trait--uncommon { background: rgba(83,215,175,.12); color: #3a7a5a; }
        .snapshot-trait--rare { background: rgba(142,207,255,.12); color: #3a6a8a; }
        .snapshot-trait--legendary { background: linear-gradient(135deg,rgba(255,215,0,.15),rgba(255,180,50,.1)); color: #8a6a10; }
        .snapshot-trait--more { background: rgba(180,140,110,.06); color: #b89880; }
        .snapshot-code-section {
          text-align: center; margin: 10px 0; padding: 8px;
          background: rgba(255,255,255,.5); border-radius: 12px;
        }
        .snapshot-code-label { font-size: 10px; color: #b89880; display: block; }
        .snapshot-code-value {
          font-size: 22px; font-weight: 900; letter-spacing: 3px;
          font-family: monospace; color: #d89870;
        }
        .snapshot-footer { text-align: center; margin-top: 8px; }
        .snapshot-footer-text { font-size: 11px; color: #b89880; font-weight: 500; }
        .snapshot-actions {
          display: flex; gap: 10px;
        }
        .snapshot-close {
          position: absolute; top: 8px; right: 12px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,.8); border: none;
          font-size: 16px; cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: #7a5a40;
        }
        @keyframes ss-fade-in { from{opacity:0} to{opacity:1} }
        @keyframes ss-slide-up { from{opacity:0;transform:translateY(30px)scale(.95)} to{opacity:1;transform:translateY(0)scale(1)} }
      `}</style>
    </div>
  );
}
