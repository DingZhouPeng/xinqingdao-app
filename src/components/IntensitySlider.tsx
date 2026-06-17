interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  return (
    <div className="slider-card">
      <div className="slider-topline">
        <span>情绪强度</span>
        <strong>{value} 分</strong>
      </div>
      <input aria-label="情绪强度" type="range" min="1" max="10" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="slider-labels">
        <span>一点点</span>
        <span>很强烈</span>
      </div>
    </div>
  );
}
