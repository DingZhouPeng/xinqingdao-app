import { useEffect, useState, useMemo } from 'react';
import type { EvolutionState, EvolutionTrait, EvolutionStage } from '../types/evolution';
import { getStageDef } from '../services/evolution';
import QingqingPet from './QingqingPet';

interface EvolutionCelebrationProps {
  evolution: EvolutionState;
  previousStage: EvolutionStage;
  newTraits: EvolutionTrait[];
  onClose: () => void;
}

const BURST_COLORS = [
  '#ff6b9d', '#ffa07a', '#ffd700', '#7de1bc',
  '#8ecfff', '#d9c8ff', '#ffe27a', '#ff9d8a',
  '#53d7af', '#ffb347', '#87ceeb', '#ff85a2',
];

export default function EvolutionCelebration({
  evolution,
  previousStage,
  newTraits,
  onClose,
}: EvolutionCelebrationProps) {
  const [phase, setPhase] = useState<'burst' | 'show' | 'traits'>('burst');
  const stageDef = getStageDef(evolution.stage);

  // 粒子爆炸
  const burstParticles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: BURST_COLORS[i % BURST_COLORS.length],
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      delay: Math.random() * 0.6,
      size: 4 + Math.random() * 8,
    }));
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 1800);
    const t2 = setTimeout(() => setPhase('traits'), 3200);
    const t3 = setTimeout(onClose, 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onClose]);

  const rarityLabel = (t: EvolutionTrait) => {
    const labels: Record<string, string> = {
      common: '常见',
      uncommon: '罕见',
      rare: '稀有',
      legendary: '传说',
    };
    const colors: Record<string, string> = {
      common: '#888',
      uncommon: '#53d7af',
      rare: '#8ecfff',
      legendary: '#ffd700',
    };
    return { text: labels[t.rarity], color: colors[t.rarity] };
  };

  return (
    <div className="evolution-celebration">
      {/* 背景爆炸粒子 */}
      <div className="evo-burst">
        {burstParticles.map(p => (
          <div
            key={p.id}
            className="evo-burst-particle"
            style={{
              '--bx': `${p.x}px`,
              '--by': `${p.y}px`,
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 精灵本体 */}
      <div className="evo-pet">
        <QingqingPet
          evolution={evolution}
          activity="celebrating"
          size="large"
        />
      </div>

      {/* 文字 */}
      {phase !== 'burst' && (
        <div className="evo-text">
          <h2>🎉 进化成功！</h2>
          <p>
            {evolution.stage > previousStage
              ? `你的晴晴从「${getStageDef(previousStage).name}」进化成了「${stageDef.name}」！`
              : '你的晴晴获得了新的力量！'}
          </p>

          {phase === 'traits' && newTraits.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
                {newTraits.map(t => {
                  const r = rarityLabel(t);
                  return (
                    <span key={t.id} className="evo-trait-tag" style={{ background: r.color + '22', border: `1px solid ${r.color}55` }}>
                      {t.emoji} {t.name}
                      <small style={{ opacity: 0.7, marginLeft: 4 }}>【{r.text}】</small>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <span className="evo-stage-badge" style={{
              background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
              color: 'white',
            }}>
              {stageDef.emoji} {stageDef.name} · 第{evolution.stage}阶段
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
