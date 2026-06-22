import { useMemo } from 'react';
import type { MoodType } from '../types';
import type { PetState } from '../types/game';
import type { EvolutionState, EvolutionTrait } from '../types/evolution';
import { getStageDef } from '../services/evolution';
import { getPetMood } from '../services/gameProgress';

interface QingqingPetProps {
  mood?: MoodType;
  petState?: PetState;
  activity?: 'idle' | 'happy' | 'thinking' | 'celebrating';
  size?: 'small' | 'medium' | 'large';
  showStatus?: boolean;
  evolution?: EvolutionState;
  showTraits?: boolean;
}

export default function QingqingPet({
  mood,
  petState,
  activity = 'idle',
  size = 'medium',
  showStatus = false,
  evolution,
  showTraits = false,
}: QingqingPetProps) {
  const displayMood = useMemo(() => {
    if (petState) {
      return getPetMood(petState);
    }
    if (mood === 'happy' || mood === 'calm') return 'happy';
    if (mood === 'sad') return 'sad';
    if (mood === 'tired') return 'tired';
    return 'neutral';
  }, [petState, mood]);

  const stage = evolution?.stage || 1;
  const stageDef = getStageDef(stage);
  const traits = evolution?.traits || [];

  // 分类提取突变
  const colorTrait = traits.find(t => t.type === 'color');
  const particleTraits = traits.filter(t => t.type === 'particle');
  const accessoryTraits = traits.filter(t => t.type === 'accessory');
  const auraTraits = traits.filter(t => t.type === 'aura');

  // 身体颜色类名
  const bodyColorClass = colorTrait ? `sprite-body--${colorTrait.cssClass.replace('evo-color-', '')}` : 'sprite-body--default';
  const stageSizeClass = `sprite-body--stage${stage}`;

  // 光环类名
  const auraClass = auraTraits.length > 0
    ? `sprite-aura--${auraTraits[auraTraits.length - 1].cssClass.replace('evo-aura-', '')}`
    : '';

  // 配饰类名
  const accessoryClasses = accessoryTraits.map(t => t.cssClass);

  // 表情
  const mouthClass = displayMood === 'happy' ? 'sprite-mouth--happy'
    : displayMood === 'sad' ? 'sprite-mouth--sad'
    : '';

  // 粒子类型
  const particleType = particleTraits.length > 0 ? particleTraits[0].cssClass.replace('evo-particle-', '') : null;

  // 尺寸缩放
  const sizeScale = size === 'small' ? 0.65 : size === 'large' ? 1.4 : 1;

  return (
    <div
      className={`sprite-container ${activity === 'celebrating' ? 'sprite-celebrating' : ''}`}
      style={{ transform: `scale(${sizeScale})` }}
    >
      {/* 光环 */}
      {auraClass && <div className={`sprite-aura ${auraClass}`} />}

      {/* 粒子 */}
      {particleType && (
        <div className="sprite-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`particle particle--${particleType}`}>
              {particleType === 'stars' && '⭐'}
              {particleType === 'hearts' && '💕'}
              {particleType === 'snow' && '❄️'}
              {particleType === 'fire' && ''}
              {particleType === 'lightning' && '⚡'}
            </div>
          ))}
        </div>
      )}

      {/* 精灵身体 */}
      <div className={`sprite-body ${bodyColorClass} ${stageSizeClass} ${accessoryClasses.join(' ')}`}>
        {/* 面部 */}
        <div className="sprite-face">
          <div className="sprite-eyes">
            <div className="sprite-eye" />
            <div className="sprite-eye" />
          </div>
          <div className={`sprite-mouth ${mouthClass}`} />
        </div>

        {/* 腮红 */}
        <div className="sprite-cheek sprite-cheek--left" />
        <div className="sprite-cheek sprite-cheek--right" />
      </div>

      {/* 阶段标识 */}
      {showTraits && evolution && (
        <div style={{
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          zIndex: 10,
        }}>
          <span style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--ink-900)',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            {stageDef.emoji} Lv.{evolution.level}
          </span>
        </div>
      )}

      {/* 状态条（饿了/困了等） */}
      {showStatus && petState && (
        <div className="qingqing-status" style={{ top: -55 }}>
          <div className="status-bar">
            <span>🍔</span>
            <div className="bar-fill" style={{ width: `${petState.hunger}%` }} />
          </div>
          <div className="status-bar">
            <span>💖</span>
            <div className="bar-fill bar-happiness" style={{ width: `${petState.happiness}%` }} />
          </div>
          <div className="status-bar">
            <span>⚡</span>
            <div className="bar-fill bar-energy" style={{ width: `${petState.energy}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
