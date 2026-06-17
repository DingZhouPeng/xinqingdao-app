import type { AppStateSnapshot, ActiveView, GameProgress } from '../types';
import IslandScene from '../components/IslandScene';
import ProgressPill from '../components/ProgressPill';
import { moodEmoji } from '../data/moodOptions';

interface HomePageProps {
  snapshot: AppStateSnapshot;
  gameProgress: GameProgress;
  onNavigate: (view: ActiveView) => void;
}

export default function HomePage({ snapshot, gameProgress, onNavigate }: HomePageProps) {
  const latest = snapshot.records[0];
  const nickname = snapshot.profile?.nickname ?? '小岛同学';

  return (
    <div className="home-page">
      {/* 顶部导航栏 - 固定 */}
      <header className="home-header">
        <div className="user-info fade-in-up">
          <div className="avatar-circle">👤</div>
          <div>
            <h2 className="nickname">{nickname}</h2>
            <p className="greeting">来照顾你的小岛吧</p>
          </div>
        </div>
        <div className="header-actions fade-in-up delay-1">
          <div className="coin-badge pulse-animation">
            <span className="coin-icon">💰</span>
            <span className="coin-amount">{gameProgress.currency.coins}</span>
          </div>
          <button
            className="lighthouse-btn"
            onClick={() => onNavigate('lighthouse')}
            aria-label="求助灯塔"
          >
            🗼
          </button>
        </div>
      </header>

      {/* 岛屿场景 - 大尺寸展示 */}
      <div className="island-container fade-in-scale delay-2">
        <IslandScene
          mood={latest?.input.mood}
          sunlight={snapshot.sunlight}
          waterDrops={snapshot.waterDrops}
          lamps={snapshot.lamps}
          petState={gameProgress.petState}
        />
      </div>

      {/* 主操作区 - 悬浮卡片 */}
      <section className="main-actions fade-in-up delay-3">
        <button
          className="primary-button action-main"
          onClick={() => onNavigate('mood')}
        >
          <span className="action-icon">🌤️</span>
          <div className="action-content">
            <strong>记录心情</strong>
            <span className="action-hint">+5 金币</span>
          </div>
        </button>
        <button
          className="danger-soft-button action-main"
          onClick={() => onNavigate('relief')}
        >
          <span className="action-icon">🫧</span>
          <div className="action-content">
            <strong>快速补给</strong>
            <span className="action-hint">缓解压力</span>
          </div>
        </button>
      </section>

      {/* 今日状态卡片 */}
      {latest && (
        <section className="today-status glass-card fade-in-up delay-4">
          <div className="status-header">
            <span className="status-label">今日心情</span>
            <span className="status-time">{new Date(latest.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="mood-change-display">
            <div className="mood-item">
              <span className="mood-emoji">{moodEmoji(latest.input.mood)}</span>
              <span className="mood-intensity">{latest.input.intensity} 分</span>
            </div>
            <div className="mood-arrow">→</div>
            <div className="mood-item mood-after">
              <span className="mood-emoji">😌</span>
              <span className="mood-intensity">{latest.intensityAfter} 分</span>
            </div>
          </div>
        </section>
      )}

      {/* 资源状态 */}
      <section className="resources-grid fade-in-up delay-5">
        <ProgressPill icon="☀️" label="阳光" value={snapshot.sunlight} />
        <ProgressPill icon="💧" label="水滴" value={snapshot.waterDrops} />
        <ProgressPill icon="🕯️" label="小灯" value={snapshot.lamps} />
      </section>

      {/* 底部快捷导航 */}
      <nav className="bottom-nav fade-in-up delay-6">
        <button className="nav-item" onClick={() => onNavigate('daily-tasks')}>
          <span className="nav-icon">📋</span>
          <span className="nav-label">每日</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('achievements')}>
          <span className="nav-icon">🏆</span>
          <span className="nav-label">成就</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('pet-care')}>
          <span className="nav-icon">🐾</span>
          <span className="nav-label">照顾</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('shop')}>
          <span className="nav-icon">🛍️</span>
          <span className="nav-label">商店</span>
        </button>
      </nav>
    </div>
  );
}
