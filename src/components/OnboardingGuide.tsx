import { useState, useEffect } from 'react';

interface OnboardingGuideProps {
  onComplete: () => void;
}

const GUIDE_STEPS = [
  {
    id: 'welcome',
    title: '欢迎来到心晴岛',
    description: '这是你的专属情绪小岛，让我们一起探索吧！',
    target: null,
    emoji: '🏝️'
  },
  {
    id: 'pet',
    title: '认识晴晴',
    description: '这是你的专属伙伴晴晴，点击它试试',
    target: '.island-pet',
    emoji: '👋'
  },
  {
    id: 'record',
    title: '记录心情',
    description: '每天记录心情可以赚取金币哦',
    target: '.action-main:first-child',
    emoji: '🌤️'
  },
  {
    id: 'coins',
    title: '金币系统',
    description: '用金币可以给晴晴买装扮和照顾它',
    target: '.coin-badge',
    emoji: '💰'
  },
  {
    id: 'tasks',
    title: '每日任务',
    description: '完成每日任务获得更多奖励',
    target: '.nav-item:first-child',
    emoji: '📋'
  }
];

export default function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const step = GUIDE_STEPS[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 16,
          left: rect.left + rect.width / 2
        });
      }
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('xinqingdao-onboarding-completed', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('xinqingdao-onboarding-completed', 'true');
    onComplete();
  };

  const step = GUIDE_STEPS[currentStep];

  return (
    <>
      {/* 遮罩层 - 点击可跳过 */}
      <div className="guide-overlay" onClick={handleSkip} />

      {/* 高亮目标元素 */}
      {step.target && (
        <div className="guide-spotlight" style={{
          top: position.top - 60,
          left: position.left,
          transform: 'translate(-50%, -50%)'
        }} />
      )}

      {/* 引导卡片 */}
      <div className={`guide-card ${step.target ? 'with-target' : 'centered'}`} style={
        step.target ? {
          top: position.top,
          left: position.left,
          transform: 'translateX(-50%)'
        } : undefined
      }>
        <div className="guide-emoji">{step.emoji}</div>
        <h3 className="guide-title">{step.title}</h3>
        <p className="guide-description">{step.description}</p>

        <div className="guide-progress">
          {GUIDE_STEPS.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>

        <div className="guide-actions">
          <button className="ghost-button" style={{ flex: 1 }} onClick={handleSkip}>
            跳过
          </button>
          <button className="primary-button" style={{ flex: 1 }} onClick={handleNext}>
            {currentStep === GUIDE_STEPS.length - 1 ? '开始使用' : '下一步'}
          </button>
        </div>
      </div>
    </>
  );
}
