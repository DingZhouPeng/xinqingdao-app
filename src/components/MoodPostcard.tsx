import { useState } from 'react';
import type { MoodType } from '../types';

const MOOD_QUOTES: Record<MoodType, string[]> = {
  happy: ['今天的阳光也为你而来', '快乐值得被看见', '你的笑容点亮了世界'],
  calm: ['平静也是一种力量', '内心的安宁是最珍贵的礼物', '在这片宁静中找到自己'],
  nervous: ['紧张是你在乎的表现', '深呼吸，一切都会过去', '你不是一个人在紧张'],
  angry: ['生气说明你有边界', '先暂停，不急着回应', '你的感受是被理解的'],
  sad: ['乌云背后总有阳光', '你的感受很重要', '难过不需要理由'],
  tired: ['累了就休息一下', '你不是机器，需要充电', '照顾自己是最重要的事'],
  confused: ['迷茫是成长的开始', '不需要立刻找到答案', '看不清的时候，就往前走一步'],
  stressed: ['一次只做一件事', '你已经做得很好了', '把大问题拆成小步骤']
};

interface MoodPostcardProps {
  mood: MoodType;
  moodEmoji: string;
  intensity: number;
  sunlight: number;
  waterDrops: number;
  lamps: number;
  onBack: () => void;
  onShared: () => void;
}

export default function MoodPostcard({
  mood,
  moodEmoji,
  intensity,
  onBack,
  onShared
}: MoodPostcardProps) {
  const [copied, setCopied] = useState(false);
  const quotes = MOOD_QUOTES[mood] || MOOD_QUOTES.calm;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const appUrl = `${window.location.origin}${window.location.pathname}`;

  const handleCopyLink = async () => {
    const text = `我在心晴岛上记录了心情：${quote}\n来心晴岛一起照顾你的情绪小岛吧：${appUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShared();
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShared();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '心晴岛 - 我的心情明信片',
          text: `${quote}\n来心晴岛一起记录心情吧！`,
          url: appUrl
        });
        onShared();
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="relay-create-page">
      <div className="relay-create-header">
        <button className="ghost-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={onBack}>
          ← 返回
        </button>
        <h2 style={{ margin: 0, flex: 1, textAlign: 'center' }}>心情明信片</h2>
        <div style={{ width: '60px' }} />
      </div>

      {/* Postcard Preview */}
      <div className="postcard-preview">
        <div className="postcard-sky">
          <div className="postcard-sun">☀️</div>
        </div>
        <div className="postcard-mood-section">
          <span className="postcard-mood-emoji">{moodEmoji}</span>
          <span className="postcard-mood-label">心情强度: {intensity} 分</span>
        </div>
        <div className="postcard-island-icon">🏝️</div>
        <div className="postcard-quote">"{quote}"</div>
        <div className="postcard-sea" />
        <div className="postcard-footer">
          <span className="postcard-brand">🌊 来心晴岛，一起照顾你的情绪小岛</span>
        </div>
      </div>

      {/* Share Actions */}
      <div className="postcard-share-actions">
        <button className="primary-button" onClick={handleShare} style={{ flex: 1 }}>
          📤 分享明信片
        </button>
        <button className={`ghost-button ${copied ? '' : ''}`} onClick={handleCopyLink} style={{ flex: 1 }}>
          {copied ? '✓ 已复制' : '📋 复制文案'}
        </button>
      </div>

      <div style={{ padding: '0 18px', textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
          分享这张明信片给朋友，邀请他们一起来心晴岛记录心情
        </p>
      </div>
    </div>
  );
}
