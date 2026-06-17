import type { AppStateSnapshot } from '../types';
import { skillCards } from '../data/skillCards';
import { moodEmoji, moodWeatherLabel } from '../data/moodOptions';
import { getAverageChange, getBestRelief, getMostCommonWeather } from '../services/stats';

interface GrowthPageProps {
  snapshot: AppStateSnapshot;
}

export default function GrowthPage({ snapshot }: GrowthPageProps) {
  const unlocked = new Set(snapshot.records.flatMap((record) => record.recommendation.skillCardIds));

  return (
    <div className="page growth-page">
      <header className="page-header">
        <p className="eyebrow">我的心晴册</p>
        <h1>看见自己一点点变化</h1>
      </header>

      <section className="stats-grid growth-stats">
        <div className="stat-card"><small>本周记录</small><strong>{snapshot.records.length} 次</strong></div>
        <div className="stat-card"><small>常见天气</small><strong>{getMostCommonWeather(snapshot.records)}</strong></div>
        <div className="stat-card"><small>平均变化</small><strong>{getAverageChange(snapshot.records)}</strong></div>
        <div className="stat-card"><small>有效补给</small><strong>{getBestRelief(snapshot.records)}</strong></div>
      </section>

      <section className="panel-card">
        <h2>最近记录</h2>
        {snapshot.records.length === 0 && <p className="empty-text">还没有记录。完成一次心情天气后，这里会出现你的变化。</p>}
        {snapshot.records.map((record) => (
          <article className="record-card" key={record.id}>
            <span className="record-weather">{moodEmoji(record.input.mood)}</span>
            <div>
              <strong>{moodWeatherLabel(record.input.mood)}：{record.input.intensity} → {record.intensityAfter}</strong>
              <p>{record.recommendation.title} · {record.reflection}</p>
              <small>{new Date(record.date).toLocaleString('zh-CN')}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="panel-card">
        <h2>心理技能卡</h2>
        <div className="skill-grid">
          {skillCards.map((card) => (
            <article className={`skill-card ${unlocked.has(card.id) ? 'is-unlocked' : ''}`} key={card.id}>
              <strong>{unlocked.has(card.id) ? '✨' : '🔒'} {card.title}</strong>
              <p>{card.how}</p>
              <small>{card.why}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
