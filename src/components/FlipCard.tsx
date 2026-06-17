import { useState } from 'react';
import type { WuyuTask } from '../types';

interface FlipCardProps {
  task: WuyuTask;
  index: number;
}

export default function FlipCard({ task, index }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${flipped ? 'is-flipped' : ''}`}
      onClick={() => setFlipped(true)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="card-question">?</div>
          <p>点击翻开</p>
        </div>
        <div className="flip-card-back">
          <div className="task-badge">{task.category}</div>
          <h3>{task.title}</h3>
          <p>{task.detail}</p>
        </div>
      </div>
    </div>
  );
}
