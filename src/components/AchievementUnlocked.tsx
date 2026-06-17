import type { Achievement } from '../types/achievements';

interface AchievementUnlockedProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementUnlocked({ achievement, onClose }: AchievementUnlockedProps) {
  return (
    <>
      <div className="achievement-overlay" onClick={onClose} />
      <div className="achievement-popup">
        <div className="achievement-glow" />
        <div className="achievement-icon-large">{achievement.icon}</div>
        <div className="achievement-badge">🎉 成就解锁</div>
        <h2 className="achievement-title">{achievement.title}</h2>
        <p className="achievement-description">{achievement.description}</p>
        <div className="achievement-reward">
          <span className="reward-icon">💰</span>
          <span className="reward-text">+{achievement.reward} 金币</span>
        </div>
        <button className="primary-button" onClick={onClose}>
          太棒了！
        </button>
      </div>
    </>
  );
}
