import WarmSticker from '../components/WarmSticker';
import { stickerOptions, teamStats, warmBottles } from '../data/mockSocial';

export default function SocialPage() {
  return (
    <div className="page social-page">
      <header className="page-header">
        <p className="eyebrow">温暖小队</p>
        <h1>弱社交，强支持</h1>
        <p>这里只能送贴纸和小灯，不做自由评论，也不做情绪排行榜。</p>
      </header>

      <section className="panel-card bottle-card">
        <div className="section-title-row">
          <h2>温暖漂流瓶</h2>
          <span className="mock-badge">模拟数据</span>
        </div>
        <div className="bottle-list">
          {warmBottles.map((bottle) => (
            <article className="bottle-row" key={bottle.id}>
              <span className="bottle-emoji">{bottle.emoji}</span>
              <div className="bottle-content">
                <p>{bottle.text}</p>
                <small className="bottle-sticker">{bottle.sticker}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-card sticker-card">
        <h2>给别人一点温暖</h2>
        <p className="soft-text">选一个贴纸送给需要的人</p>
        <div className="sticker-grid">
          {stickerOptions.map((sticker) => (
            <WarmSticker key={sticker.id} emoji={sticker.emoji} label={sticker.label} />
          ))}
        </div>
      </section>

      <section className="team-tree panel-card">
        <h2>{teamStats.teamName}</h2>
        <div className="tree-visual">🌳</div>
        <div className="team-stats">
          <p>
            <strong>本周小队</strong>一起完成了 <span className="highlight">{teamStats.sharedTasks}</span> 个心晴任务，
            点亮 <span className="highlight">{teamStats.weeklyDrops}</span> 滴水。
          </p>
          <p>
            <strong>班级能量树</strong>今天获得 <span className="highlight">{teamStats.classTreeDrops}</span> 滴匿名水滴。
          </p>
        </div>
      </section>
    </div>
  );
}
