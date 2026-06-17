import type { GameProgress } from '../types';
import QingqingPet from '../components/QingqingPet';
import { getPetMood } from '../services/gameProgress';

interface PetCarePage {
  gameProgress: GameProgress;
  onFeed: () => void;
  onPlay: () => void;
  onRest: () => void;
  onBack: () => void;
}

export default function PetCarePage({ gameProgress, onFeed, onPlay, onRest, onBack }: PetCarePage) {
  const { petState, currency } = gameProgress;
  const petMood = getPetMood(petState);

  const canFeed = currency.coins >= 10;
  const canPlay = currency.coins >= 5;

  // 获取晴晴的提示语
  const getPetMessage = () => {
    if (petState.hunger < 30) return '我好饿呀，给我点吃的吧~ 🍕';
    if (petState.energy < 30) return '好累啊，让我休息一下... 😴';
    if (petState.happiness < 40) return '有点无聊，陪我玩玩好不好？ 🎾';
    if (petState.happiness > 70 && petState.energy > 60) return '今天心情超好！谢谢你~ 💖';
    return '我很好呀，想做什么呢？ 😊';
  };

  return (
    <div className="page pet-care-page">
      <header className="page-header">
        <button className="btn-back" onClick={onBack} aria-label="返回">
          ← 返回
        </button>
        <h1>照顾晴晴</h1>
        <div className="coin-display-small">💰 {currency.coins}</div>
      </header>

      {/* 晴晴展示区 */}
      <section className="pet-display-area fade-in-scale">
        <div className="pet-stage">
          <QingqingPet
            mood={petMood === 'happy' ? 'happy' : petMood === 'sad' ? 'sad' : 'calm'}
            petState={petState}
            activity="idle"
            size="large"
            showStatus={false}
          />
        </div>

        {/* 晴晴的话 */}
        <div className="pet-speech-bubble glass-card">
          <p>{getPetMessage()}</p>
        </div>

        {/* 状态条 */}
        <div className="pet-stats-detailed">
          <div className="stat-bar">
            <div className="stat-bar-header">
              <span className="stat-bar-label">🍽️ 饱食度</span>
              <span className="stat-bar-value">{Math.round(petState.hunger)}</span>
            </div>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill stat-hunger"
                style={{ width: `${petState.hunger}%` }}
              />
            </div>
          </div>

          <div className="stat-bar">
            <div className="stat-bar-header">
              <span className="stat-bar-label">❤️ 快乐度</span>
              <span className="stat-bar-value">{Math.round(petState.happiness)}</span>
            </div>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill stat-happiness"
                style={{ width: `${petState.happiness}%` }}
              />
            </div>
          </div>

          <div className="stat-bar">
            <div className="stat-bar-header">
              <span className="stat-bar-label">⚡ 精力值</span>
              <span className="stat-bar-value">{Math.round(petState.energy)}</span>
            </div>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill stat-energy"
                style={{ width: `${petState.energy}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 操作按钮 */}
      <section className="care-actions">
        <button
          className="btn btn-primary care-action-btn fade-in-up delay-1"
          onClick={onFeed}
          disabled={!canFeed}
        >
          <span className="action-icon">🍕</span>
          <div className="action-text">
            <strong>喂食</strong>
            <span className="action-cost">消耗 10 金币</span>
          </div>
        </button>

        <button
          className="btn btn-accent care-action-btn fade-in-up delay-2"
          onClick={onPlay}
          disabled={!canPlay}
        >
          <span className="action-icon">🎾</span>
          <div className="action-text">
            <strong>玩耍</strong>
            <span className="action-cost">消耗 5 金币</span>
          </div>
        </button>

        <button
          className="btn btn-ghost care-action-btn fade-in-up delay-3"
          onClick={onRest}
        >
          <span className="action-icon">😴</span>
          <div className="action-text">
            <strong>休息</strong>
            <span className="action-cost">免费</span>
          </div>
        </button>
      </section>

      {/* 提示信息 */}
      <section className="care-tips glass-card fade-in-up delay-4">
        <h3>💡 照顾提示</h3>
        <ul>
          <li>晴晴会随时间变饿、变累、快乐度降低</li>
          <li>及时照顾它，保持各项数值健康</li>
          <li>快乐的晴晴会在岛屿上更活泼哦！</li>
        </ul>
      </section>
    </div>
  );
}
