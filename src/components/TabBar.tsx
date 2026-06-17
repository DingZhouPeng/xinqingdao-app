import type { ActiveView } from '../types';

const tabs: Array<{ view: ActiveView; label: string; icon: string }> = [
  { view: 'home', label: '小岛', icon: '🏝️' },
  { view: 'mood', label: '天气', icon: '🌤️' },
  { view: 'relief', label: '补给', icon: '🫧' },
  { view: 'social', label: '温暖', icon: '🕯️' },
  { view: 'growth', label: '成长', icon: '📒' }
];

interface TabBarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

export default function TabBar({ activeView, onNavigate }: TabBarProps) {
  return (
    <nav className="tabbar" aria-label="底部导航">
      {tabs.map((tab) => (
        <button key={tab.view} className={`tabbar-item ${activeView === tab.view ? 'is-active' : ''}`} onClick={() => onNavigate(tab.view)}>
          <span>{tab.icon}</span>
          <small>{tab.label}</small>
        </button>
      ))}
    </nav>
  );
}
