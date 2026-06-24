import { useState, useEffect } from 'react';
import type { GameItem } from '../types/items';
import { rollItems } from '../services/items';

interface DualDungeonProps {
  mode: 'initiate' | 'join';
  dungeonCode?: string;
  onComplete: (rewards: GameItem[]) => void;
  onClose: () => void;
}

export default function DualDungeon({ mode, dungeonCode, onComplete, onClose }: DualDungeonProps) {
  const [phase, setPhase] = useState<'waiting' | 'ready' | 'playing' | 'complete'>(
    mode === 'join' ? 'ready' : 'waiting'
  );
  const [code, setCode] = useState(dungeonCode || generateCode());
  const [copied, setCopied] = useState(false);
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; hit: boolean }>>([]);
  const [timeLeft, setTimeLeft] = useState(15);

  // 生成副本目标
  useEffect(() => {
    if (phase === 'playing') {
      const t = Array.from({ length: 12 }, (_, i) => ({
        id: i, x: 10 + Math.random() * 80, y: 10 + Math.random() * 70, hit: false
      }));
      setTargets(t);
    }
  }, [phase]);

  // 倒计时
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      setPhase('complete');
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let c = '';
    for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
    return c;
  }

  const handleStart = () => setPhase('playing');

  const handleHit = (id: number) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, hit: true } : t));
    setScore(s => s + 10);
  };

  const handleComplete = () => {
    // 奖励根据分数决定
    const count = Math.min(3, Math.floor(score / 30) + 1);
    const rewards = rollItems(count);
    // 双人副本提高稀有度概率
    onComplete(rewards);
  };

  const copyCode = async () => {
    const link = `${window.location.origin}${window.location.pathname}#dungeon=${code}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="dual-dungeon-container" onClick={onClose}>
      <div className="dual-dungeon-card" onClick={e => e.stopPropagation()}>
        {phase === 'waiting' && (
          <>
            <h2>⚔️ 双人副本</h2>
            <p style={{ color: '#7a5a40', fontSize: 13, marginBottom: 16 }}>
              分享副本码给好友，两人一起挑战获得稀有道具
            </p>
            <div className="dual-code-display">{code}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="ghost-button" style={{ flex: 1 }} onClick={copyCode}>
                {copied ? '✓ 已复制' : '📋 复制邀请链接'}
              </button>
              <button className="primary-button" style={{ flex: 1 }} onClick={handleStart}>
                开始挑战
              </button>
            </div>
          </>
        )}

        {phase === 'ready' && (
          <>
            <h2>⚔️ 双人副本</h2>
            <div className="dual-players">
              <div className="dual-player">
                <Qingqing2D size="small" />
                <span className="dual-player-name">我</span>
              </div>
              <div className="dual-vs">⚔️</div>
              <div className="dual-player">
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #e8e0d8, #d0c8c0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  ❓
                </div>
                <span className="dual-player-name">好友</span>
              </div>
            </div>
            <p style={{ color: '#7a5a40', fontSize: 12 }}>点击光点，15秒内尽可能多点击！</p>
            <button className="primary-button" onClick={handleStart} style={{ marginTop: 12 }}>
              准备好了！
            </button>
          </>
        )}

        {phase === 'playing' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#4a3020' }}>⚔️ 双人副本</span>
              <span style={{
                background: 'linear-gradient(135deg, #d4a040, #f0d060)',
                padding: '4px 12px', borderRadius: 12, fontSize: 13, fontWeight: 900, color: '#fff'
              }}>
                ⏱ {timeLeft}s
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#d4a040' }}>得分: {score}</span>
            </div>

            <div style={{
              position: 'relative', height: 200, background: 'linear-gradient(180deg, rgba(212,160,40,.08), rgba(212,160,40,.02))',
              borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(212,160,40,.15)'
            }}>
              {targets.map(t => !t.hit && (
                <button key={t.id}
                  onClick={() => handleHit(t.id)}
                  style={{
                    position: 'absolute', left: `${t.x}%`, top: `${t.y}%`,
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(240,200,80,.8), rgba(212,160,40,.5))',
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 0 12px rgba(240,200,80,.4)',
                    animation: 'pulse 1s ease-in-out infinite',
                    transform: 'translate(-50%, -50%)'
                  }}>
                    ✨
                  </button>
              ))}
            </div>

            <div style={{
              height: 4, background: 'rgba(180,140,110,.1)', borderRadius: 2, marginTop: 8, overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', width: `${(timeLeft / 15) * 100}%`,
                background: 'linear-gradient(90deg, #d4a040, #f0d060)',
                borderRadius: 2, transition: 'width 1s linear'
              }} />
            </div>
          </>
        )}

        {phase === 'complete' && (
          <>
            <h2>🎉 副本完成！</h2>
            <p style={{ color: '#7a5a40', fontSize: 14, marginBottom: 8 }}>得分: {score}</p>
            <div className="dual-reward-preview">
              {rollItems(Math.min(3, Math.floor(score / 30) + 1)).map((item, i) => (
                <div key={i} className={`dual-reward-item item-card rarity-${item.rarity}`}>
                  <span style={{ fontSize: 28 }}>{item.emoji}</span>
                  <span style={{ fontSize: 10, display: 'block' }}>{item.name}</span>
                </div>
              ))}
            </div>
            <button className="primary-button" onClick={handleComplete} style={{ marginTop: 12 }}>
              🎒 领取奖励
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// 本地简版 Q版角色
function Qingqing2D({ size }: { size: 'small' }) {
  return (
    <div className="chibi-container" style={{ transform: 'scale(.7)' }}>
      <div className="chibi-aura aura-common" />
      <div className="chibi-head stage1">
        <div className="chibi-eyes"><div className="chibi-eye" /><div className="chibi-eye" /></div>
        <div className="chibi-mouth" />
        <div className="chibi-blush l" /><div className="chibi-blush r" />
      </div>
      <div className="chibi-body" />
    </div>
  );
}
