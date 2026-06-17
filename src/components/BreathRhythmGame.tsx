import { useState, useEffect, useCallback } from 'react';
import QingqingPet from './QingqingPet';
import { audioManager } from '../services/audio';

interface BreathRhythmGameProps {
  onComplete: (score: number) => void;
}

type BeatPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export default function BreathRhythmGame({ onComplete }: BreathRhythmGameProps) {
  const [phase, setPhase] = useState<BeatPhase>('inhale');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [progress, setProgress] = useState(0);

  const TOTAL_ROUNDS = 6; // 6 个呼吸循环
  const PHASE_DURATION = 4000; // 每个阶段 4 秒

  const PHASES: BeatPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
  const PHASE_LABELS: Record<BeatPhase, string> = {
    inhale: '吸气',
    hold1: '停顿',
    exhale: '呼气',
    hold2: '停顿'
  };

  // 游戏循环
  useEffect(() => {
    if (gameOver || round >= TOTAL_ROUNDS) return;

    let progressTimer: NodeJS.Timeout;
    let phaseTimer: NodeJS.Timeout;

    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / PHASE_DURATION) * 100, 100);
      setProgress(p);

      if (p < 100) {
        progressTimer = setTimeout(updateProgress, 50);
      }
    };

    updateProgress();

    phaseTimer = setTimeout(() => {
      const currentIndex = PHASES.indexOf(phase);
      const nextIndex = (currentIndex + 1) % PHASES.length;

      if (nextIndex === 0) {
        setRound(prev => prev + 1);
      }

      setPhase(PHASES[nextIndex]);
    }, PHASE_DURATION);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(phaseTimer);
    };
  }, [phase, gameOver, round]);

  // 检查游戏结束
  useEffect(() => {
    if (round >= TOTAL_ROUNDS && !gameOver) {
      setGameOver(true);
      audioManager.playSfx('complete');
      setTimeout(() => {
        onComplete(score);
      }, 1500);
    }
  }, [round, gameOver, score, onComplete]);

  // 点击按钮
  const handleTap = useCallback(() => {
    audioManager.playSfx('tap');
    // 在正确时机点击（进度 30%-70%）得分更高
    if (progress >= 30 && progress <= 70) {
      const perfect = progress >= 45 && progress <= 55;
      const points = perfect ? 20 : 10;
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
    } else {
      setCombo(0);
    }
  }, [progress]);

  return (
    <div className="breath-rhythm-game">
      <div className="game-header">
        <div className="round-display">第 {round + 1}/{TOTAL_ROUNDS} 轮</div>
        <div className="score-display">
          <span>得分: {score}</span>
          {combo > 2 && <span className="combo-badge">连击 x{combo}</span>}
        </div>
      </div>

      <div className="breath-stage">
        <div className="qingqing-center">
          <QingqingPet activity={phase === 'inhale' ? 'happy' : 'idle'} size="large" />
        </div>

        <div className="phase-indicator">
          <h2>{PHASE_LABELS[phase]}</h2>
          <div className="progress-ring">
            <svg width="200" height="200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(142,207,255,0.2)"
                strokeWidth="12"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8ecfff" />
                  <stop offset="100%" stopColor="#7de1bc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <button className="tap-button" onClick={handleTap}>
          跟着节奏点
        </button>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-result">
            <h2>🎉 完成！</h2>
            <p>总得分: {score}</p>
            <p className="result-hint">感觉身体放松了吗？</p>
          </div>
        </div>
      )}
    </div>
  );
}
