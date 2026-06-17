import { useState } from 'react';
import type { ABCInput, MoodInput, Recommendation } from '../types';
import { generateRecommendation } from '../services/ruleEngine';

interface AiGuidePageProps {
  moodInput: MoodInput;
  onGenerate: (abc: ABCInput, recommendation: Recommendation) => void;
}

export default function AiGuidePage({ moodInput, onGenerate }: AiGuidePageProps) {
  const [event, setEvent] = useState(moodInput.eventText);
  const [belief, setBelief] = useState('如果我做不好，就说明我不行。');
  const [consequence, setConsequence] = useState('我很紧张，想逃避，也很难开始。');

  const abc = { event, belief, consequence };

  return (
    <div className="page ai-page">
      <header className="page-header assistant-header">
        <div className="assistant-bubble">晴晴</div>
        <div>
          <h1>分开来看看</h1>
        </div>
      </header>

      <section className="chat-card">
        <div className="chat-line bot">发生了什么？</div>
        <textarea className="text-area" value={event} onChange={(e) => setEvent(e.target.value)} />
        <div className="chat-line bot">你的想法？</div>
        <textarea className="text-area" value={belief} onChange={(e) => setBelief(e.target.value)} />
        <div className="chat-line bot">带来了什么感受？</div>
        <textarea className="text-area" value={consequence} onChange={(e) => setConsequence(e.target.value)} />
      </section>

      <button className="primary-button" onClick={() => onGenerate(abc, generateRecommendation(moodInput, abc))}>生成行动卡</button>
    </div>
  );
}
