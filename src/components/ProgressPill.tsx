interface ProgressPillProps {
  icon: string;
  label: string;
  value: string | number;
}

export default function ProgressPill({ icon, label, value }: ProgressPillProps) {
  return (
    <div className="progress-pill">
      <span className="progress-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
