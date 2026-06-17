import { useState } from 'react';
import BreathingCircle from '../components/BreathingCircle';
import BreathRhythmGame from '../components/BreathRhythmGame';

const reliefModes = [
  { id: 'panic', label: '很慌', emoji: '🌪️', title: '60 秒降噪模式', text: '先不用讲道理，跟着圆圈呼吸。' },
  { id: 'angry', label: '很气', emoji: '⛈️', title: '生气暂停键', text: '把手机放下，90 秒后再决定要不要回复。' },
  { id: 'tired', label: '很累', emoji: '☁️', title: '能量补给', text: '先喝水，伸展肩颈，给身体一点空间。' },
  { id: 'stuck', label: '不想动', emoji: '🌫️', title: '3 分钟启动', text: '只做一件小到不能再小的事。' }
];

export default function QuickReliefPage() {
  const [mode, setMode] = useState(reliefModes[0]);
  const [useGame, setUseGame] = useState(true);
  const [active, setActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleGameComplete = (score: number) => {
    setGameCompleted(true);
    // TODO: 奖励货币
  };

  return (
    <div className="page relief-page">
      <header className="page-header">
        <h1>现在感觉...</h1>
      </header>

      <div className="relief-grid">
        {reliefModes.map((item) => (
          <button key={item.id} className={`relief-chip ${mode.id === item.id ? 'is-selected' : ''}`} onClick={() => setMode(item)}>
            <span>{item.emoji}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>

      {useGame && !gameCompleted ? (
        <>
          <div className="game-intro">
            <p>🎵 跟着晴晴的节奏呼吸</p>
            <button className="skip-game-btn" onClick={() => setUseGame(false)}>
              跳过游戏
            </button>
          </div>
          <BreathRhythmGame onComplete={handleGameComplete} />
        </>
      ) : (
        <>
          {!useGame && (
            <button className="play-game-btn" onClick={() => { setUseGame(true); setGameCompleted(false); }}>
              🎵 玩节奏游戏
            </button>
          )}
          <section className="panel-card relief-card">
            <h2>{mode.title}</h2>
            <BreathingCircle active={active} />
            <button className="primary-button" onClick={() => setActive((value) => !value)}>{active ? '完成' : '开始'}</button>
          </section>
        </>
      )}
    </div>
  );
}
