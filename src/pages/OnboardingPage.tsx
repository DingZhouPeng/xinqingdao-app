import { useState } from 'react';
import { createProfile } from '../services/storage';
import type { UserProfile } from '../types';

interface OnboardingPageProps {
  onComplete: (profile: UserProfile) => void;
  pendingRelayCode?: string | null;
}

const focusOptions = ['考试压力', '朋友关系', '亲子沟通', '容易紧张', '没动力', '只是想记录心情'];

export default function OnboardingPage({ onComplete, pendingRelayCode }: OnboardingPageProps) {
  const [nickname, setNickname] = useState('');
  const [focus, setFocus] = useState(focusOptions[0]);
  const [supporter1, setSupporter1] = useState('妈妈/爸爸');
  const [supporter2, setSupporter2] = useState('班主任/心理老师');

  return (
    <div className="page page-onboarding">
      {/* 接力冷启动横幅 */}
      {pendingRelayCode && (
        <section className="relay-coldstart-banner">
          <div className="relay-coldstart-icon">💌</div>
          <div className="relay-coldstart-text">
            <strong>有人给你送来了一份温暖！</strong>
            <p>完成注册后即可查看匿名鼓励消息</p>
          </div>
        </section>
      )}

      <section className="hero-card onboarding-card">
        <div className="brand-mark">🏝️</div>
        <h1>欢迎来到心晴岛</h1>
      </section>

      <section className="panel-card">
        <label className="field-label">叫我什么？</label>
        <input className="text-input" value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="小晴" />

        <label className="field-label">最想被帮助的？</label>
        <div className="chip-row">
          {focusOptions.map((item) => (
            <button key={item} className={`choice-chip ${focus === item ? 'is-selected' : ''}`} onClick={() => setFocus(item)}>
              {item}
            </button>
          ))}
        </div>

        <label className="field-label">难受时找谁？</label>
        <input className="text-input" value={supporter1} onChange={(event) => setSupporter1(event.target.value)} />
        <input className="text-input" value={supporter2} onChange={(event) => setSupporter2(event.target.value)} />

        <button className="primary-button" onClick={() => onComplete(createProfile(nickname, focus, [supporter1, supporter2]))}>
          进入小岛
        </button>
      </section>
    </div>
  );
}
