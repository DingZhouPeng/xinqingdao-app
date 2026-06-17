import type { AppStateSnapshot } from '../types';
import SafeNotice from '../components/SafeNotice';

interface LighthousePageProps {
  snapshot: AppStateSnapshot;
}

const scripts = [
  '老师，我最近情绪有点撑不住，想找您聊一聊，可以吗？',
  '妈妈/爸爸，我现在有点难受，可能需要你陪我待一会儿。',
  '朋友，我现在状态不太好，你能不能陪我走一走？'
];

export default function LighthousePage({ snapshot }: LighthousePageProps) {
  const supporters = snapshot.profile?.supporters.length ? snapshot.profile.supporters : ['家长', '班主任', '学校心理老师'];

  return (
    <div className="page lighthouse-page">
      <header className="page-header lighthouse-header">
        <div className="lighthouse-icon">🗼</div>
        <div>
          <p className="eyebrow">求助灯塔</p>
          <h1>你不需要一个人扛着</h1>
          <p>当情绪很强，或者你觉得自己无法独自面对时，请联系真实可信任的人。</p>
        </div>
      </header>

      <SafeNotice variant="strong" />

      <section className="panel-card support-card">
        <h2>我的支持人</h2>
        <p className="soft-text">这些人可以在你需要时陪伴你</p>
        <div className="support-list">
          {supporters.map((person, index) => (
            <div className="support-row" key={person}>
              <span className="support-icon">🫶</span>
              <strong>{person}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-card script-section">
        <h2>不知道怎么开口？</h2>
        <p className="soft-text">可以先复制一句话开始</p>
        <div className="script-list">
          {scripts.map((script, index) => (
            <div className="script-card" key={script}>
              <span className="script-number">{index + 1}</span>
              <p>{script}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="emergency-card panel-card">
        <div className="emergency-icon">⚠️</div>
        <h2>强烈情绪提醒</h2>
        <p>如果你出现伤害自己或他人的想法，或者觉得自己马上撑不住，请立刻告诉身边可信任的大人、老师或家长。</p>
        <p><strong>情况紧急时，请联系当地紧急救助渠道。</strong></p>
      </section>
    </div>
  );
}
