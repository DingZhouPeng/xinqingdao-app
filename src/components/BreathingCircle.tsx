interface BreathingCircleProps {
  active: boolean;
}

export default function BreathingCircle({ active }: BreathingCircleProps) {
  return (
    <div className="breathing-wrap">
      <div className={`breathing-circle ${active ? 'is-active' : ''}`}>
        <div className="breathing-glow" />
        <span className="breathing-text">{active ? '跟着我' : '准备'}</span>
      </div>
      <p className="breathing-hint">
        {active ? '吸气 · 停顿 · 呼气 · 停顿' : '按下开始，先给自己 60 秒。'}
      </p>
    </div>
  );
}
