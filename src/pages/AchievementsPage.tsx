import type { AchievementsState } from '../types/achievements';
import type { UserStats } from '../services/achievements';

interface AchievementsPageProps {
  achievementsState: AchievementsState;
  stats: UserStats;
  onBack: () => void;
}

export default function AchievementsPage({ achievementsState, stats, onBack }: AchievementsPageProps) {
  const { achievements, totalUnlocked } = achievementsState;
  const progress = (totalUnlocked / achievements.length) * 100;

  return (
    <div className="page achievements-page">
      <header className="page-header">
        <button className="btn-back" onClick={onBack} aria-label="返回">
          ← 返回
        </button>
        <h1>成就</h1>
        <div style={{ width: '48px' }} />
      </header>

      {/* 总体进度 */}
      <section className="achievements-progress glass-card fade-in-up">
        <div className="progress-header">
          <span className="progress-label">解锁进度</span>
          <span className="progress-count">{totalUnlocked} / {achievements.length}</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">记录次数</span>
            <span className="stat-value">{stats.records}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">连续登录</span>
            <span className="stat-value">{stats.loginStreak} 天</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">气泡消除</span>
            <span className="stat-value">{stats.bubblesPopped}</span>
          </div>
        </div>
      </section>

      {/* 成就列表 */}
      <section className="achievements-list">
        {achievements.map((achievement, index) => (
          <div
            key={achievement.id}
            className={`achievement-card glass-card fade-in-up delay-${Math.min(index + 1, 6)} ${
              achievement.unlocked ? 'unlocked' : 'locked'
            }`}
          >
            <div className="achievement-icon">
              {achievement.unlocked ? achievement.icon : '🔒'}
            </div>
            <div className="achievement-info">
              <h3 className="achievement-name">
                {achievement.unlocked ? achievement.title : '???'}
              </h3>
              <p className="achievement-desc">
                {achievement.unlocked ? achievement.description : '完成隐藏条件解锁'}
              </p>
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="achievement-date">
                  {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')} 解锁
                </p>
              )}
            </div>
            <div className="achievement-reward-badge">
              {achievement.unlocked ? (
                <>
                  <span className="reward-icon">💰</span>
                  <span className="reward-amount">{achievement.reward}</span>
                </>
              ) : (
                <span className="locked-badge">🔒</span>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
