import type { EvolutionState } from '../types/evolution';
import { getStageDef, getHighestRarity } from '../services/evolution';

interface Qingqing2DProps {
  evolution?: EvolutionState;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export default function Qingqing2D({ evolution, size = 'medium', showDetails }: Qingqing2DProps) {
  const stage = evolution?.stage || 1;
  const stageDef = getStageDef(stage);
  const traits = evolution?.traits || [];
  const highestRarity = evolution ? getHighestRarity(traits) : 'common';
  const hasCrown = traits.some(t => t.id === 'acc-crown') || stage >= 5;
  const hasWings = traits.some(t => t.id === 'acc-wings');
  const particleTrait = traits.find(t => t.type === 'particle');

  const scale = size === 'small' ? .65 : size === 'large' ? 1.4 : 1;

  return (
    <div className="chibi-container" style={{ transform: `scale(${scale})` }}>
      {/* 光晕 */}
      <div className={`chibi-aura aura-${highestRarity}`} />

      {/* 皇冠 */}
      {hasCrown && <div className="chibi-crown">👑</div>}

      {/* 配饰 — 翅膀 */}
      <div className={hasWings ? 'chibi-wings' : ''} style={{ position: 'relative' }}>
        {/* 大头 */}
        <div className={`chibi-head stage${stage}`}>
          <div className="chibi-eyes">
            <div className="chibi-eye" />
            <div className="chibi-eye" />
          </div>
          <div className="chibi-mouth" />
          <div className="chibi-blush l" />
          <div className="chibi-blush r" />
        </div>

        {/* 小身体 */}
        <div className="chibi-body" />
      </div>

      {/* 粒子 */}
      {particleTrait && (
        <div style={{
          position: 'absolute', inset: -16, pointerEvents: 'none',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="guofeng-particle" style={{
              left: `${20 + i * 20}%`, top: `${30 + Math.random() * 40}%`,
              animationDelay: `${i * .7}s`, animationDuration: `${2 + Math.random() * 2}s`
            }} />
          ))}
        </div>
      )}

      {/* 阶段信息 */}
      {showDetails && (
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: '#4a3020',
            background: 'rgba(255,255,255,.7)', padding: '2px 8px', borderRadius: 8
          }}>
            {stageDef.emoji} Lv.{evolution?.level || 1}
          </span>
        </div>
      )}
    </div>
  );
}
