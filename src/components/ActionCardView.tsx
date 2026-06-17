import type { Recommendation } from '../types';
import FlipCard from './FlipCard';

interface ActionCardViewProps {
  recommendation: Recommendation;
}

export default function ActionCardView({ recommendation }: ActionCardViewProps) {
  return (
    <article className={`action-card-view ${recommendation.safetyLevel === 'high' ? 'is-safety' : ''}`}>
      <div className="card-ribbon">✨ 行动卡</div>
      <h2>{recommendation.title}</h2>

      {recommendation.newThought && (
        <section className="new-thought">
          <span>💡</span>
          <p>{recommendation.newThought}</p>
        </section>
      )}

      <div className="flip-cards-grid">
        {recommendation.tasks.map((task, index) => (
          <FlipCard key={task.id} task={task} index={index} />
        ))}
      </div>
    </article>
  );
}
