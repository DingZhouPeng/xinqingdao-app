import { useState, useEffect } from 'react';
import type { PetState } from '../types';
import { getPetMood } from '../services/gameProgress';

interface PetReminderProps {
  petState: PetState;
  onDismiss: () => void;
  onGoToCare: () => void;
}

export default function PetReminder({ petState, onDismiss, onGoToCare }: PetReminderProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 延迟显示，创造弹出效果
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getMessage = () => {
    if (petState.hunger < 30) return { emoji: '😋', text: '我好饿呀！' };
    if (petState.energy < 30) return { emoji: '😴', text: '好累了...' };
    if (petState.happiness < 40) return { emoji: '😢', text: '有点无聊呢' };
    return { emoji: '😊', text: '嗨~' };
  };

  const { emoji, text } = getMessage();

  const handleDismiss = () => {
    setShow(false);
    setTimeout(onDismiss, 300);
  };

  const handleGoToCare = () => {
    setShow(false);
    setTimeout(onGoToCare, 300);
  };

  return (
    <>
      <div className={`reminder-overlay ${show ? 'show' : ''}`} onClick={handleDismiss} />
      <div className={`pet-reminder ${show ? 'show' : ''}`}>
        <div className="reminder-pet-icon">{emoji}</div>
        <div className="reminder-content">
          <h3>晴晴找你啦</h3>
          <p>{text}</p>
        </div>
        <div className="reminder-actions">
          <button className="ghost-button" style={{ flex: 1 }} onClick={handleDismiss}>
            稍后
          </button>
          <button className="primary-button" style={{ flex: 1 }} onClick={handleGoToCare}>
            去看看
          </button>
        </div>
      </div>
    </>
  );
}
