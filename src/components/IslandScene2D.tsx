import type { MoodType, PetState } from '../types';
import Qingqing2D from './Qingqing2D';

interface IslandScene2DProps {
  mood?: MoodType;
  sunlight: number;
  waterDrops: number;
  lamps: number;
  petState?: PetState;
}

export default function IslandScene2D({ mood, sunlight, waterDrops, lamps, petState }: IslandScene2DProps) {
  const stormy = mood === 'angry' || mood === 'nervous' || mood === 'sad' || mood === 'stressed';
  const hasProgress = sunlight > 0 || waterDrops > 0 || lamps > 0;
  const treeGrow = waterDrops > 3;
  const lampLit = lamps > 0;

  return (
    <div className="inkwash-scene" style={stormy ? {filter:'grayscale(.2) brightness(.9)'} : undefined}>
      {/* 水墨远山 */}
      <div className="inkwash-mountain m1" />
      <div className="inkwash-mountain m2" />
      <div className="inkwash-mountain m3" />

      {/* 水面 */}
      <div className="inkwash-water" />

      {/* 岛屿 */}
      <div className="inkwash-island" />

      {/* 树 */}
      <div className={`inkwash-tree ${treeGrow ? 'grow' : ''}`}>
        <div className="crown" />
        <div className="trunk" />
      </div>

      {/* 灯塔 */}
      <div className={`inkwash-lighthouse ${lampLit ? 'lit' : ''}`} />

      {/* 飞鸟 */}
      <div className="inkwash-bird" style={{ animationDelay: '0s' }}>🐦</div>
      <div className="inkwash-bird" style={{ animationDelay: '5s' }}>🐦</div>

      {/* 精灵 */}
      <div style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
        <Qingqing2D evolution={petState?.evolution} size="small" />
      </div>

      {/* 粒子 */}
      {hasProgress && (
        <div className="inkwash-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="inkwash-particle" style={{
              left: `${10 + i * 15}%`, bottom: `${20 + Math.random() * 20}%`,
              animationDelay: `${i * .5}s`
            }} />
          ))}
        </div>
      )}

      {/* 场景标牌 */}
      <div className="inkwash-label">
        {stormy ? '🌧 有点阴天' : hasProgress ? '🏝 小岛在变好' : '🏝 心晴岛 · 晴'}
        <span style={{ color: '#a08868', marginLeft: 6 }}>
          ☀{sunlight} · 💧{waterDrops} · 🕯{lamps}
        </span>
      </div>
    </div>
  );
}
