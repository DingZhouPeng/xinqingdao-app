import type { MoodType, PetState } from '../types';
import QingqingPet from './QingqingPet';

interface IslandSceneProps {
  mood?: MoodType;
  sunlight: number;
  waterDrops: number;
  lamps: number;
  petState?: PetState;
}

export default function IslandScene({ mood, sunlight, waterDrops, lamps, petState }: IslandSceneProps) {
  const stormy = mood === 'angry' || mood === 'nervous' || mood === 'sad' || mood === 'stressed';
  const hasProgress = sunlight > 0 || waterDrops > 0 || lamps > 0;

  return (
    <section className={`island-scene ${stormy ? 'is-stormy' : 'is-clear'}`} aria-label="心晴岛状态">
      <div className="sky-layer">
        <div className={`sun ${stormy ? 'sun-dim' : ''}`}>☀️</div>
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        {stormy && <div className="cloud cloud-c" />}
        <div className="bird bird-1">🐦</div>
        <div className="bird bird-2">🐦</div>
      </div>

      <div className="sea-layer">
        <div className="sea" />
        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />
      </div>

      <div className="island">
        <div className={`tree ${waterDrops > 3 ? 'tree-grow' : ''}`}>
          <span className="tree-leaves" />
        </div>
        <div className="island-pet">
          <QingqingPet mood={mood} petState={petState} evolution={petState?.evolution} activity="idle" size="small" showStatus />
        </div>
        <div className={`lighthouse ${lamps > 0 ? 'lighthouse-on' : ''}`}>
          {lamps > 0 && <i />}
          🗼
        </div>
        {hasProgress && <div className="sparkle sparkle-1">✨</div>}
        {hasProgress && <div className="sparkle sparkle-2">✨</div>}
      </div>

      <div className="scene-caption">
        <strong>
          {stormy ? '有点阴天' : hasProgress ? '小岛在变好' : '来玩吧'}
        </strong>
        <span>☀️ {sunlight} · 💧 {waterDrops} · 🕯️ {lamps}</span>
      </div>
    </section>
  );
}
