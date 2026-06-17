import { useState, useEffect, useCallback } from 'react';
import type { MoodType } from '../types';
import { audioManager } from '../services/audio';

interface Bubble {
  id: string;
  mood: MoodType;
  x: number;
  y: number;
  speed: number;
}

interface MoodMatchGameProps {
  onComplete: (selectedMood: MoodType, score: number) => void;
}

const MOODS: Array<{ type: MoodType; emoji: string }> = [
  { type: 'happy', emoji: '😊' },
  { type: 'nervous', emoji: '😰' },
  { type: 'angry', emoji: '😠' },
  { type: 'sad', emoji: '😢' },
  { type: 'tired', emoji: '😴' },
  { type: 'calm', emoji: '😌' }
];

export default function MoodMatchGame({ onComplete }: MoodMatchGameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState<Record<MoodType, number>>({
    happy: 0, calm: 0, nervous: 0, angry: 0, sad: 0, tired: 0, confused: 0, stressed: 0
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  // 生成气泡
  const spawnBubble = useCallback(() => {
    const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const newBubble: Bubble = {
      id: `bubble-${Date.now()}-${Math.random()}`,
      mood: mood.type,
      x: Math.random() * 80 + 10, // 10-90%
      y: 100,
      speed: Math.random() * 1 + 0.5
    };
    setBubbles(prev => [...prev, newBubble]);
  }, []);

  // 点击气泡
  const popBubble = (bubbleId: string, mood: MoodType) => {
    audioManager.playSfx('pop');
    setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    setScore(prev => ({ ...prev, [mood]: prev[mood] + 1 }));
  };

  // 游戏循环
  useEffect(() => {
    if (gameOver) return;

    const spawnInterval = setInterval(spawnBubble, 1000);
    const moveInterval = setInterval(() => {
      setBubbles(prev => prev
        .map(b => ({ ...b, y: b.y - b.speed }))
        .filter(b => b.y > -10)
      );
    }, 50);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      clearInterval(timerInterval);
    };
  }, [gameOver, spawnBubble]);

  // 游戏结束
  useEffect(() => {
    if (gameOver) {
      audioManager.playSfx('complete');
      const maxMood = Object.entries(score).reduce((max, [mood, count]) =>
        count > max.count ? { mood: mood as MoodType, count } : max
      , { mood: 'calm' as MoodType, count: 0 });

      const totalScore = Object.values(score).reduce((sum, val) => sum + val, 0);

      setTimeout(() => {
        onComplete(maxMood.mood, totalScore);
      }, 1500);
    }
  }, [gameOver, score, onComplete]);

  return (
    <div className="mood-match-game">
      <div className="game-header">
        <div className="timer">⏱️ {timeLeft}秒</div>
        <div className="game-score">消除: {Object.values(score).reduce((a, b) => a + b, 0)}</div>
      </div>

      <div className="game-area">
        {bubbles.map(bubble => {
          const moodData = MOODS.find(m => m.type === bubble.mood)!;
          return (
            <button
              key={bubble.id}
              className="mood-bubble"
              style={{
                left: `${bubble.x}%`,
                bottom: `${bubble.y}%`
              }}
              onClick={() => popBubble(bubble.id, bubble.mood)}
            >
              {moodData.emoji}
            </button>
          );
        })}
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-result">
            <h2>🎉 完成！</h2>
            <p>你消除了 {Object.values(score).reduce((a, b) => a + b, 0)} 个气泡</p>
            <p className="result-hint">正在分析你的主要情绪...</p>
          </div>
        </div>
      )}
    </div>
  );
}
