import { useState } from 'react';
import type { MoodInput, MoodType, SceneTag } from '../types';
import MoodWeatherPicker from '../components/MoodWeatherPicker';
import MoodMatchGame from '../components/MoodMatchGame';
import IntensitySlider from '../components/IntensitySlider';
import { sceneOptions } from '../data/moodOptions';
import { checkSafety } from '../services/safety';

interface MoodPageProps {
  onNext: (input: MoodInput, safetyHigh: boolean) => void;
  onBubblePopped?: (count: number) => void;
}

export default function MoodPage({ onNext, onBubblePopped }: MoodPageProps) {
  const [useGame, setUseGame] = useState(true);
  const [mood, setMood] = useState<MoodType>('nervous');
  const [intensity, setIntensity] = useState(6);
  const [scene, setScene] = useState<SceneTag>('study');
  const [eventText, setEventText] = useState('明天要考试，我担心自己考不好。');
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleGameComplete = (selectedMood: MoodType, score: number) => {
    setMood(selectedMood);
    setIntensity(Math.min(10, Math.max(1, Math.floor(score / 3) + 5)));
    setGameCompleted(true);
    // 记录气泡消除数
    if (onBubblePopped) {
      onBubblePopped(score);
    }
  };

  const handleSubmit = () => {
    const input = { mood, intensity, scene, eventText };
    const safety = checkSafety([eventText], intensity);
    onNext(input, safety.level === 'high');
  };

  return (
    <div className="page mood-page">
      <header className="page-header">
        <h1>今天是什么天气？</h1>
      </header>

      {useGame && !gameCompleted ? (
        <>
          <div className="game-intro">
            <p>🎮 点击相同情绪的气泡消除！</p>
            <button className="skip-game-btn" onClick={() => setUseGame(false)}>
              跳过游戏
            </button>
          </div>
          <MoodMatchGame onComplete={handleGameComplete} />
        </>
      ) : (
        <>
          {!useGame && (
            <button className="play-game-btn" onClick={() => { setUseGame(true); setGameCompleted(false); }}>
              🎮 玩消消乐
            </button>
          )}
          <MoodWeatherPicker value={mood} onChange={setMood} />
          <IntensitySlider value={intensity} onChange={setIntensity} />

          <section className="panel-card">
            <label className="field-label">来自哪里？</label>
            <div className="chip-row">
              {sceneOptions.map((item) => (
                <button key={item.id} className={`choice-chip ${scene === item.id ? 'is-selected' : ''}`} onClick={() => setScene(item.id)}>
                  {item.emoji} {item.label}
                </button>
              ))}
            </div>

            <label className="field-label">发生了什么？（选填）</label>
            <textarea className="text-area" value={eventText} onChange={(event) => setEventText(event.target.value)} placeholder="写一句或跳过" />

            <button className="primary-button" onClick={handleSubmit}>下一步</button>
          </section>
        </>
      )}
    </div>
  );
}
