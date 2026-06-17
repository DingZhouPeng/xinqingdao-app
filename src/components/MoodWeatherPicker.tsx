import { useState } from 'react';
import type { MoodType } from '../types';
import { moodOptions } from '../data/moodOptions';

interface MoodWeatherPickerProps {
  value: MoodType;
  onChange: (value: MoodType) => void;
}

export default function MoodWeatherPicker({ value, onChange }: MoodWeatherPickerProps) {
  const [hoveredId, setHoveredId] = useState<MoodType | null>(null);

  const handleSelect = (id: MoodType) => {
    onChange(id);
  };

  return (
    <div className="mood-grid">
      {moodOptions.map((item) => (
        <button
          key={item.id}
          className={`mood-chip ${value === item.id ? 'is-selected' : ''} ${hoveredId === item.id ? 'is-hovered' : ''}`}
          onClick={() => handleSelect(item.id)}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          onTouchStart={() => setHoveredId(item.id)}
          onTouchEnd={() => setHoveredId(null)}
        >
          <span className="mood-emoji">{item.emoji}</span>
          <strong>{item.weather}</strong>
          <small>{item.label}</small>
        </button>
      ))}
    </div>
  );
}
