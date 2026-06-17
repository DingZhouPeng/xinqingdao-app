import { useState } from 'react';
import type { ABCInput, EmotionRecord, MoodInput, Recommendation } from '../types';
import ActionCardView from '../components/ActionCardView';
import IntensitySlider from '../components/IntensitySlider';
import { createRecordId } from '../services/storage';

interface ActionPageProps {
  moodInput: MoodInput;
  abc: ABCInput;
  recommendation: Recommendation;
  onComplete: (record: EmotionRecord) => void;
}

export default function ActionPage({ moodInput, abc, recommendation, onComplete }: ActionPageProps) {
  const [after, setAfter] = useState(Math.max(1, moodInput.intensity - 2));
  const [reflection, setReflection] = useState('我发现把大问题拆成小任务后，会更容易开始。');

  const complete = () => {
    onComplete({
      id: createRecordId(),
      date: new Date().toISOString(),
      input: moodInput,
      abc,
      recommendation,
      intensityAfter: after,
      reflection
    });
  };

  return (
    <div className="page action-page">
      <ActionCardView recommendation={recommendation} />

      {recommendation.safetyLevel !== 'high' && (
        <section className="panel-card after-card">
          <h2>完成后，再给心情打个分</h2>
          <IntensitySlider value={after} onChange={setAfter} />
          <label className="field-label">一句收获</label>
          <textarea className="text-area" value={reflection} onChange={(event) => setReflection(event.target.value)} />
          <button className="primary-button" onClick={complete}>完成并保存到心晴册</button>
        </section>
      )}

      {recommendation.safetyLevel === 'high' && (
        <section className="panel-card emergency-card">
          <h2>先联系真实的人</h2>
          <p>现在最重要的是让身边可信任的大人知道你需要陪伴和帮助。</p>
        </section>
      )}
    </div>
  );
}
