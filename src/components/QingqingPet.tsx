import { useEffect, useState } from 'react';
import type { MoodType } from '../types';
import type { PetState } from '../types/game';
import { getPetMood } from '../services/gameProgress';

interface QingqingPetProps {
  mood?: MoodType;
  petState?: PetState;
  activity?: 'idle' | 'happy' | 'thinking' | 'celebrating';
  size?: 'small' | 'medium' | 'large';
  showStatus?: boolean;
}

export default function QingqingPet({ mood, petState, activity = 'idle', size = 'medium', showStatus = false }: QingqingPetProps) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (activity === 'celebrating') {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [activity]);

  const getExpression = () => {
    // 优先显示游戏状态
    if (petState) {
      const petMood = getPetMood(petState);
      if (petMood === 'hungry') return '😋';
      if (petMood === 'tired') return '😴';
      if (petMood === 'sad') return '😢';
      if (petMood === 'happy') return '😊';
    }

    if (activity === 'celebrating') return '✨';
    if (activity === 'thinking') return '💭';
    if (activity === 'happy') return '😊';

    if (mood === 'happy' || mood === 'calm') return '☀️';
    if (mood === 'sad') return '🌧️';
    if (mood === 'angry') return '⚡';
    if (mood === 'nervous' || mood === 'stressed') return '💨';
    if (mood === 'tired') return '☁️';
    if (mood === 'confused') return '🌫️';

    return '🌤️';
  };

  const getBodyColor = () => {
    if (petState) {
      const petMood = getPetMood(petState);
      if (petMood === 'hungry') return 'rgba(255,245,200,0.85)';
      if (petMood === 'tired') return 'rgba(230,230,250,0.85)';
      if (petMood === 'sad') return 'rgba(220,230,240,0.85)';
      if (petMood === 'happy') return 'rgba(255,250,205,0.95)';
    }
    return 'rgba(255,245,200,0.85)';
  };

  const sizeClass = size === 'small' ? 'qingqing-small' : size === 'large' ? 'qingqing-large' : 'qingqing-medium';
  const activityClass = activity === 'idle' ? 'qingqing-idle' : activity === 'thinking' ? 'qingqing-thinking' : '';

  return (
    <div className={`qingqing-pet ${sizeClass} ${activityClass} ${bounce ? 'qingqing-bounce' : ''}`}>
      <div className="qingqing-body" style={{ background: `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.95), ${getBodyColor()})` }}>
        <div className="qingqing-glow" />
        <div className="qingqing-face">{getExpression()}</div>
      </div>
      {activity === 'thinking' && (
        <div className="qingqing-bubble">
          <span>🤔</span>
        </div>
      )}
      {showStatus && petState && (
        <div className="qingqing-status">
          <div className="status-bar">
            <span>🍔</span>
            <div className="bar-fill" style={{ width: `${petState.hunger}%` }} />
          </div>
          <div className="status-bar">
            <span>💖</span>
            <div className="bar-fill bar-happiness" style={{ width: `${petState.happiness}%` }} />
          </div>
          <div className="status-bar">
            <span>⚡</span>
            <div className="bar-fill bar-energy" style={{ width: `${petState.energy}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
