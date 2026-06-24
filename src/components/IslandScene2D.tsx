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
    <div className="guofeng-scene">
      {/* 天空 */}
      <div className={`guofeng-sky ${stormy ? 'stormy' : 'clear'}`}>
        <div className="guofeng-sun" style={{ opacity: stormy ? .3 : 1 }} />
        <div className="guofeng-cloud a" />
        <div className="guofeng-cloud b" />
        <div className="guofeng-bird" style={{ animationDelay: '0s' }}>🐦</div>
        <div className="guofeng-bird" style={{ animationDelay: '5s' }}>🐦</div>
      </div>

      {/* 远山 */}
      <div className="guofeng-mountains">
        <div className="guofeng-mountain m1" />
        <div className="guofeng-mountain m2" />
        <div className="guofeng-mountain m3" />
      </div>

      {/* 水面 */}
      <div className="guofeng-water" />

      {/* 岛屿 */}
      <div className="guofeng-island" />

      {/* 树 */}
      <div className={`guofeng-tree ${treeGrow ? 'grow' : ''}`}>
        <div className="leaves" />
        <div className="trunk" />
      </div>

      {/* 灯塔 */}
      <div className={`guofeng-lighthouse ${lampLit ? 'lit' : ''}`} />

      {/* 精灵 */}
      <div style={{ position: 'absolute', bottom: '32%', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
        <Qingqing2D evolution={petState?.evolution} size="small" />
      </div>

      {/* 粒子 — 有进展时更多 */}
      {hasProgress && (
        <div className="guofeng-particles">
          {[...Array(hasProgress ? 8 : 3)].map((_, i) => (
            <div key={i} className="guofeng-particle" style={{
              left: `${10 + i * 12}%`,
              bottom: `${20 + Math.random() * 30}%`,
              animationDelay: `${i * .4}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }} />
          ))}
        </div>
      )}

      {/* 场景文字 */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,.8)', padding: '4px 12px', borderRadius: 12,
        fontSize: 11, fontWeight: 700, color: '#4a3020', whiteSpace: 'nowrap'
      }}>
        {stormy ? '🌧 有点阴天' : hasProgress ? '✨ 小岛在变好' : '🏝 来玩吧'}
        <span style={{ color: '#b89880', marginLeft: 6 }}>
          ☀{sunlight} · 💧{waterDrops} · 🕯{lamps}
        </span>
      </div>
    </div>
  );
}
